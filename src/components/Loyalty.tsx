"use client";

import { motion } from "motion/react";
import { Beef } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

// Tarjeta de sellos: 4 compras suman sellos y la quinta trae 15% de descuento.
export function Loyalty() {
  return (
    <section className="grain relative overflow-hidden bg-yolk py-16 text-char sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <SectionHeading
          title="A la quinta compra, 15% menos"
          note="Cada pedido suma un sello. Con la quinta compra tienes 15% de descuento."
        />

        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          whileInView={{ opacity: 1, rotate: -2 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hard rounded-md border-[3px] border-char bg-paper p-5 sm:p-7"
        >
          <p className="font-poster text-lg uppercase tracking-tight">Tarjeta de sellos</p>
          <div className="mt-4 grid grid-cols-5 gap-2.5 sm:gap-4">
            {[0, 1, 2, 3, 4].map((i) => {
              const last = i === 4;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -40 }}
                  whileInView={{ scale: 1, rotate: last ? 8 : 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: 0.4 + i * 0.18,
                    type: "spring",
                    stiffness: 320,
                    damping: 14,
                  }}
                  className={`flex aspect-square items-center justify-center rounded-full border-[3px] border-char ${
                    last ? "bg-ketchup text-yolk" : "bg-char text-yolk"
                  }`}
                >
                  {last ? (
                    <span className="font-poster text-base leading-none sm:text-2xl">15%</span>
                  ) : (
                    <Beef className="h-1/2 w-1/2" strokeWidth={2.5} />
                  )}
                </motion.div>
              );
            })}
          </div>
          <p className="mt-4 border-t-2 border-dashed border-char/30 pt-3 text-sm font-medium text-char/70">
            Los sellos se cuentan con tu cuenta. Crea una para empezar a sumar.
          </p>
        </motion.div>
      </div>
    </section>
  );
}