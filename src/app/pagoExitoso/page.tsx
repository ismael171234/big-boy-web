"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buildOrderMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { useCartStore } from "@/lib/cart-store";
import type { CartLine } from "@/lib/types";

type PendingOrder = {
  lines: CartLine[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
};

function PagoExitosoContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingOrder");
    if (raw) {
      setOrder(JSON.parse(raw));
      sessionStorage.removeItem("pendingOrder");
    }
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const whatsappUrl = order
    ? buildWhatsappUrl(
        buildOrderMessage({
          lines: order.lines,
          total: order.total,
          couponCode: order.couponCode,
          discount: order.discount,
        }) + "\n\nYa realice el pago por MercadoPago. ✅"
      )
    : "#";

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 py-20 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-600" />
      <h1 className="font-display text-4xl tracking-wide text-char">¡Pago exitoso!</h1>
      <p className="max-w-md text-char/70">
        Tu pago se proceso correctamente. Para que preparemos tu pedido, confirmalo por WhatsApp:
      </p>

      {order && (
        <div className="w-full max-w-sm rounded-xl bg-white p-5 text-left shadow-sm ring-1 ring-char/10">
          <p className="mb-2 text-sm font-semibold text-char">Resumen</p>
          <ul className="space-y-1 text-sm text-char/70">
            {order.lines.map((line) => (
              <li key={line.lineId}>
                {line.quantity}x {line.productName}
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-char/10 pt-3 text-right font-display text-xl text-char">
            S/ {order.total.toFixed(2)}
          </div>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-[#25D366] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[#25D366]/30"
      >
        Confirmar por WhatsApp
      </a>

      {orderId && (
        <Link href={`/pedido/${orderId}`} className="text-sm font-semibold text-brick underline">
          Ver el estado de mi pedido
        </Link>
      )}

      <Link href="/" className="text-sm text-char/50 underline">
        Volver al inicio
      </Link>
    </main>
  );
}

export default function PagoExitosoPage() {
  return (
    <Suspense fallback={null}>
      <PagoExitosoContent />
    </Suspense>
  );
}