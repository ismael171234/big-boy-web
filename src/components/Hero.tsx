"use client";

import { motion } from "motion/react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { EmberField } from "@/components/EmberField";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-char pt-24 text-bone">
      <EmberField />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-16"
      >
        <div>
          <motion.p
            variants={item}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-amber-light"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-light pulse-glow" />
            Carbón, queso derretido y pan brioche tostado
          </motion.p>

          <h1 className="font-display text-6xl leading-[0.95] tracking-wide sm:text-7xl lg:text-8xl">
            <motion.span variants={item} className="block">
              Hamburguesas que
            </motion.span>
            <motion.span variants={item} className="shimmer-text block">
              valen la mordida.
            </motion.span>
          </h1>

          <motion.p variants={item} className="mt-6 max-w-md text-base text-bone-dim">
            Carne 100% res, a la parrilla todos los días. Arma tu combo a tu
            manera, resérvanos una mesa o pide para llevar en minutos.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <motion.a
              href="#menu"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(201,122,43,0.55)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="rounded-full bg-brick px-7 py-3 text-sm font-semibold text-bone hover:bg-brick-light"
            >
              Ver la carta
            </motion.a>
            <motion.a
              href="#reservas"
              whileHover={{ scale: 1.05, borderColor: "var(--color-amber-light)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="rounded-full border border-bone/30 px-7 py-3 text-sm font-semibold text-bone hover:text-amber-light"
            >
              Reservar mesa
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          variants={item}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] lg:aspect-square"
        >
          <HeroCarousel />
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-bone-dim sm:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.25em]">Explorar</span>
        <svg
          className="bob h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <div className="absolute bottom-0 left-0 h-2 w-full bg-bone" />
    </section>
  );
}