"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Plus, Sparkles } from "lucide-react";
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

  return (
    <motion.article
      id={product.id}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_2px_rgba(28,24,21,0.05),0_10px_30px_-18px_rgba(28,24,21,0.25)] ring-1 ring-char/[0.06] transition-[box-shadow,--tw-ring-color] duration-300 hover:shadow-[0_22px_44px_-20px_rgba(139,46,31,0.4)] hover:ring-brick/30"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_62%,#ffffff_0%,#f7f3ec_62%,#efe7d8_100%)]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.08] group-hover:-rotate-1"
          />
        ) : (
          <PlaceholderImage category={product.category} className="h-full w-full" />
        )}

        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {discountPct !== null && (
            <span className="rounded-full bg-brick px-2.5 py-1 text-[11px] font-bold tracking-wide text-bone shadow-md shadow-brick/30">
              -{discountPct}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="flex items-center gap-1 rounded-full bg-mustard px-2.5 py-1 text-[11px] font-bold text-char shadow-md shadow-mustard/30">
              <Sparkles className="h-3 w-3" />
              Favorito
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        <h3 className="font-display text-[1.65rem] leading-[1.05] tracking-wide text-char transition-colors duration-200 group-hover:text-brick">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-char/60">
          {product.description}
        </p>

        {customizable && (
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-amber">
            Personalizable
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            {hasDiscount && (
              <p className="text-xs text-char/40 line-through">
                S/ {product.compareAtPrice!.toFixed(2)}
              </p>
            )}
            <p className="font-display text-3xl leading-none tracking-wide text-brick">
              S/ {product.basePrice.toFixed(2)}
            </p>
            {hasDiscount && (
              <p className="mt-1 text-[11px] font-semibold text-emerald-700">
                Ahorras S/ {saving.toFixed(2)}
              </p>
            )}
          </div>

          <motion.button
            onClick={() => onCustomize(product)}
            aria-label={`Agregar ${product.name}`}
            whileTap={{ scale: 0.94 }}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-char px-4 py-2.5 text-sm font-semibold text-bone shadow-lg shadow-char/20 transition-colors duration-200 group-hover:bg-brick group-hover:shadow-brick/30"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            Agregar
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}