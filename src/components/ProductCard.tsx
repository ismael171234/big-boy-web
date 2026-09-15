"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { PlaceholderImage } from "@/components/PlaceholderImage";

export function ProductCard({
  product,
  large = false,
  onCustomize,
}: {
  product: Product;
  large?: boolean;
  onCustomize: (product: Product) => void;
}) {
  const discountPct = product.compareAtPrice
    ? Math.round(100 - (product.basePrice / product.compareAtPrice) * 100)
    : null;

  return (
    <article
      id={product.id}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-char/5 transition-shadow hover:shadow-md ${
        large ? "sm:col-span-2 sm:row-span-2 sm:flex-row" : ""
      }`}
    >
      <div className={`relative ${large ? "sm:w-1/2 min-h-[220px]" : "aspect-[4/3] w-full"}`}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes={large ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"}
            className="object-cover"
            priority={large}
          />
        ) : (
          <PlaceholderImage
            category={product.category}
            className={large ? "h-full w-full min-h-[220px]" : "h-full w-full"}
          />
        )}
        {discountPct !== null && (
          <span className="absolute left-3 top-3 rounded bg-amber-light px-2 py-0.5 text-xs font-bold text-char">
            -{discountPct}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className={`font-display tracking-wide text-char ${large ? "text-3xl" : "text-2xl"}`}>
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-char/65">{product.description}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="font-display text-xl text-brick">
              S/ {product.basePrice.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="ml-2 text-sm text-char/40 line-through">
                S/ {product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => onCustomize(product)}
            aria-label={`Agregar ${product.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-char text-bone transition-colors group-hover:bg-brick"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}