import { SectionHeading } from "@/components/SectionHeading";

const STEPS = [
  {
    title: "Elige tu favorito",
    text: "Recorre la carta y toca Agregar en el combo, burger o bebida que quieras.",
  },
  {
    title: "Personalízalo",
    text: "Escoge tus burgers, papas, bebidas y salsas. Se arma justo como lo imaginas.",
  },
  {
    title: "Paga y sigue tu pedido",
    text: "Paga en línea de forma segura y mira el estado de tu pedido hasta que esté listo.",
  },
];

// El ticket es un recurso de la marca: el pedido se explica como un comprobante.
export function HowItWorks() {
  return (
    <section className="bg-paper py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            title="Tu pedido en tres pasos"
            note="Sin llamadas ni esperas. Lo armas tú desde tu pantalla."
          />
          <a
            href="#menu"
            className="lift hard-red mt-8 inline-block rounded-md border-[3px] border-char bg-char px-8 py-3.5 text-base font-bold text-yolk"
          >
            Empezar mi pedido
          </a>
        </div>

        <div className="drop-shadow-[6px_6px_0_#1c1815] lg:rotate-[1.5deg]">
          <div className="ticket-edge border-[3px] border-b-0 border-char bg-white px-6 pt-6 sm:px-8 sm:pt-8">
            <p className="border-b-2 border-dashed border-char/30 pb-4 text-center font-poster text-2xl uppercase tracking-tight">
              Big Boy Burgers
            </p>
            <ol>
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-5 border-b-2 border-dashed border-char/30 py-5 last:border-b-0"
                >
                  <span className="font-poster text-5xl leading-none text-ketchup">{i + 1}</span>
                  <div>
                    <h3 className="font-poster text-xl uppercase leading-tight tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-char/65">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="pb-2 pt-2 text-center text-sm font-bold text-char/50">
              Gracias por pedir en Big Boy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}