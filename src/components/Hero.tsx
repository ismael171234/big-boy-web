"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Beef, Flame, ShoppingBag, Star } from "lucide-react";
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

const CHIPS = [
  { icon: Beef, label: "Carne 100% res" },
  { icon: Flame, label: "A la parrilla" },
  { icon: ShoppingBag, label: "Pide en minutos" },
];

export type HeroFeatured = { name: string; price: number; imageUrl: string } | null;

export function Hero({ featured = null }: { featured?: HeroFeatured }) {
  return (
    <section className="relative isolate overflow-hidden bg-char pt-24 text-bone">
      {/* Resplandores de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-brick/30 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-amber/20 blur-[120px]"
      />
      <EmberField />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-32 lg:pt-16"
      >
        <div>
          <motion.p
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-light/30 bg-amber-light/10 px-4 py-1.5 text-sm font-medium text-amber-light"
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

          <motion.p variants={item} className="mt-6 max-w-md text-base text-bone-dim sm:text-lg">
            Carne 100% res, a la parrilla todos los días. Arma tu combo a tu
            manera, resérvanos una mesa o pide para llevar en minutos.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <motion.a
              href="#menu"
              whileHover={{ scale: 1.05, boxShadow: "0 0 34px rgba(201,122,43,0.6)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="rounded-full bg-gradient-to-r from-brick to-brick-light px-8 py-3.5 text-sm font-bold text-bone shadow-lg shadow-brick/40"
            >
              Ver la carta
            </motion.a>
            <motion.a
              href="#reservas"
              whileHover={{ scale: 1.05, borderColor: "var(--color-amber-light)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="rounded-full border border-bone/30 px-8 py-3.5 text-sm font-semibold text-bone hover:text-amber-light"
            >
              Reservar mesa
            </motion.a>
          </motion.div>

          <motion.ul variants={item} className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {CHIPS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-bone/80">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bone/10 text-amber-light">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div variants={item} className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-bone/10 lg:aspect-square">
            <HeroCarousel />
          </div>

          {/* Tarjeta flotante: el producto favorito (datos reales de la carta) */}
          {featured && (
            <motion.a
              href="#menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { delay: 1, duration: 0.6 },
                y: { delay: 1.2, duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-bone p-3 pr-5 text-char shadow-2xl shadow-black/40 sm:-left-6"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                {featured.imageUrl && (
                  <Image
                    src={featured.imageUrl}
                    alt={featured.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                )}
              </span>
              <span>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber">
                  <Star className="h-3 w-3" fill="currentColor" />
                  Favorito de la casa
                </span>
                <span className="block max-w-[11rem] truncate font-display text-lg leading-tight tracking-wide">
                  {featured.name}
                </span>
                <span className="font-display text-base text-brick">
                  S/ {featured.price.toFixed(2)}
                </span>
              </span>
            </motion.a>
          )}
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-bone-dim lg:flex"
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
    </section>
  );
}