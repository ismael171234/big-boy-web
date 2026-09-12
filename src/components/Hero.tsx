import { HeroCarousel } from "@/components/HeroCarousel";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-char pt-24 text-bone">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-16">
        <div>
          <p className="mb-4 text-sm font-medium text-amber-light">
            Carbón, queso derretido y pan brioche tostado
          </p>
          <h1 className="font-display text-6xl leading-[0.95] tracking-wide sm:text-7xl lg:text-8xl">
            Hamburguesas que
            <br />
            <span className="text-amber-light">valen la mordida.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-bone-dim">
            Carne 100% res, a la parrilla todos los días. Arma tu combo a tu
            manera, resérvanos una mesa o pide para llevar en minutos.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#menu" className="rounded-full bg-brick px-7 py-3 text-sm font-semibold text-bone transition-transform hover:scale-[1.03] hover:bg-brick-light">
              Ver la carta
            </a>
            <a href="#reservas" className="rounded-full border border-bone/30 px-7 py-3 text-sm font-semibold text-bone transition-colors hover:border-amber-light hover:text-amber-light">
              Reservar mesa
            </a>
          </div>
        </div>

        <HeroCarousel />
      </div>
      <div className="absolute bottom-0 left-0 h-2 w-full bg-bone" />
    </section>
  );
}