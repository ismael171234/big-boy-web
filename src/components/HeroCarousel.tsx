"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/imagenes/imagen1carrusel.jpeg", alt: "Hamburguesa BurgerHouse", coupon: false },
  { src: "/imagenes/imagen2carrusel.jpeg", alt: "Papas fritas con queso y bacon", coupon: false },
  { src: "/imagenes/imagen4carrusel.jpeg", alt: "15% de descuento en tu 5ta compra", coupon: true },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = slides[index];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={current.src}
        alt={current.alt}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-char via-char/70 to-char/20" />

      {current.coupon && (
        <div className="absolute inset-x-4 bottom-4 rounded-xl bg-char/85 px-5 py-4 backdrop-blur sm:inset-x-auto sm:right-6 sm:max-w-xs">
          <p className="font-display text-2xl tracking-wide text-amber-light">
            15% de descuento
          </p>
          <p className="text-sm text-bone-dim">En cualquier producto por tu 5ta compra</p>
        </div>
      )}

      <div className="absolute top-6 left-1/2 flex -translate-x-1/2 gap-2 lg:left-auto lg:right-6 lg:translate-x-0">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-amber-light" : "w-1.5 bg-bone/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}