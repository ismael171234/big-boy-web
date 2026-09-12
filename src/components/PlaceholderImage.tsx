import { Beef, Flame, CupSoda, IceCreamBowl, UtensilsCrossed } from "lucide-react";
import type { ProductCategory } from "@/lib/types";

const ICONS: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  combos: UtensilsCrossed,
  burgers: Beef,
  sides: Flame,
  drinks: CupSoda,
  desserts: IceCreamBowl,
};

const GRADIENTS: Record<ProductCategory, string> = {
  combos: "from-brick via-char to-char-2",
  burgers: "from-amber via-brick to-char",
  sides: "from-amber-light via-amber to-brick",
  drinks: "from-char via-char-2 to-brick",
  desserts: "from-brick-light via-brick to-char",
};

export function PlaceholderImage({
  category,
  className = "",
}: {
  category: ProductCategory;
  className?: string;
}) {
  const Icon = ICONS[category];
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${GRADIENTS[category]} ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.35) 0, transparent 45%)",
        }}
      />
      <Icon className="h-1/3 w-1/3 text-bone/90" />
    </div>
  );
}
