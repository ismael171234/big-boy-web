"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { SectionHeading } from "@/components/SectionHeading";
import type { Product } from "@/lib/types";

export function ProductCarousel({ products }: { products: Product[] }) {
  // Primero los destacados; si hay pocos, se completa con los productos en oferta
  const featured = [
    ...products.filter((p) => p.isFeatured),
    ...products.filter(
      (p) => !p.isFeatured && p.compareAtPrice && p.compareAtPrice > p.basePrice
    ),
  ].slice(0, 8);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (featured.length === 0) return null;

  return (
    <section className="overflow-hidden bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading title="Los favoritos" note="Los combos que no pueden faltar en tu mesa.">
          <div className="hidden gap-3 sm:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
              className="lift hard-sm flex h-11 w-11 items-center justify-center rounded-md border-[3px] border-char bg-paper"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={3} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Siguiente"
              className="lift hard-sm flex h-11 w-11 items-center justify-center rounded-md border-[3px] border-char bg-yolk"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </button>
          </div>
        </SectionHeading>
      </div>

      <div
        ref={trackRef}
        className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-5 px-5 pb-10 pt-3 sm:scroll-pl-8 sm:px-8 xl:scroll-pl-[calc((100vw-80rem)/2+2rem)] xl:pl-[calc((100vw-80rem)/2+2rem)]"
      >
        {featured.map((product) => {
          const discountPct = product.compareAtPrice
            ? Math.round(100 - (product.basePrice / product.compareAtPrice) * 100)
            : null;
          return (
            <a
              key={product.id}
              href={`#${product.id}`}
              className="lift hard group relative flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-md border-[3px] border-char bg-yolk sm:w-[290px]"
            >
              <div className="relative aspect-square w-full">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 260px, 290px"
                    className="object-contain p-4 mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                ) : (
                  <PlaceholderImage category={product.category} className="h-full w-full" />
                )}
                {discountPct !== null && discountPct > 0 && (
                  <span className="absolute left-3 top-3 -rotate-6 rounded-md border-2 border-char bg-ketchup px-2 py-0.5 font-poster text-sm text-yolk">
                    -{discountPct}%
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col border-t-[3px] border-char bg-char px-4 py-3 text-yolk">
                <h3 className="font-poster text-lg uppercase leading-tight tracking-tight">
                  {product.name}
                </h3>
                <p className="mt-auto flex items-baseline gap-2 pt-1 text-sm font-bold text-bone">
                  S/ {product.basePrice.toFixed(2)}
                  {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
                    <span className="text-xs font-medium text-bone/50 line-through">
                      S/ {product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}