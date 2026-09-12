"use client";

import { useState } from "react";
import { products } from "@/lib/data/products";
import type { Product, ProductCategory } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductCustomizeModal } from "@/components/ProductCustomizeModal";

const TABS: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "combos", label: "Combos" },
  { id: "burgers", label: "Burgers" },
  { id: "drinks", label: "Bebidas" },
  { id: "desserts", label: "Postres" },
];

export function MenuSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const filtered =
    tab === "all" ? products : products.filter((p) => p.category === tab);

  return (
    <section id="menu" className="bg-bone py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brick">La carta</p>
            <h2 className="font-display text-4xl tracking-wide text-char sm:text-5xl">
              Arma tu pedido
            </h2>
          </div>

          <div id="promociones" className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-char text-bone"
                    : "bg-white text-char/70 hover:text-char"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              large={i === 0 && tab === "all"}
              onCustomize={setActiveProduct}
            />
          ))}
        </div>
      </div>

      {activeProduct && (
        <ProductCustomizeModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </section>
  );
}
