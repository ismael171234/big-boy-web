import type { Product, ProductOptionGroup } from "@/lib/types";

// ---- Reusable option groups (shared across combos) ------------------

const burgerChoice = (select: number): ProductOptionGroup => ({
  id: `burgers-${select}`,
  name: select === 1 ? "Elige 1 burger" : `Elige ${select} burgers`,
  isRequired: true,
  minSelect: select,
  maxSelect: select,
  options: [
    { id: "american", name: "American", priceAddon: 0 },
    { id: "big-bacon", name: "Big Bacon", priceAddon: 0 },
    { id: "crunchy-boy", name: "Crunchy Boy", priceAddon: 3 },
    { id: "crispy-boy", name: "Crispy Boy", priceAddon: 3 },
    { id: "super-boy", name: "Super Boy", priceAddon: 3 },
    { id: "triple-b", name: "Triple B", priceAddon: 5 },
  ],
});

const friesChoice = (select: number): ProductOptionGroup => ({
  id: `fries-${select}`,
  name: select === 1 ? "Elige 1 papas" : `Elige ${select} papas`,
  isRequired: true,
  minSelect: select,
  maxSelect: select,
  options: [
    { id: "fries", name: "Fries", priceAddon: 0 },
    { id: "cheese-fries", name: "Cheese fries", priceAddon: 3 },
    { id: "bacon-cheese-fries", name: "Bacon cheese fries", priceAddon: 6 },
  ],
});

const drinkChoice = (select: number): ProductOptionGroup => ({
  id: `drinks-${select}`,
  name: select === 1 ? "Elige 1 bebida" : `Elige ${select} bebidas`,
  isRequired: true,
  minSelect: select,
  maxSelect: select,
  options: [
    { id: "tropical-lemonade", name: "Tropical Lemonade 350ml", priceAddon: 0 },
    { id: "sunset-lemonade", name: "Sunset Lemonade 350ml", priceAddon: 0 },
    { id: "coca-cola", name: "Coca Cola Original 500ml", priceAddon: 0 },
    { id: "inca-kola", name: "Inca Kola Original 500ml", priceAddon: 0 },
    { id: "coca-cola-zero", name: "Coca Cola Sin Azúcar 500ml", priceAddon: 0 },
    { id: "inca-kola-zero", name: "Inca Kola Sin Azúcar 500ml", priceAddon: 0 },
    { id: "agua-cielo", name: "Agua Cielo Alcalina Sin Gas 650ml", priceAddon: 0 },
  ],
});

const dessertAddon: ProductOptionGroup = {
  id: "dessert",
  name: "Agrega postre",
  isRequired: false,
  minSelect: 0,
  maxSelect: 1,
  options: [{ id: "big-temptation", name: "Big Temptation", priceAddon: 18 }],
};

const saucesAddon = (max: number): ProductOptionGroup => ({
  id: "sauces",
  name: "Añade salsas",
  isRequired: false,
  minSelect: 0,
  maxSelect: max,
  options: [
    { id: "salsa-americana", name: "Salsa Americana 1oz.", priceAddon: 3 },
    { id: "salsa-burger", name: "Salsa de la Casa 1oz.", priceAddon: 3 },
    { id: "salsa-thousand", name: "Salsa Thousand Island 1oz.", priceAddon: 3 },
    { id: "salsa-queso", name: "Salsa de queso 2oz.", priceAddon: 3 },
    { id: "mayonesa", name: "Mayonesa (2)", priceAddon: 3 },
    { id: "ketchup", name: "Ketchup (2)", priceAddon: 3 },
    { id: "aji", name: "Ají (2)", priceAddon: 3 },
  ],
});

// ---- Catalog ----------------------------------------------------------

