"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStaffRole } from "@/lib/staff-auth";

const BUCKET = "product-images";
const CATEGORIES = ["combos", "burgers", "drinks", "desserts"];

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  compareAtPrice: number | null;
  imageUrl: string;
  isFeatured: boolean;
  isAvailable: boolean;
  optionGroupsCount: number;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  base_price: number | string;
  compare_at_price: number | string | null;
  image_url: string | null;
  is_featured: boolean;
  is_available: boolean | null;
  option_groups: { id: string }[] | null;
};

// Refresca la web pública para que el cambio se vea al instante
function refreshPublicSite() {
  revalidatePath("/");
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "producto"
  );
}

export async function listAdminProducts(): Promise<AdminProduct[] | null> {
  const role = await getStaffRole();
  if (role !== "admin") return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, category, base_price, compare_at_price, image_url, is_featured, is_available, option_groups(id)"
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("listAdminProducts error:", error.message);
    return null;
  }

  return ((data ?? []) as unknown as ProductRow[]).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    category: p.category,
    basePrice: Number(p.base_price) || 0,
    compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
    imageUrl: p.image_url ?? "",
    isFeatured: p.is_featured,
    isAvailable: p.is_available !== false,
    optionGroupsCount: p.option_groups?.length ?? 0,
  }));
}

export type SaveProductInput = {
  id?: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  compareAtPrice: number | null;
  imageUrl: string;
  isFeatured: boolean;
  isAvailable: boolean;
};

export async function saveProduct(
  input: SaveProductInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const role = await getStaffRole();
  if (role !== "admin") return { ok: false, error: "No tienes permiso." };

  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) {
    return { ok: false, error: "El nombre debe tener entre 2 y 80 caracteres." };
  }
  if (!CATEGORIES.includes(input.category)) {
    return { ok: false, error: "Elige una categoría válida." };
  }
  if (!Number.isFinite(input.basePrice) || input.basePrice <= 0) {
    return { ok: false, error: "El precio debe ser mayor a 0." };
  }
  if (input.compareAtPrice !== null) {
    if (!Number.isFinite(input.compareAtPrice) || input.compareAtPrice <= input.basePrice) {
      return {
        ok: false,
        error: "El precio anterior debe ser mayor al precio actual (o déjalo vacío).",
      };
    }
  }

  const supabase = createAdminClient();
  const fields = {
    name,
    description: input.description.trim(),
    category: input.category,
    base_price: Number(input.basePrice.toFixed(2)),
    compare_at_price:
      input.compareAtPrice === null ? null : Number(input.compareAtPrice.toFixed(2)),
    image_url: input.imageUrl.trim() || null,
    is_featured: input.isFeatured,
    is_available: input.isAvailable,
  };

  if (input.id) {
    const { error } = await supabase.from("products").update(fields).eq("id", input.id);
    if (error) {
      console.error("saveProduct update error:", error.message);
      return { ok: false, error: "No se pudo guardar. Intenta de nuevo." };
    }
  } else {
    // Slug único (identificador en texto, ej. "combo-big-bite")
    const base = slugify(name);
    const { data: existing } = await supabase
      .from("products")
      .select("slug")
      .like("slug", `${base}%`);
    const taken = new Set((existing ?? []).map((r) => r.slug as string));
    let slug = base;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

    // Se agrega al final de la carta
    const { data: last } = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1);
    const sortOrder = ((last?.[0]?.sort_order as number | undefined) ?? 0) + 1;

    const { error } = await supabase
      .from("products")
      .insert({ ...fields, slug, sort_order: sortOrder });
    if (error) {
      console.error("saveProduct insert error:", error.message);
      return { ok: false, error: "No se pudo crear el producto. Intenta de nuevo." };
    }
  }

  refreshPublicSite();
  return { ok: true };
}

export async function setProductFlag(
  id: string,
  field: "is_available" | "is_featured",
  value: boolean
): Promise<{ ok: boolean }> {
  const role = await getStaffRole();
  if (role !== "admin") return { ok: false };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ [field]: value })
    .eq("id", id);
  if (error) {
    console.error("setProductFlag error:", error.message);
    return { ok: false };
  }
  refreshPublicSite();
  return { ok: true };
}

export async function deleteProduct(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const role = await getStaffRole();
  if (role !== "admin") return { ok: false, error: "No tienes permiso." };

  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("deleteProduct error:", error.message);
    // 23503 = el producto está usado en pedidos antiguos
    if (error.code === "23503") {
      return {
        ok: false,
        error: "Este producto tiene pedidos asociados. Mejor ocúltalo (botón Disponible).",
      };
    }
    return { ok: false, error: "No se pudo eliminar. Intenta de nuevo." };
  }

  // Si la foto estaba en nuestro bucket, la borramos también (sin romper si falla)
  const url = (product?.image_url as string | null) ?? "";
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    await supabase.storage.from(BUCKET).remove([url.slice(idx + marker.length)]);
  }

  refreshPublicSite();
  return { ok: true };
}

// Paso 1 de subir una foto: el servidor entrega un permiso temporal de subida.
// La foto viaja directo del navegador a Supabase (así no importa su tamaño).
export async function createProductImageUpload(
  fileName: string,
  contentType: string
): Promise<
  | { ok: true; path: string; token: string; publicUrl: string }
  | { ok: false; error: string }
> {
  const role = await getStaffRole();
  if (role !== "admin") return { ok: false, error: "No tienes permiso." };

  if (!/^image\/(png|jpe?g|webp|gif|avif)$/.test(contentType)) {
    return { ok: false, error: "Solo se permiten imágenes (PNG, JPG, WEBP, GIF o AVIF)." };
  }

  const ext = (fileName.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "png"}`;

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("createProductImageUpload error:", error?.message);
    return {
      ok: false,
      error: "No se pudo preparar la subida. ¿Creaste el bucket con el SQL de la Parte 3?",
    };
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true, path, token: data.token, publicUrl: pub.publicUrl };
}