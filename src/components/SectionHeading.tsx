import type { ReactNode } from "react";

// Encabezado de sección: una barra gruesa arriba (como las del logo) y el título grande.
export function SectionHeading({
  title,
  note,
  tone = "light",
  children,
}: {
  title: string;
  note?: string;
  tone?: "light" | "dark";
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className={`border-t-[6px] pt-5 ${dark ? "border-yolk" : "border-char"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            className={`font-poster text-[clamp(2rem,6vw,3.75rem)] uppercase leading-[0.95] tracking-[-0.02em] ${
              dark ? "text-yolk" : "text-char"
            }`}
          >
            {title}
          </h2>
          {note && (
            <p className={`mt-3 max-w-md text-base ${dark ? "text-bone/70" : "text-char/65"}`}>
              {note}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}