"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "motion/react";

const KEY = "bb-preloader-seen";
const WORD = "BIG BOY".split("");

// Pantalla de carga: letras que suben, barra de progreso y cortina que se abre.
// La primera vez dura ~2.4 s; en la misma sesión después, solo un destello corto.
export function Preloader() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      // sin sessionStorage: se muestra completa
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const controls = animate(0, 100, {
      duration: seen ? 0.5 : 2.2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setProgress(Math.round(v)),
      onComplete: () => {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {
          // no pasa nada
        }
        closeTimer = setTimeout(() => {
          document.body.style.overflow = prevOverflow;
          setShow(false);
        }, 300);
      },
    });

    return () => {
      controls.stop();
      if (closeTimer) clearTimeout(closeTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div
          key="preloader"
          className="fixed inset-0 z-[100]"
          role="status"
          aria-label="Cargando Big Boy Burgers"
        >
          {/* Cortina: dos mitades que se abren */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-char"
            exit={{ y: "-100%", transition: { duration: 0.85, delay: 0.25, ease: [0.76, 0, 0.24, 1] } }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-char"
            exit={{ y: "100%", transition: { duration: 0.85, delay: 0.25, ease: [0.76, 0, 0.24, 1] } }}
          />

          {/* Resplandor cálido de fondo */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 52%, rgba(201,122,43,0.22), transparent 70%)",
            }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          />

          {/* Contenido central */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.35 } }}
          >
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.5em] text-mustard sm:text-xs">
              Hamburguesas a la parrilla
            </p>

            <h1
              className="font-display flex text-[22vw] leading-[0.9] tracking-wide text-bone sm:text-[9rem]"
              aria-hidden
            >
              {WORD.map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden px-[0.02em] py-[0.04em]">
                  <motion.span
                    className={`inline-block ${ch === " " ? "w-[0.3em]" : ""}`}
                    initial={{ y: "115%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="font-display shimmer-text -mt-1 text-[8vw] tracking-[0.35em] sm:text-5xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              BURGERS
            </motion.p>

            {/* Barra de progreso */}
            <div className="mt-10 w-56 sm:w-72">
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-bone/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brick via-amber to-amber-light"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-3 text-center text-xs font-medium tabular-nums tracking-widest text-bone/50">
                {progress}%
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}  