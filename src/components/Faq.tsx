"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const FAQS = [
  {
    q: "¿Cómo hago mi pedido?",
    a: "Elige tus productos en la carta, personalízalos si quieres y abre el carrito para finalizar tu compra.",
  },
  {
    q: "¿Cómo puedo pagar?",
    a: "El pago se hace en línea de forma segura con Mercado Pago, con los medios de pago que te ofrece al finalizar.",
  },
  {
    q: "¿Puedo ver cómo va mi pedido?",
    a: "Sí. Después de pagar puedes seguir el estado de tu pedido: confirmado, preparando, listo y entregado.",
  },
  {
    q: "¿Puedo personalizar mi combo?",
    a: "Claro. En los combos eliges tus burgers, papas, bebidas y salsas, y puedes agregar extras.",
  },
  {
    q: "¿Cómo reservo una mesa?",
    a: "Completa el formulario de reservas en esta página y te confirmamos por WhatsApp.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-bone py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="mb-10 text-center">
          <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-brick">
            <span className="h-px w-8 bg-brick/50" />
            Ayuda
            <span className="h-px w-8 bg-brick/50" />
          </p>
          <h2 className="font-display mt-3 text-5xl tracking-wide text-char sm:text-6xl">
            Preguntas frecuentes
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`overflow-hidden rounded-2xl bg-white ring-1 transition-shadow ${
                  isOpen ? "shadow-lg shadow-char/10 ring-brick/30" : "ring-char/[0.06]"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-char">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isOpen ? "bg-brick text-bone" : "bg-char/[0.06] text-char"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-5 text-sm leading-6 text-char/65">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}