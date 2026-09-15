"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/imagenes/imagen1carrusel.jpeg", alt: "Hamburguesa BurgerHouse" },
  { src: "/imagenes/imagen2carrusel.jpeg", alt: "Papas fritas con queso y bacon" },
  { src: "/imagenes/imagen4carrusel.jpeg", alt: "15% de descuento en tu 5ta compra" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex((i + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-char via-char/70 to-char/20" />

      <button
        onClick={prev}
        aria-label="Imagen anterior"
        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-char/50 text-bone opacity-0 transition-opacity duration-300 hover:bg-char/80 group-hover:opacity-100 sm:opacity-60"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente imagen"
        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-char/50 text-bone opacity-0 transition-opacity duration-300 hover:bg-char/80 group-hover:opacity-100 sm:opacity-60"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute top-6 left-1/2 flex -translate-x-1/2 gap-2 lg:left-auto lg:right-6 lg:translate-x-0">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-amber-light" : "w-1.5 bg-bone/50 hover:bg-bone/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}