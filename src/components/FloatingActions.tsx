"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

// Botones flotantes: WhatsApp (siempre) y "volver arriba" (después de bajar).
export function FloatingActions() {
  const { scrollY } = useScroll();
  const [showTop, setShowTop] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setShowTop(v > 700));

  return (
    <div className="fixed bottom-24 right-4 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Volver arriba"
            className="hard-sm flex h-11 w-11 items-center justify-center rounded-md border-[3px] border-char bg-yolk text-char"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola Big Boy! Quisiera hacer una consulta 🍔")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="hard-sm relative flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-char bg-[#25D366] text-char"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
        <MessageCircle className="relative h-7 w-7" />
      </motion.a>
    </div>
  );
}