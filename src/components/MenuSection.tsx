"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product, ProductCategory } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductCustomizeModal } from "@/components/ProductCustomizeModal";
import { SectionHeading } from "@/components/SectionHeading";

type TabId = ProductCategory | "all";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "combos", label: "Combos" },
  { id: "burgers", label: "Burgers" },
  { id: "sides", label: "Acompañantes" },
  { id: "drinks", label: "Bebidas" },
  { id: "desserts", label: "Postres" },
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
    <section className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title="La carta"
          note="Elige, personaliza a tu gusto y paga en línea."
        />

        {/* Categorías */}
        <div
          role="tablist"
          aria-label="Categorías de la carta"
          className="scrollbar-none -mx-5 mt-8 flex gap-3 overflow-x-auto px-5 pb-3 pt-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-md border-[3px] border-char px-4 py-2 text-sm font-bold transition-colors ${
                  active ? "bg-char text-yolk" : "bg-paper text-char hover:bg-yolk"
                }`}
              >
                {t.label}
                <span
                  className={`rounded px-1.5 text-xs ${
                    active ? "bg-yolk text-char" : "bg-char/10 text-char/70"
                  }`}
                >
                  {countOf(t.id)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Productos: cuadrícula pareja, todas las tarjetas del mismo alto */}
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-char/60">No hay productos en esta categoría.</p>
        ) : (
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onCustomize={setActiveProduct} />
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