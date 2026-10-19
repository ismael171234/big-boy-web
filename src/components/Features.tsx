import { SectionHeading } from "@/components/SectionHeading";

const REASONS = [
  {
    title: "Carne 100% res",
    text: "Hamburguesas hechas con carne de res y preparadas a la parrilla todos los días.",
  },
  {
    title: "Pan brioche y queso derretido",
    text: "Pan tostado y queso que se estira. Así tiene que verse una burger.",
  },
  {
    title: "Armas tu combo",
    text: "Eliges tus burgers, papas, bebidas y salsas. Tú decides cada parte.",
  },
  {
    title: "Sigues tu pedido",
    text: "Ves en tu pantalla si ya se confirmó, se está preparando o está listo.",
  },
];

export function Features() {
  return (
    <section className="bg-char py-16 text-bone sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          tone="dark"
          title="Lo que no negociamos"
          note="Cuatro cosas que cuidamos en cada pedido."
        />

        <ul className="mt-10">
          {REASONS.map((r) => (
            <li
              key={r.title}
              className="group grid gap-3 border-b-2 border-bone/20 py-7 first:border-t-2 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-12"
            >
              <h3 className="font-poster text-3xl uppercase leading-[1] tracking-tight text-bone transition-all duration-300 group-hover:translate-x-2 group-hover:text-yolk sm:text-5xl">
                {r.title}
              </h3>
              <p className="max-w-md text-base leading-7 text-bone/70">{r.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}