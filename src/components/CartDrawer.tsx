"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore, useCartTotal, lineTotal } from "@/lib/cart-store";
import { buildOrderMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { placeOrder, getActiveCoupons } from "@/actions/orders";
import { useSession } from "@/lib/use-session";

export function CartDrawer() {
  const { lines, isOpen, close, removeLine, updateQuantity, clear } = useCartStore();
  const { user } = useSession();
  const subtotal = useCartTotal(lines);

  const [coupons, setCoupons] = useState<
    { code: string; discount_percent: number }[]
  >([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      getActiveCoupons().then((c) =>
        setCoupons(c.map((x) => ({ code: x.code, discount_percent: x.discount_percent })))
      );
    }
  }, [isOpen, user]);

  const coupon = coupons.find((c) => c.code === appliedCoupon);
  const discount = coupon ? (subtotal * coupon.discount_percent) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleCheckout = async () => {
    setPlacing(true);
    const message = buildOrderMessage({
      lines,
      total,
      couponCode: coupon?.code,
      discount,
    });

    // Persist the order first so it's counted toward the loyalty coupon,
    // then hand the customer off to WhatsApp to confirm.
    await placeOrder({
      lines,
      subtotal,
      discount,
      total,
      couponCode: coupon?.code,
    });

    window.open(buildWhatsappUrl(message), "_blank");
    clear();
    setAppliedCoupon(null);
    setPlacing(false);
    close();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-char/60 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bone transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-char/10 px-6 py-5">
          <h2 className="font-display text-2xl tracking-wide text-char">Tu pedido</h2>
          <button onClick={close} aria-label="Cerrar carrito" className="text-char/60 hover:text-char">
            <X className="h-6 w-6" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-char/60">
            <ShoppingBag className="h-10 w-10" />
            <p>Aún no agregaste nada. Elige algo de la carta.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.lineId} className="rounded-xl bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-char">{line.productName}</p>
                      {line.selectedOptions.length > 0 && (
                        <ul className="mt-1 space-y-0.5 text-xs text-char/60">
                          {line.selectedOptions.map((o, i) => (
                            <li key={`${o.optionId}-${i}`}>{o.optionName}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      onClick={() => removeLine(line.lineId)}
                      aria-label="Quitar del carrito"
                      className="text-char/40 hover:text-brick"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-char/15 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-char/10"
                        aria-label="Reducir cantidad"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-char/10"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-semibold text-char">
                      S/ {lineTotal(line).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {coupons.length > 0 && (
              <div className="mt-5 rounded-xl border border-dashed border-amber p-4">
                <p className="mb-2 text-sm font-semibold text-char">Tienes cupones disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {coupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setAppliedCoupon(appliedCoupon === c.code ? null : c.code)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        appliedCoupon === c.code
                          ? "bg-brick text-bone"
                          : "bg-amber-light/40 text-char"
                      }`}
                    >
                      {c.code} · -{c.discount_percent}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {lines.length > 0 && (
          <div className="border-t border-char/10 px-6 py-5">
            <div className="mb-1 flex justify-between text-sm text-char/60">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="mb-1 flex justify-between text-sm text-brick">
                <span>Descuento ({coupon?.code})</span>
                <span>-S/ {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="mb-4 flex justify-between font-display text-2xl text-char">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={placing}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              {placing ? "Enviando..." : "Confirmar por WhatsApp"}
            </button>
            {!user && (
              <p className="mt-3 text-center text-xs text-char/50">
                <a href="/login" className="underline">
                  Inicia sesión
                </a>{" "}
                para acumular compras y ganar cupones de descuento.
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
