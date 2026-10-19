import Image from "next/image";
import type { Product } from "@/lib/types";

// Cartel con la mejor oferta REAL de la carta (la de mayor descuento).
// Si ningún producto tiene descuento, no se muestra.
export function PromoBanner({ products }: { products: Product[] }) {
  const withDiscount = products
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.basePrice)
    .map((p) => ({
      product: p,
      pct: Math.round(100 - (p.basePrice / p.compareAtPrice!) * 100),
    }))
    .sort((a, b) => b.pct - a.pct);

  const best = withDiscount[0];
  if (!best) return null;
  const { product, pct } = best;

  return (
    <section className="grain relative overflow-hidden bg-ketchup text-yolk">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">
        <div>
          <p className="font-poster inline-block -rotate-3 text-[clamp(6.5rem,24vw,15rem)] leading-[0.8] tracking-[-0.04em]">
            -{pct}%
          </p>
          <p className="mt-6 font-poster text-2xl uppercase leading-tight tracking-tight text-bone sm:text-3xl">
            en {product.name}
          </p>
          <p className="mt-2 text-lg font-bold text-bone">
            Ahora S/ {product.basePrice.toFixed(2)}{" "}
            <span className="font-medium text-bone/60 line-through">
              S/ {product.compareAtPrice!.toFixed(2)}
            </span>
          </p>
          <a
            href={`#${product.id}`}
            className="lift hard-yolk mt-8 inline-block rounded-md border-[3px] border-char bg-char px-8 py-3.5 text-base font-bold text-yolk"
          >
            Aprovechar la oferta
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-md rotate-3">
          <div className="hard rounded-md border-[3px] border-char bg-yolk p-3">
            <div className="relative aspect-square w-full">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 420px"
                  className="object-contain mix-blend-multiply"
                />
              )}
            </div>
            <p className="border-t-[3px] border-char pt-2 text-center font-poster text-lg uppercase tracking-tight text-char">
              {product.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}