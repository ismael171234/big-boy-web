"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getStaffRole } from "@/lib/staff-auth";

const TZ = "America/Lima";
// Estados que cuentan como venta real (el cliente ya pagó)
const PAID_STATUSES = ["confirmed", "preparing", "ready", "delivered"];

export type DashboardData = {
  kpis: {
    salesToday: number;
    ordersToday: number;
    pendingPayment: number;
    inKitchen: number;
    avgTicket: number;
    salesDeltaPct: number | null; // % vs ayer (null si ayer fue 0)
  };
  days: { key: string; label: string; weekday: string; sales: number; orders: number }[];
  statusCounts: Record<string, number>;
  topProducts: { name: string; qty: number }[];
  recent: {
    id: string;
    short: string;
    total: number;
    status: string;
    createdAt: string;
    items: string;
  }[];
  totals: { orders: number; sales: number; users: number; products: number };
};

// "2026-10-16" según la hora de Lima
function dayKey(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

type OrderRow = {
  id: string;
  status: string;
  total: number | string;
  created_at: string;
  order_items: { product_name: string; quantity: number }[] | null;
};

export async function getDashboardData(): Promise<DashboardData | null> {
  const role = await getStaffRole();
  if (role !== "admin") return null;

  const supabase = createAdminClient();

  const [ordersRes, usersRes, productsRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, status, total, created_at, order_items(product_name, quantity)", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
  ]);

  if (ordersRes.error) {
    console.error("getDashboardData error:", ordersRes.error.message);
    return null;
  }

  const orders = (ordersRes.data ?? []) as unknown as OrderRow[];
  const now = Date.now();
  const todayKey = dayKey(new Date(now));
  const yesterdayKey = dayKey(new Date(now - 86400000));

  // Últimos 7 días (del más antiguo al de hoy)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now - (6 - i) * 86400000);
    const key = dayKey(d);
    const [, m, dd] = key.split("-");
    const weekday = new Intl.DateTimeFormat("es-PE", {
      timeZone: "UTC",
      weekday: "short",
    }).format(new Date(`${key}T12:00:00Z`));
    return {
      key,
      label: `${dd}/${m}`,
      weekday: weekday.replace(".", ""),
      sales: 0,
      orders: 0,
    };
  });
  const dayIndex = new Map(days.map((d, i) => [d.key, i]));

  const statusCounts: Record<string, number> = {};
  const productMap = new Map<string, number>();
  let salesToday = 0;
  let ordersToday = 0;
  let salesYesterday = 0;
  let totalSales = 0;
  let paidCount = 0;

  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
    if (!PAID_STATUSES.includes(o.status)) continue;

    const total = Number(o.total) || 0;
    const key = dayKey(new Date(o.created_at));
    totalSales += total;
    paidCount += 1;

    if (key === todayKey) {
      salesToday += total;
      ordersToday += 1;
    }
    if (key === yesterdayKey) salesYesterday += total;

    const idx = dayIndex.get(key);
    if (idx !== undefined) {
      days[idx].sales += total;
      days[idx].orders += 1;
    }

    for (const it of o.order_items ?? []) {
      productMap.set(it.product_name, (productMap.get(it.product_name) ?? 0) + it.quantity);
    }
  }

  const topProducts = [...productMap.entries()]
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const recent = orders.slice(0, 8).map((o) => ({
    id: o.id,
    short: o.id.slice(0, 8).toUpperCase(),
    total: Number(o.total) || 0,
    status: o.status,
    createdAt: o.created_at,
    items: (o.order_items ?? [])
      .map((i) => `${i.quantity}× ${i.product_name}`)
      .join(", "),
  }));

  return {
    kpis: {
      salesToday,
      ordersToday,
      pendingPayment: statusCounts["pending_payment"] ?? 0,
      inKitchen: (statusCounts["confirmed"] ?? 0) + (statusCounts["preparing"] ?? 0),
      avgTicket: paidCount > 0 ? totalSales / paidCount : 0,
      salesDeltaPct:
        salesYesterday > 0 ? ((salesToday - salesYesterday) / salesYesterday) * 100 : null,
    },
    days,
    statusCounts,
    topProducts,
    recent,
    totals: {
      orders: ordersRes.count ?? orders.length,
      sales: totalSales,
      users: usersRes.count ?? 0,
      products: productsRes.count ?? 0,
    },
  };
}

/* ───────────────────────── PEDIDOS (Parte 2) ───────────────────────── */

export type AdminOrder = {
  id: string;
  short: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  channel: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    options: string[];
  }[];
};

type AdminOrderRow = {
  id: string;
  user_id: string | null;
  status: string;
  total: number | string;
  subtotal: number | string;
  discount: number | string | null;
  coupon_code: string | null;
  fulfillment_channel: string | null;
  created_at: string;
  order_items:
    | {
        product_name: string;
        quantity: number;
        unit_price: number | string;
        selected_options: { optionName?: string; groupName?: string }[] | null;
      }[]
    | null;
};

export async function getAdminOrders(): Promise<AdminOrder[] | null> {
  const role = await getStaffRole();
  if (role !== "admin") return null;

  const supabase = createAdminClient();

  const [ordersRes, profilesRes, usersRes] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, user_id, status, total, subtotal, discount, coupon_code, fulfillment_channel, created_at, order_items(product_name, quantity, unit_price, selected_options)"
      )
      .order("created_at", { ascending: false })
      .limit(300),
    supabase.from("profiles").select("id, full_name, phone"),
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  if (ordersRes.error) {
    console.error("getAdminOrders error:", ordersRes.error.message);
    return null;
  }

  const profiles = new Map(
    (profilesRes.data ?? []).map((p) => [p.id as string, p as { full_name: string | null; phone: string | null }])
  );
  const emails = new Map((usersRes.data?.users ?? []).map((u) => [u.id, u.email ?? ""]));

  const rows = (ordersRes.data ?? []) as unknown as AdminOrderRow[];

  return rows.map((o) => {
    const profile = o.user_id ? profiles.get(o.user_id) : undefined;
    return {
      id: o.id,
      short: o.id.slice(0, 8).toUpperCase(),
      status: o.status,
      total: Number(o.total) || 0,
      subtotal: Number(o.subtotal) || 0,
      discount: Number(o.discount) || 0,
      couponCode: o.coupon_code,
      channel: o.fulfillment_channel ?? "—",
      createdAt: o.created_at,
      customerName: profile?.full_name || "Cliente sin nombre",
      customerEmail: o.user_id ? emails.get(o.user_id) || "—" : "Invitado (sin cuenta)",
      customerPhone: profile?.phone || "",
      items: (o.order_items ?? []).map((i) => ({
        name: i.product_name,
        quantity: i.quantity,
        unitPrice: Number(i.unit_price) || 0,
        options: (i.selected_options ?? [])
          .map((s) => s.optionName)
          .filter((x): x is string => Boolean(x)),
      })),
    };
  });
}