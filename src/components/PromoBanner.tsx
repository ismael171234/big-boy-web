import Image from "next/image";
import { ArrowRight, Gift } from "lucide-react";
import type { Product } from "@/lib/types";
import { Reveal } from "@/components/Reveal";

// Banner grande con la mejor oferta REAL de la carta (la de mayor descuento).
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
    <section className="bg-bone px-5 py-6 sm:px-8 sm:py-10">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brick via-brick-light to-amber p-8 text-bone shadow-2xl shadow-brick/30 sm:p-12 lg:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-light/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-char/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]">
              <Gift className="h-4 w-4 text-amber-light" />
              Oferta destacada
            </p>
            <h2 className="font-display mt-4 text-6xl leading-[0.95] tracking-wide sm:text-7xl lg:text-8xl">
              Hasta <span className="text-char">-{pct}%</span>
              <br />
              en tus combos
            </h2>
            <p className="mt-4 max-w-md text-lg text-bone/90">
              {product.name} a solo{" "}
              <strong className="font-display text-2xl tracking-wide">
                S/ {product.basePrice.toFixed(2)}
              </strong>{" "}
              <span className="text-bone/60 line-through">
                S/ {product.compareAtPrice!.toFixed(2)}
              </span>
            </p>
            <a
              href={`#${product.id}`}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-char px-8 py-3.5 text-sm font-bold text-bone shadow-xl shadow-char/30 transition hover:bg-char-2"
            >
              Aprovechar oferta
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-6 rounded-full bg-bone/20 blur-2xl" />
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 80vw, 400px"
                className="relative rounded-3xl object-contain drop-shadow-2xl"
              />
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}