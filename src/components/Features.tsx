import { Beef, Flame, PackageCheck, SlidersHorizontal } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

const FEATURES = [
  {
    icon: Beef,
    title: "Carne 100% res",
    text: "Hamburguesas hechas con carne de res, preparadas a la parrilla todos los días.",
  },
  {
    icon: Flame,
    title: "Pan brioche y queso",
    text: "Pan brioche tostado y queso derretido en cada mordida, como debe ser.",
  },
  {
    icon: SlidersHorizontal,
    title: "Arma tu combo",
    text: "Elige tus burgers, papas, bebidas y salsas. Tú decides cómo lo quieres.",
  },
  {
    icon: PackageCheck,
    title: "Sigue tu pedido",
    text: "Mira en tu pantalla cuándo se confirma, se prepara y está listo tu pedido.",
  },
];

export function Features() {
  return (
    <section className="relative overflow-hidden bg-char py-16 text-bone sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brick/25 blur-[110px]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12 text-center">
          <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-light">
            <span className="h-px w-8 bg-amber-light/50" />
            Por qué Big Boy
            <span className="h-px w-8 bg-amber-light/50" />
          </p>
          <h2 className="font-display mt-3 text-5xl tracking-wide sm:text-6xl">
            Hecho para los que aman las burgers
          </h2>
        </Reveal>

        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <RevealItem key={title}>
              <div className="group h-full rounded-3xl border border-bone/10 bg-bone/[0.04] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-amber-light/40 hover:bg-bone/[0.07]">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brick to-brick-light text-bone shadow-lg shadow-brick/30 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="font-display text-2xl tracking-wide">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-bone-dim">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}