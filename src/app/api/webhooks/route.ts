import { NextRequest, NextResponse } from "next/server";
import { mpPayment } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";

// MercadoPago llama a esta URL automaticamente cada vez que el estado de un
// pago cambia (aprobado, rechazado, pendiente...). Aqui confirmamos el
// pedido en la base de datos de forma segura, sin depender del navegador
// del cliente (que podria cerrar la pestana antes de volver a la web).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const url = new URL(req.url);

    const paymentId =
      body?.data?.id ?? url.searchParams.get("data.id") ?? url.searchParams.get("id");

    const topic = body?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");

    if (topic !== "payment" || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const payment = await mpPayment.get({ id: paymentId });
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    let status: "confirmed" | "cancelled" | "pending_payment" = "pending_payment";
    if (payment.status === "approved") status = "confirmed";
    else if (payment.status === "rejected" || payment.status === "cancelled") status = "cancelled";

    const supabase = createAdminClient();
    await supabase
      .from("orders")
      .update({ status, mp_payment_id: String(paymentId) })
      .eq("id", orderId);

    if (status === "confirmed") {
      const { data: order } = await supabase
        .from("orders")
        .select("coupon_code, user_id")
        .eq("id", orderId)
        .single();

      if (order?.coupon_code && order.user_id) {
        await supabase
          .from("coupons")
          .update({ is_used: true })
          .eq("code", order.coupon_code)
          .eq("user_id", order.user_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook MercadoPago error:", err);
    // Respondemos 200 igual para que MercadoPago no siga reintentando sin fin.
    return NextResponse.json({ received: true });
  }
}