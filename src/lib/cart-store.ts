"use client";

import { create } from "zustand";
import type { CartLine, SelectedOption } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  addLine: (line: Omit<CartLine, "lineId">) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

function lineTotal(line: Pick<CartLine, "unitPrice" | "selectedOptions" | "quantity">) {
  const optionsTotal = line.selectedOptions.reduce(
    (sum: number, o: SelectedOption) => sum + o.priceAddon,
    0
  );
  return (line.unitPrice + optionsTotal) * line.quantity;
}

export const useCartStore = create<CartState>((set) => ({
  lines: [],
  isOpen: false,
  addLine: (line) =>
    set((state) => ({
      lines: [...state.lines, { ...line, lineId: crypto.randomUUID() }],
      isOpen: true,
    })),
  removeLine: (lineId) =>
    set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),
  updateQuantity: (lineId, quantity) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.lineId === lineId ? { ...l, quantity: Math.max(1, quantity) } : l
      ),
    })),
  clear: () => set({ lines: [] }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export function useCartTotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export { lineTotal };
