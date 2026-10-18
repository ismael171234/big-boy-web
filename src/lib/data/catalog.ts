import { createClient } from "@supabase/supabase-js";
import { products as fallbackProducts } from "@/lib/data/products";
import type { Product, ProductCategory, ProductOptionGroup } from "@/lib/types";

type OptionRow = { id: string; name: string; price_addon: number | string; sort_order: number };
type GroupRow = {
  id: string;
  name: string;
  is_required: boolean;
  min_select: number;
  max_select: number;
  sort_order: number;
  options: OptionRow[] | null;
};
type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  base_price: number | string;
  compare_at_price: number | string | null;
  image_url: string | null;
  is_featured: boolean;
  is_available: boolean | null;
  sort_order: number;
  option_groups: GroupRow[] | null;
};

// Lee el catálogo desde Supabase. Si algo falla (o la tabla está vacía),
// usa el catálogo escrito en el código para que la web NUNCA se quede sin carta.
export async function getCatalog(): Promise<Product[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, name, description, category, base_price, compare_at_price, image_url, is_featured, is_available, sort_order, option_groups(id, name, is_required, min_select, max_select, sort_order, options(id, name, price_addon, sort_order))"
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("getCatalog error:", error.message);
      return fallbackProducts;
    }

    return (data as unknown as ProductRow[])
      .filter((p) => p.is_available !== false)
      .map((p): Product => {
        const groups: ProductOptionGroup[] = [...(p.option_groups ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((g) => ({
            id: g.id,
            name: g.name,
            isRequired: g.is_required,
            minSelect: g.min_select,
            maxSelect: g.max_select,
            options: [...(g.options ?? [])]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((o) => ({ id: o.id, name: o.name, priceAddon: Number(o.price_addon) || 0 })),
          }));

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          description: p.description ?? "",
          category: p.category as ProductCategory,
          basePrice: Number(p.base_price) || 0,
          compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
          imageUrl: p.image_url ?? "",
          isFeatured: p.is_featured,
          optionGroups: groups,
        };
      });
  } catch (e) {
    console.error("getCatalog exception:", e);
    return fallbackProducts;
  }
}