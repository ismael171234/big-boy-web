"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  clearStaffCookie,
  getStaffRole,
  setStaffCookie,
  verifyCredentials,
  type StaffRole,
} from "@/lib/staff-auth";

export async function loginStaff(role: StaffRole, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!verifyCredentials(role, email, password)) {
    return { ok: false as const, error: "Correo o clave incorrectos." };
  }
  await setStaffCookie(role);
  return { ok: true as const };
}

export async function logoutStaff() {
  await clearStaffCookie();
}

// Pedidos activos para cocina: ya pagados, todavia no entregados.
export async function listKitchenOrders() {
  const role = await getStaffRole();
  if (!role) return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, total, created_at, order_items(product_name, quantity, selected_options)"
    )
    .in("status", ["confirmed", "preparing", "ready"])
    .order("created_at", { ascending: true });

  if (error) {
    console.error("listKitchenOrders error:", error.message);
    return [];
  }
  return data ?? [];
}

// Historial completo, solo para el panel de admin.
export async function listAllOrders() {
  const role = await getStaffRole();
  if (role !== "admin") return [];

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, total, created_at, order_items(product_name, quantity, selected_options)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("listAllOrders error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function updateOrderStatus(orderId: string, status: string) {
  const role = await getStaffRole();
  if (!role) return { ok: false as const };

  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

  if (error) {
    console.error("updateOrderStatus error:", error.message);
    return { ok: false as const };
  }
  return { ok: true as const };
}