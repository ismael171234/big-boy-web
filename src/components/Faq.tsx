"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

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
    <section className="bg-bone-dim py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="border-t-[6px] border-char pt-5 lg:sticky lg:top-28">
            <h2 className="font-poster text-[clamp(2rem,6vw,3.75rem)] uppercase leading-[0.95] tracking-[-0.02em] lg:text-[clamp(2rem,3.9vw,3.4rem)]">
              Preguntas frecuentes
            </h2>
            <p className="mt-3 max-w-xs text-base text-char/65">
              Lo básico para pedir sin dudas. ¿Algo más? Escríbenos por WhatsApp.
            </p>
          </div>
        </div>

        <div className="border-t-[3px] border-char lg:col-span-7">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`border-b-[3px] border-char transition-colors ${isOpen ? "bg-yolk" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-4 py-5 text-left sm:px-6"
                >
                  <span className="text-lg font-bold text-char">{f.q}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-[3px] border-char bg-paper text-char">
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="flex"
                    >
                      <Plus className="h-5 w-5" strokeWidth={3} />
                    </motion.span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl px-4 pb-6 text-base leading-7 text-char/80 sm:px-6">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}