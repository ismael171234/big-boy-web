"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { PlaceholderImage } from "@/components/PlaceholderImage";

export function ProductCard({
  product,
  onCustomize,
}: {
  product: Product;
  onCustomize: (product: Product) => void;
}) {
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.basePrice;
  const discountPct = hasDiscount
    ? Math.round(100 - (product.basePrice / product.compareAtPrice!) * 100)
    : null;
  const saving = hasDiscount ? product.compareAtPrice! - product.basePrice : 0;
  const customizable = product.optionGroups.length > 0;
  // Las bebidas se ven mejor sobre blanco; combos y burgers, sobre el amarillo de la marca
  const onYolk = product.category !== "drinks";

  return (
    <article
      id={product.id}
      className="lift hard group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-md border-[3px] border-char bg-white"
    >
      {/* Imagen */}
      <div
        className={`relative aspect-[4/3] w-full border-b-[3px] border-char ${onYolk ? "bg-yolk" : "bg-white"}`}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-105 ${
              onYolk ? "mix-blend-multiply" : ""
            }`}
          />
        ) : (
          <PlaceholderImage category={product.category} className="h-full w-full" />
        )}

        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {discountPct !== null && discountPct > 0 && (
            <span className="-rotate-6 rounded-md border-2 border-char bg-ketchup px-2 py-0.5 font-poster text-sm text-yolk">
              -{discountPct}%
            </span>
          )}
          {product.isFeatured && (
            <span className="rounded-md border-2 border-char bg-char px-2 py-0.5 text-xs font-bold text-yolk">
              Favorito
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-poster text-xl uppercase leading-[1.05] tracking-tight text-char">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-char/65">
          {product.description}
        </p>

        {customizable && (
          <p className="mt-2 text-xs font-bold text-brick">Lo armas a tu gusto</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            {hasDiscount && (
              <p className="text-xs text-char/45 line-through">
                S/ {product.compareAtPrice!.toFixed(2)}
              </p>
            )}
            <p className="font-poster text-2xl leading-none tracking-tight text-char">
              S/ {product.basePrice.toFixed(2)}
            </p>
            {hasDiscount && (
              <p className="mt-1 text-xs font-bold text-brick">Ahorras S/ {saving.toFixed(2)}</p>
            )}
          </div>

          <button
            onClick={() => onCustomize(product)}
            aria-label={`Agregar ${product.name}`}
            className="flex shrink-0 items-center gap-1.5 rounded-md border-[3px] border-char bg-yolk px-4 py-2 text-sm font-bold text-char transition-colors hover:bg-char hover:text-yolk active:translate-y-px"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}