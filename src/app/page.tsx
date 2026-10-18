import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Features } from "@/components/Features";
import { MenuSection } from "@/components/MenuSection";
import { PromoBanner } from "@/components/PromoBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { Faq } from "@/components/Faq";
import { ReservationSection } from "@/components/ReservationSection";
import { getCatalog } from "@/lib/data/catalog";

// La carta se vuelve a leer de Supabase como máximo cada 60 s
// (y al instante cuando el admin guarda un producto).
export const revalidate = 60;

export default async function Home() {
  const products = await getCatalog();

  const top = products.find((p) => p.isFeatured) ?? products[0];
  const heroFeatured = top
    ? { name: top.name, price: top.basePrice, imageUrl: top.imageUrl }
    : null;

  return (
    <>
      <Hero featured={heroFeatured} />
      <Marquee />

      <div id="promociones" className="scroll-mt-20">
        <ProductCarousel products={products} />
      </div>

      <Features />

      <div id="menu" className="scroll-mt-20">
        <MenuSection products={products} />
      </div>

      <PromoBanner products={products} />
      <HowItWorks />
      <Faq />

      <div id="reservas" className="scroll-mt-20">
        <ReservationSection />
      </div>
    </>
  );
}