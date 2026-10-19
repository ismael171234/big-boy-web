import { Asterisk } from "lucide-react";

const ITEMS = [
  "Carne 100% res",
  "A la parrilla",
  "Pan brioche tostado",
  "Queso derretido",
  "Arma tu combo",
  "Pide en minutos",
];

// Cinta negra que se desliza sola, separa el Hero del resto de la página.
export function Marquee() {
  return (
    <div
      className="marquee overflow-hidden border-y-[3px] border-char bg-char py-3 text-yolk"
      aria-hidden
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {[...ITEMS, ...ITEMS].map((text, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="font-poster whitespace-nowrap px-5 text-xl uppercase tracking-tight sm:text-2xl">
                  {text}
                </span>
                <Asterisk className="h-6 w-6 text-ketchup" strokeWidth={4} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}