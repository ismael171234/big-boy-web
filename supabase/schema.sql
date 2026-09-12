-- =========================================================
-- BURGER HOUSE — Supabase schema
-- Run this in the Supabase SQL editor (Project > SQL Editor)
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- PROFILES (1:1 with auth.users)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  purchase_count integer not null default 0,
  created_at timestamptz not null default now()
);


alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- PRODUCTS + customizable option groups (combos, extras, etc.)
-- ---------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text not null default 'burgers', -- burgers | combos | sides | drinks | desserts
  base_price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  image_url text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
create policy "Products are publicly readable"
  on public.products for select
  using (true);

-- A product can have several option groups: "Elige 2 burgers", "Añade salsas", etc.
create table if not exists public.option_groups (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  is_required boolean not null default false,
  min_select integer not null default 0,
  max_select integer not null default 1,
  sort_order integer not null default 0
);

alter table public.option_groups enable row level security;
create policy "Option groups are publicly readable"
  on public.option_groups for select
  using (true);

create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.option_groups(id) on delete cascade,
  name text not null,
  price_addon numeric(10,2) not null default 0,
  sort_order integer not null default 0
);

alter table public.options enable row level security;
create policy "Options are publicly readable"
  on public.options for select
  using (true);

-- ---------------------------------------------------------
-- RESERVATIONS (also logged in DB even though the user is redirected to WhatsApp)
-- ---------------------------------------------------------
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text not null,
  party_size integer not null,
  reservation_date date not null,
  reservation_time time not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.reservations enable row level security;
create policy "Users can insert their own reservation"
  on public.reservations for insert
  with check (auth.uid() = user_id or user_id is null);
create policy "Users can view their own reservations"
  on public.reservations for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------
-- ORDERS / ORDER ITEMS
-- ---------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'confirmed', -- confirmed | cancelled
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  coupon_code text,
  fulfillment_channel text not null default 'whatsapp',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id or user_id is null);
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null,
  selected_options jsonb not null default '[]'
);

alter table public.order_items enable row level security;
create policy "Users can insert items for their own order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or o.user_id is null)
    )
  );
create policy "Users can view items for their own order"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------
-- COUPONS (auto-issued every 10 confirmed orders)
-- ---------------------------------------------------------
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text unique not null,
  discount_percent numeric(5,2) not null default 15,
  is_used boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

alter table public.coupons enable row level security;
create policy "Users can view their own coupons"
  on public.coupons for select
  using (auth.uid() = user_id);
create policy "Users can mark their own coupon as used"
  on public.coupons for update
  using (auth.uid() = user_id);

-- Every time a confirmed order is inserted: bump the user's purchase_count,
-- and every 10th purchase, auto-generate a discount coupon.
create or replace function public.handle_new_order()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_count integer;
  new_code text;
begin
  if new.user_id is null or new.status <> 'confirmed' then
    return new;
  end if;

  update public.profiles
    set purchase_count = purchase_count + 1
    where id = new.user_id
    returning purchase_count into new_count;

  if new_count is not null and new_count % 10 = 0 then
    new_code := 'BH' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    insert into public.coupons (user_id, code, discount_percent, expires_at)
    values (new.user_id, new_code, 15, now() + interval '30 days');
  end if;

  return new;
end;
$$;

drop trigger if exists on_order_created on public.orders;
create trigger on_order_created
  after insert on public.orders
  for each row execute procedure public.handle_new_order();

-- ---------------------------------------------------------
-- Storage bucket for product photos (create via dashboard or here)
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');
