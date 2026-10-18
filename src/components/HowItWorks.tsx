import { CreditCard, MousePointerClick, SlidersHorizontal } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Elige tu favorito",
    text: "Recorre la carta y toca Agregar en el combo, burger o bebida que quieras.",
  },
  {
    icon: SlidersHorizontal,
    title: "Personalízalo",
    text: "Escoge tus burgers, papas, bebidas y salsas. Se arma justo como lo imaginas.",
  },
  {
    icon: CreditCard,
    title: "Paga y sigue tu pedido",
    text: "Paga en línea de forma segura y mira el estado de tu pedido hasta que esté listo.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-14 text-center">
          <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-brick">
            <span className="h-px w-8 bg-brick/50" />
            Cómo pedir
            <span className="h-px w-8 bg-brick/50" />
          </p>
          <h2 className="font-display mt-3 text-5xl tracking-wide text-char sm:text-6xl">
            Tu burger en 3 pasos
          </h2>
        </Reveal>

        <RevealGroup className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Línea que une los pasos (solo escritorio) */}
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-brick/25 md:block"
          />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <RevealItem key={title}>
              <div className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brick to-brick-light text-bone shadow-xl shadow-brick/30 ring-8 ring-white">
                  <Icon className="h-8 w-8" />
                  <span className="font-display absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-mustard text-lg text-char">
                    {i + 1}
                  </span>
                </span>
                <h3 className="font-display mt-5 text-3xl tracking-wide text-char">{title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-char/60">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2} className="mt-14 text-center">
          <a
            href="#menu"
            className="inline-block rounded-full bg-char px-9 py-3.5 text-sm font-bold text-bone shadow-lg shadow-char/20 transition hover:bg-brick"
          >
            Empezar mi pedido
          </a>
        </Reveal>
      </div>
    </section>
  );
}