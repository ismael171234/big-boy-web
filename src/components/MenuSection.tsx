"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Beef, CupSoda, Flame, IceCreamBowl, LayoutGrid, UtensilsCrossed } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductCustomizeModal } from "@/components/ProductCustomizeModal";
import { Reveal } from "@/components/Reveal";

type TabId = ProductCategory | "all";

const TABS: { id: TabId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "all", label: "Todo", icon: LayoutGrid },
  { id: "combos", label: "Combos", icon: UtensilsCrossed },
  { id: "burgers", label: "Burgers", icon: Beef },
  { id: "sides", label: "Acompañantes", icon: Flame },
  { id: "drinks", label: "Bebidas", icon: CupSoda },
  { id: "desserts", label: "Postres", icon: IceCreamBowl },
];

export function MenuSection({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<TabId>("all");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const countOf = (id: TabId) =>
    id === "all" ? products.length : products.filter((p) => p.category === id).length;

  // Solo se muestran las categorías que tienen productos
  const tabs = TABS.filter((t) => t.id === "all" || countOf(t.id) > 0);
  const filtered = tab === "all" ? products : products.filter((p) => p.category === tab);

  return (
    <section className="relative overflow-hidden bg-bone py-16 sm:py-24">
      {/* Resplandores decorativos */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-light/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brick/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-10 text-center sm:mb-12">
          <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-brick">
            <span className="h-px w-8 bg-brick/50" />
            La carta
            <span className="h-px w-8 bg-brick/50" />
          </p>
          <h2 className="font-display mt-3 text-5xl tracking-wide text-char sm:text-6xl">
            Arma tu pedido
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-char/60">
            Elige tu favorito, personalízalo a tu gusto y recíbelo en minutos.
          </p>
        </Reveal>

        {/* Pestañas de categorías */}
        <Reveal delay={0.1} className="mb-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Categorías de la carta"
            className="scrollbar-none flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_1px_2px_rgba(28,24,21,0.06),0_12px_30px_-18px_rgba(28,24,21,0.3)] ring-1 ring-char/[0.06]"
          >
            {tabs.map((t) => {
              const active = tab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                    active ? "text-bone" : "text-char/65 hover:text-char"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="menu-tab-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-brick to-brick-light shadow-lg shadow-brick/30"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative h-4 w-4" />
                  <span className="relative">{t.label}</span>
                  <span
                    className={`relative rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active ? "bg-white/25 text-bone" : "bg-char/[0.07] text-char/55"
                    }`}
                  >
                    {countOf(t.id)}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Productos: cuadrícula pareja, todas las tarjetas del mismo alto */}
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-char/55">No hay productos en esta categoría.</p>
        ) : (
          <motion.div
            key={tab}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="h-full"
              >
                <ProductCard product={product} onCustomize={setActiveProduct} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {activeProduct && (
          <ProductCustomizeModal
            key={activeProduct.id}
            product={activeProduct}
            onClose={() => setActiveProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}