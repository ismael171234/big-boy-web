"use client";

import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useCartStore, useCartTotal } from "@/lib/cart-store";

// Barra flotante que solo se ve en celular (sm:hidden) cuando hay productos
// en el carrito. Facilita abrir el carrito sin tener que subir hasta el
// header.
export function MobileCartBar() {
  const { lines, open, isOpen } = useCartStore();
  const total = useCartTotal(lines);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <AnimatePresence>
      {itemCount > 0 && !isOpen && (
        <motion.button
          onClick={open}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          whileTap={{ scale: 0.97 }}
          className="fixed inset-x-4 z-30 flex items-center justify-between rounded-full bg-char px-5 py-3.5 text-bone shadow-xl shadow-char/30 sm:hidden"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
        >
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brick">
              <ShoppingBag className="h-4 w-4" />
              <AnimatePresence>
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-light px-1 text-[10px] font-bold text-char"
                >
                  {itemCount}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="font-semibold">Ver pedido</span>
          </span>
          <span className="font-display text-lg tracking-wide">S/ {total.toFixed(2)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}