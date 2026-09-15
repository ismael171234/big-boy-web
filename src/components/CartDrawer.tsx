"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
    const message = buildOrderMessage({ lines, total, couponCode: coupon?.code, discount });

    await placeOrder({ lines, subtotal, discount, total, couponCode: coupon?.code });

    window.open(buildWhatsappUrl(message), "_blank");
    clear();
    setAppliedCoupon(null);
    setPlacing(false);
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con fade */}
          <motion.div
            className="fixed inset-0 z-50 bg-char/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          />

          {/* Drawer con resorte en vez de duration fija */}
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bone"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-char/10 px-6 py-5">
              <h2 className="font-display text-2xl tracking-wide text-char">Tu pedido</h2>
              <button onClick={close} aria-label="Cerrar carrito" className="text-char/60 hover:text-char">
                <X className="h-6 w-6" />
              </button>
            </div>

            {lines.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-char/60"
              >
                <ShoppingBag className="h-10 w-10" />
                <p>Aún no agregaste nada. Elige algo de la carta.</p>
              </motion.div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.lineId}
                        layout
                        initial={{ opacity: 0, x: 40, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden rounded-xl bg-white p-4"
                      >
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
                            {/* key={quantity} fuerza el re-mount → dispara la animación de "pulso" */}
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.span
                                key={line.quantity}
                                initial={{ scale: 1.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="inline-block w-4 text-center text-sm font-semibold"
                              >
                                {line.quantity}
                              </motion.span>
                            </AnimatePresence>
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
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {coupons.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-xl border border-dashed border-amber p-4"
                  >
                    <p className="mb-2 text-sm font-semibold text-char">Tienes cupones disponibles</p>
                    <div className="flex flex-wrap gap-2">
                      {coupons.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => setAppliedCoupon(appliedCoupon === c.code ? null : c.code)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                            appliedCoupon === c.code
                              ? "bg-brick text-bone"
                              : "bg-amber-light/40 text-char"
                          }`}
                        >
                          {c.code} · -{c.discount_percent}%
                        </button>
                      ))}
                    </div>
                  </motion.div>
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
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={total.toFixed(2)}
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 6, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      S/ {total.toFixed(2)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  disabled={placing}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {placing ? "Enviando..." : "Confirmar por WhatsApp"}
                </motion.button>
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}