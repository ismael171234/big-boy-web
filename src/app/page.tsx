import { Hero } from "@/components/Hero";
import { ProductCarousel } from "@/components/ProductCarousel";
import { MenuSection } from "@/components/MenuSection";
import { ReservationSection } from "@/components/ReservationSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductCarousel />
      <MenuSection />
      <ReservationSection />
    </>
  );
}
