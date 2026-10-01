"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { products } from "@/lib/data/products";
import { Reveal } from "@/components/Reveal";

const featured = products.filter((p) => p.isFeatured);

export function ProductCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section className="overflow-hidden bg-bone py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-brick">Lo más pedido</p>
            <h2 className="font-display text-4xl tracking-wide text-char sm:text-5xl">
              Nuestros favoritos
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <motion.button
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-char/15 text-char transition-colors hover:border-brick hover:bg-brick hover:text-bone"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              onClick={() => scrollBy(1)}
              aria-label="Siguiente"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-char/15 text-char transition-colors hover:border-brick hover:bg-brick hover:text-bone"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </Reveal>
      </div>

      <motion.div
        ref={trackRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8"
      >
        {featured.map((product) => {
          const discountPct = product.compareAtPrice
            ? Math.round(100 - (product.basePrice / product.compareAtPrice) * 100)
            : null;
          return (
            <motion.a
              key={product.id}
              href={`#${product.id}`}
              variants={{
                hidden: { opacity: 0, x: 40 },
                show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl bg-char shadow-lg shadow-char/10 sm:w-[320px]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                ) : (
                  <PlaceholderImage
                    category={product.category}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-char via-char/80 to-transparent p-5 pt-10">
                {discountPct !== null && (
                  <span className="mb-1 inline-block rounded bg-amber-light px-2 py-0.5 text-xs font-bold text-char">
                    -{discountPct}%
                  </span>
                )}
                <h3 className="font-display text-2xl tracking-wide text-bone transition-colors group-hover:text-amber-light">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-amber-light">
                  S/ {product.basePrice.toFixed(2)}
                </p>
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}