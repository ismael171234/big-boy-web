"use client";

import Image from "next/image";
import { motion } from "motion/react";
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
    <motion.article
      id={product.id}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-char/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-char/10 ${
        large ? "sm:col-span-2 sm:row-span-2 sm:flex-row" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-bone/40 ${large ? "sm:w-1/2 min-h-[220px]" : "aspect-[4/3] w-full"}`}>
        {product.imageUrl ? (
          <motion.div
            className="relative h-full w-full"
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes={large ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"}
              className="object-contain p-3"
              priority={large}
            />
          </motion.div>
        ) : (
          <PlaceholderImage
            category={product.category}
            className={large ? "h-full w-full min-h-[220px]" : "h-full w-full"}
          />
        )}
        {discountPct !== null && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute left-3 top-3 z-10 rounded bg-amber-light px-2 py-0.5 text-xs font-bold text-char"
          >
            -{discountPct}%
          </motion.span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className={`font-display tracking-wide text-char transition-colors duration-200 group-hover:text-brick ${large ? "text-3xl" : "text-2xl"}`}>
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
          <motion.button
            onClick={() => onCustomize(product)}
            aria-label={`Agregar ${product.name}`}
            whileHover={{ scale: 1.12, rotate: 90 }}
            whileTap={{ scale: 0.9, rotate: 90 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-char text-bone transition-colors group-hover:bg-brick"
          >
            <Plus className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}