export const products: Product[] = [
  {
    id: "combo-full-temptation",
    slug: "combo-full-temptation",
    name: "Combo Full Temptation",
    description:
      "2 burgers, 2 fries, 2 bebidas, 1 Big Temptation y salsas (mayonesa, ketchup y ají).",
    category: "combos",
    basePrice: 94.9,
    compareAtPrice: 118.8,
    imageUrl: "/imagenes/Combo-Full-Temptation.png",
    isFeatured: true,
    optionGroups: [burgerChoice(2), friesChoice(2), drinkChoice(2), dessertAddon, saucesAddon(6)],
  },
  {
    id: "combo-para-2-full",
    slug: "combo-para-2-full",
    name: "Combo Para 2 Full",
    description:
      "Dos burgers, dos fries, dos bebidas y salsas (mayonesa, ketchup y ají).",
    category: "combos",
    basePrice: 79.9,
    compareAtPrice: 94.0,
    imageUrl: "/imagenes/Combo-para-dos.png",
    isFeatured: true,
    optionGroups: [burgerChoice(2), friesChoice(2), drinkChoice(2), dessertAddon, saucesAddon(6)],
  },
  {
    id: "combo-double-big-bite",
    slug: "combo-double-big-bite",
    name: "Combo Double Big Bite",
    description:
      "Dos burgers, dos fries, dos bebidas y 9 chicken chunks acompañados de una salsa signature. Además, salsas clásicas.",
    category: "combos",
    basePrice: 89.9,
    compareAtPrice: 112.0,
    imageUrl: "/imagenes/Combo-Double-Big-Bite.png",
    optionGroups: [burgerChoice(2), friesChoice(2), drinkChoice(2), saucesAddon(6)],
  },
  {
    id: "combo-big-bite",
    slug: "combo-big-bite",
    name: "Combo Big Bite",
    description:
      "Burger, fries, bebida y 6 chicken chunks acompañados de una salsa signature. Además, salsa clásica.",
    category: "combos",
    basePrice: 49.9,
    compareAtPrice: 60.0,
    imageUrl: "/imagenes/Combo-Big-Bite.png",
    optionGroups: [burgerChoice(1), friesChoice(1), drinkChoice(1), saucesAddon(4)],
  },
  {
    id: "combo-big-deluxe",
    slug: "combo-big-deluxe",
    name: "Combo Big Deluxe",
    description: "Burger, fries y salsas (mayonesa, ketchup y ají).",
    category: "combos",
    basePrice: 38.9,
    compareAtPrice: 41.0,
    imageUrl: "/imagenes/Combo-Big-Deluxe.png",
    optionGroups: [burgerChoice(1), friesChoice(1), saucesAddon(4)],
  },
  {
    id: "big-temptation",
    slug: "big-temptation",
    name: "Big Temptation",
    description:
      "Cucharable de keke húmedo de chocolate bañado en una mezcla cremosa, con fudge artesanal.",
    category: "desserts",
    basePrice: 18.0,
    imageUrl: "/imagenes/Big-Temptation.png",
    optionGroups: [],
  },
  {
    id: "agua-san-luis",
    slug: "agua-san-luis",
    name: "Agua San Luis 750ml",
    description: "Agua mineral sin gas, ideal para acompañar tu combo.",
    category: "drinks",
    basePrice: 4.5,
    imageUrl: "/imagenes/aguasanluis.png",
    optionGroups: [],
  },
  {
    id: "coca-cola-500",
    slug: "coca-cola-500",
    name: "Coca Cola 500ml",
    description: "Gaseosa Coca Cola bien fría, 500ml.",
    category: "drinks",
    basePrice: 7.5,
    imageUrl: "/imagenes/cocacola.png",
    optionGroups: [],
  },
  {
    id: "inca-kola-500",
    slug: "inca-kola-500",
    name: "Inca Kola 500ml",
    description: "Gaseosa Inca Kola bien fría, 500ml.",
    category: "drinks",
    basePrice: 7.5,
    imageUrl: "/imagenes/incakola.png",
    optionGroups: [],
  },
  {
    id: "fanta-500",
    slug: "fanta-500",
    name: "Fanta 500ml",
    description: "Gaseosa Fanta bien fría, 500ml.",
    category: "drinks",
    basePrice: 7.5,
    imageUrl: "/imagenes/fanta.png",
    optionGroups: [],
  },
  {
    id: "sprite-500",
    slug: "sprite-500",
    name: "Sprite 500ml",
    description: "Gaseosa Sprite bien fría, 500ml.",
    category: "drinks",
    basePrice: 7.5,
    imageUrl: "/imagenes/sprite.png",
    optionGroups: [],
  },
];

export const heroCarouselImages = [
  { src: "/images/hero/carousel-1.jpg", alt: "Burger doble con queso cheddar y bacon" },
  { src: "/images/hero/carousel-2.jpg", alt: "Papas fritas con queso y bacon" },
  { src: "/images/hero/carousel-3.jpg", alt: "Combo con dos burgers y bebidas" },
  { src: "/images/hero/carousel-4.jpg", alt: "Chicken chunks con salsa signature" },
];