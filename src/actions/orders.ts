"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartLine } from "@/lib/types";

export type PlaceOrderInput = {
  lines: CartLine[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
};

export async function placeOrder(input: PlaceOrderInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      subtotal: input.subtotal,
      discount: input.discount,
      total: input.total,
      coupon_code: input.couponCode ?? null,
      fulfillment_channel: "whatsapp",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("placeOrder error:", orderError?.message);
    return { ok: false as const };
  }

  const items = input.lines.map((line) => ({
    order_id: order.id,
    product_id: line.productId,
    product_name: line.productName,
    quantity: line.quantity,
    unit_price: line.unitPrice,
    selected_options: line.selectedOptions,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(items);
  if (itemsError) {
    console.error("placeOrder items error:", itemsError.message);
  }

  // If a coupon was used, mark it as spent.
  if (input.couponCode && user) {
    await supabase
      .from("coupons")
      .update({ is_used: true })
      .eq("code", input.couponCode)
      .eq("user_id", user.id);
  }

  return { ok: true as const, orderId: order.id as string };
}

export async function getActiveCoupons() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("coupons")
    .select("code, discount_percent, expires_at")
    .eq("user_id", user.id)
    .eq("is_used", false)
    .gt("expires_at", new Date().toISOString());

  if (error) {
    console.error("getActiveCoupons error:", error.message);
    return [];
  }
  return data ?? [];
}
