"use server";

import { createClient } from "@/lib/supabase/server";
import { mpPreference } from "@/lib/mercadopago";
import type { CartLine } from "@/lib/types";

export type PlaceOrderInput = {
  lines: CartLine[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
};

async function insertPendingOrder(input: PlaceOrderInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      status: "pending_payment",
      subtotal: input.subtotal,
      discount: input.discount,
      total: input.total,
      coupon_code: input.couponCode ?? null,
      fulfillment_channel: "mercadopago",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("insertPendingOrder error:", orderError?.message);
    return null;
  }

  const items = input.lines.map((line) => ({
    order_id: order.id,
    // product_id en la tabla es uuid y hace referencia a public.products;
    // tus productos viven como datos estaticos (slugs tipo "big-temptation"),
    // asi que no son uuids validos. Lo dejamos en null para no romper el
    // insert; el nombre del producto ya queda guardado en product_name.
    product_id: null,
    product_name: line.productName,
    quantity: line.quantity,
    unit_price: line.unitPrice,
    selected_options: line.selectedOptions,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(items);
  if (itemsError) console.error("insertPendingOrder items error:", itemsError.message);

  return { orderId: order.id as string };
}

// Crea el pedido "pendiente de pago" + la preferencia de MercadoPago, y
// devuelve la URL (initPoint) a la que hay que redirigir al cliente.
export async function createPaymentPreference(input: PlaceOrderInput) {
  const created = await insertPendingOrder(input);
  if (!created) return { ok: false as const };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
  // MercadoPago exige que auto_return solo se use con back_urls publicas en
  // https. En desarrollo local (http://localhost...) lo omitimos, o la
  // creacion de la preferencia falla con "auto_return invalid".
  const isPubliclyReachable = siteUrl.startsWith("https://");

  try {
    const preference = await mpPreference.create({
      body: {
        items: input.lines.map((line) => {
          const optionsTotal = line.selectedOptions.reduce(
            (sum, o) => sum + o.priceAddon,
            0
          );
          return {
            id: line.productId,
            title: line.productName,
            quantity: line.quantity,
            unit_price: Number((line.unitPrice + optionsTotal).toFixed(2)),
            currency_id: "PEN",
          };
        }),
        external_reference: created.orderId,
        back_urls: {
          success: `${siteUrl}/pago/exito`,
          pending: `${siteUrl}/pago/pendiente`,
          failure: `${siteUrl}/pago/fallo`,
        },
        ...(isPubliclyReachable ? { auto_return: "approved" as const } : {}),
        notification_url: isPubliclyReachable
          ? `${siteUrl}/api/webhooks/mercadopago`
          : undefined,
      },
    });

    const supabase = await createClient();
    await supabase
      .from("orders")
      .update({ mp_preference_id: preference.id })
      .eq("id", created.orderId);

    if (!preference.init_point) {
      console.error("createPaymentPreference: MercadoPago no devolvio init_point");
      return { ok: false as const };
    }

    return {
      ok: true as const,
      orderId: created.orderId,
      initPoint: preference.init_point,
    };
  } catch (err) {
    console.error("createPaymentPreference MercadoPago error:", err);
    return { ok: false as const };
  }
}

// Se mantiene por si alguna vez se quiere confirmar un pedido directo sin
// pasar por una pasarela de pago (por ejemplo, pago contraentrega).
export async function placeOrder(input: PlaceOrderInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      status: "confirmed",
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
    product_id: null,
    product_name: line.productName,
    quantity: line.quantity,
    unit_price: line.unitPrice,
    selected_options: line.selectedOptions,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(items);
  if (itemsError) {
    console.error("placeOrder items error:", itemsError.message);
  }

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