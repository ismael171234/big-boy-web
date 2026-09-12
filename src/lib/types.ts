export type ProductCategory =
  | "combos"
  | "burgers"
  | "sides"
  | "drinks"
  | "desserts";

export interface ProductOption {
  id: string;
  name: string;
  priceAddon: number;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  options: ProductOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  compareAtPrice?: number;
  imageUrl: string;
  isFeatured?: boolean;
  optionGroups: ProductOptionGroup[];
}

export interface SelectedOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceAddon: number;
}

export interface CartLine {
  lineId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  selectedOptions: SelectedOption[];
}
