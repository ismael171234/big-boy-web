import { Hero } from "@/components/Hero";
import { ProductCarousel } from "@/components/ProductCarousel";
import { MenuSection } from "@/components/MenuSection";
import { ReservationSection } from "@/components/ReservationSection";

export default function Home() {
  return (
    <>
      <Hero />

      <div id="promociones">
        <ProductCarousel />
      </div>

      <div id="menu">
        <MenuSection />
      </div>

      <div id="reservas">
        <ReservationSection />
      </div>
    </>
  );
}