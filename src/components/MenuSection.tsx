"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { products } from "@/lib/data/products";
import type { Product, ProductCategory } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductCustomizeModal } from "@/components/ProductCustomizeModal";
import { Reveal } from "@/components/Reveal";

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
        <Reveal className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t.id ? "text-bone" : "text-char/70 hover:text-char"
                }`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="menu-tab-pill"
                    className="absolute inset-0 rounded-full bg-char"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {tab !== t.id && (
                  <span className="absolute inset-0 rounded-full bg-white" />
                )}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <motion.div
          key={tab}
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
              }}
              className={i === 0 && tab === "all" ? "sm:col-span-2 sm:row-span-2" : ""}
            >
              <ProductCard
                product={product}
                large={i === 0 && tab === "all"}
                onCustomize={setActiveProduct}
              />
            </motion.div>
          ))}
        </motion.div>
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