"use client";

import Image from "next/image";
import { motion } from "motion/react";

export type HeroFeatured = { name: string; price: number; imageUrl: string } | null;

const LINES = ["Hecha para", "morderla con", "las dos manos."];
const FACTS = ["Carne 100% res", "A la parrilla", "Pago en línea"];

export function Hero({ featured = null }: { featured?: HeroFeatured }) {
  return (
    <section className="grain relative overflow-hidden bg-yolk pt-20 text-char">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 sm:px-8 lg:grid-cols-12 lg:pt-8">
        {/* Texto */}
        <div className="pb-4 pt-8 lg:col-span-7 lg:pb-16">
          <h1 className="font-poster text-[clamp(2.1rem,9vw,4.4rem)] uppercase leading-[0.95] tracking-[-0.02em]">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden whitespace-nowrap pb-[0.1em]">
                <motion.span
                  className="block"
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 max-w-md text-lg font-medium leading-7 text-char/80"
          >
            Carne 100% res a la parrilla, pan brioche tostado y queso derretido.
            Arma tu combo y pídelo en minutos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <a
              href="#menu"
              className="lift hard-red rounded-md border-[3px] border-char bg-char px-8 py-3.5 text-base font-bold text-yolk"
            >
              Ver la carta
            </a>
            <a
              href="#reservas"
              className="text-base font-bold underline decoration-[3px] underline-offset-[6px] transition-colors hover:text-brick"
            >
              Reservar una mesa
            </a>
          </motion.div>

          <ul className="mt-10 grid max-w-xl grid-cols-3 border-t-[3px] border-char">
            {FACTS.map((fact) => (
              <li
                key={fact}
                className="border-r-[3px] border-char px-3 py-3 text-xs font-bold leading-snug first:pl-0 last:border-r-0 sm:text-sm"
              >
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/* Producto estrella */}
        <div className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <div className="hard absolute inset-[7%] rounded-full border-[3px] border-char bg-paper" />

            {featured?.imageUrl ? (
              <motion.div
                initial={{ opacity: 0, y: 40, rotate: -9 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 mix-blend-multiply"
              >
                <Image
                  src={featured.imageUrl}
                  alt={featured.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 540px"
                  className="object-contain"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-[18%]">
                <Image
                  src="/logo-bigboy.png"
                  alt="Big Boy Burgers"
                  fill
                  sizes="300px"
                  className="object-contain"
                />
              </div>
            )}

            {featured && (
              <>
                <motion.div
                  initial={{ scale: 2.4, rotate: 40, opacity: 0 }}
                  animate={{ scale: 1, rotate: 12, opacity: 1 }}
                  transition={{ delay: 1.15, type: "spring", stiffness: 260, damping: 14 }}
                  className="hard-sm absolute right-0 top-2 flex h-24 w-24 flex-col items-center justify-center rounded-full border-[3px] border-char bg-ketchup text-center text-yolk sm:h-28 sm:w-28"
                >
                  <span className="text-[11px] font-bold leading-none">Solo</span>
                  <span className="font-poster text-lg leading-tight sm:text-xl">
                    S/ {featured.price.toFixed(2)}
                  </span>
                </motion.div>

                <a
                  href="#menu"
                  className="lift hard-sm absolute bottom-2 left-0 -rotate-2 rounded-md border-[3px] border-char bg-char px-4 py-2 text-yolk"
                >
                  <span className="block text-[11px] font-bold leading-none text-bone/70">
                    El favorito de la casa
                  </span>
                  <span className="font-poster text-base uppercase leading-tight tracking-tight sm:text-lg">
                    {featured.name}
                  </span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}