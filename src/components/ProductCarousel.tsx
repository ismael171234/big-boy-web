"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { products } from "@/lib/data/products";

const featured = products.filter((p) => p.isFeatured);

export function ProductCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section className="bg-bone py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-brick">Lo más pedido</p>
            <h2 className="font-display text-4xl tracking-wide text-char sm:text-5xl">
              Nuestros favoritos
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-char/15 text-char transition-colors hover:border-brick hover:text-brick"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-char/15 text-char transition-colors hover:border-brick hover:text-brick"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8"
      >
        {featured.map((product) => (
          <a
            key={product.id}
            href={`#${product.id}`}
            className="group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl bg-char sm:w-[320px]"
          >
            <PlaceholderImage
              category={product.category}
              className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-char via-char/70 to-transparent p-5">
              {product.compareAtPrice && (
                <span className="mb-1 inline-block rounded bg-amber-light px-2 py-0.5 text-xs font-bold text-char">
                  -{Math.round(100 - (product.basePrice / product.compareAtPrice) * 100)}%
                </span>
              )}
              <h3 className="font-display text-2xl tracking-wide text-bone">{product.name}</h3>
              <p className="mt-1 text-sm font-semibold text-amber-light">
                S/ {product.basePrice.toFixed(2)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
