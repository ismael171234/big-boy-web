"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import type { Product, SelectedOption } from "@/lib/types";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { useCartStore } from "@/lib/cart-store";

export function ProductCustomizeModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  // groupId -> optionId -> quantity selected (supports "pick N of these")
  const [selections, setSelections] = useState<Record<string, Record<string, number>>>({});
  const [quantity, setQuantity] = useState(1);
  const addLine = useCartStore((s) => s.addLine);

  const selectedCountByGroup = (groupId: string) =>
    Object.values(selections[groupId] ?? {}).reduce((a, b) => a + b, 0);

  const setOptionQty = (groupId: string, optionId: string, delta: number) => {
    setSelections((prev) => {
      const group = prev[groupId] ?? {};
      const current = group[optionId] ?? 0;
      const groupTotal = Object.values(group).reduce((a, b) => a + b, 0);
      const max = product.optionGroups.find((g) => g.id === groupId)?.maxSelect ?? 1;

      if (delta > 0 && groupTotal >= max) return prev; // group is full
      const next = Math.max(0, current + delta);

      return { ...prev, [groupId]: { ...group, [optionId]: next } };
    });
  };

  const missingRequired = useMemo(
    () =>
      product.optionGroups
        .filter((g) => g.isRequired)
        .filter((g) => selectedCountByGroup(g.id) < g.minSelect),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selections]
  );

  const optionsAddon = useMemo(() => {
    let total = 0;
    for (const group of product.optionGroups) {
      const picks = selections[group.id] ?? {};
      for (const [optionId, qty] of Object.entries(picks)) {
        const option = group.options.find((o) => o.id === optionId);
        if (option) total += option.priceAddon * qty;
      }
    }
    return total;
  }, [selections, product.optionGroups]);

  const unitTotal = product.basePrice + optionsAddon;

  const handleAddToCart = () => {
    if (missingRequired.length > 0) return;

    const selectedOptions: SelectedOption[] = [];
    for (const group of product.optionGroups) {
      const picks = selections[group.id] ?? {};
      for (const [optionId, qty] of Object.entries(picks)) {
        const option = group.options.find((o) => o.id === optionId);
        if (option && qty > 0) {
          for (let i = 0; i < qty; i++) {
            selectedOptions.push({
              groupId: group.id,
              groupName: group.name,
              optionId: option.id,
              optionName: option.name,
              priceAddon: option.priceAddon,
            });
          }
        }
      }
    }

    addLine({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      quantity,
      unitPrice: product.basePrice,
      selectedOptions,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-char/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-bone sm:flex-row sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image — top strip on mobile, fixed left column on desktop */}
                <div className="relative h-48 shrink-0 sm:h-auto sm:w-[42%]">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <PlaceholderImage category={product.category} className="h-full w-full" />
          )} 
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-char/70 text-bone hover:bg-char"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
            <p className="font-display text-2xl tracking-wide text-bone drop-shadow sm:text-3xl">
              {product.name}
            </p>
          </div>
        </div>

        {/* Details + options — scrollable right column on desktop */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <p className="text-sm text-char/70">{product.description}</p>

            {product.optionGroups.map((group) => {
              const count = selectedCountByGroup(group.id);
              return (
                <div key={group.id} className="mt-6 border-t border-char/10 pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-char">{group.name}</h3>
                      <p className="text-xs text-char/60">
                        {group.isRequired
                          ? `Obligatorio · Seleccione ${group.minSelect}`
                          : `Opcional · Seleccione hasta ${group.maxSelect}`}
                      </p>
                    </div>
                    {group.isRequired && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          count >= group.minSelect
                            ? "bg-amber-light/30 text-brick"
                            : "bg-brick text-bone"
                        }`}
                      >
                        {count}/{group.minSelect}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const qty = selections[group.id]?.[option.id] ?? 0;
                      return (
                        <div
                          key={option.id}
                          className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-char">{option.name}</p>
                            {option.priceAddon > 0 && (
                              <p className="text-xs text-brick">
                                +S/ {option.priceAddon.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setOptionQty(group.id, option.id, -1)}
                              disabled={qty === 0}
                              aria-label={`Quitar ${option.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-char/20 text-char disabled:opacity-30"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-4 text-center text-sm font-semibold">{qty}</span>
                            <button
                              onClick={() => setOptionQty(group.id, option.id, 1)}
                              aria-label={`Agregar ${option.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-char text-bone hover:bg-brick"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-4 border-t border-char/10 bg-bone px-6 py-5 sm:px-8">
            <div className="flex items-center gap-3 rounded-full border border-char/20 px-2 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-char/10"
                aria-label="Reducir cantidad"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-5 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-char/10"
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={missingRequired.length > 0}
              className="flex flex-1 items-center justify-between rounded-full bg-brick px-6 py-3 text-sm font-semibold text-bone transition-colors hover:bg-brick-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>{missingRequired.length > 0 ? "Completa lo obligatorio" : "Agregar"}</span>
              <span>S/ {(unitTotal * quantity).toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}