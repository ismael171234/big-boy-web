import { Flame } from "lucide-react";

const ITEMS = [
  "Carne 100% res",
  "A la parrilla",
  "Pan brioche tostado",
  "Queso derretido",
  "Arma tu combo",
  "Pide en minutos",
];

// Cinta de texto que se desliza sola, separa el Hero del resto de la página.
export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee relative overflow-hidden bg-gradient-to-r from-brick via-brick-light to-brick py-3.5 text-bone" aria-hidden>
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((text, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="font-display px-6 text-2xl tracking-[0.15em] sm:text-3xl">
                  {text}
                </span>
                <Flame className="h-5 w-5 text-amber-light" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}