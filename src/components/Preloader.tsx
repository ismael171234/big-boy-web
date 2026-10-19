"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "motion/react";

const KEY = "bb-preloader-seen";
const WORD = "BIG BOY".split("");

// Pantalla de carga: el nombre sale de abajo como en un cartel, una barra gruesa
// se llena y la cortina amarilla se abre en dos. La primera vez dura ~2.5 s;
// en la misma sesión después, solo un destello corto.
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
          {/* Cortina: dos mitades amarillas que se abren */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-yolk"
            exit={{ y: "-100%", transition: { duration: 0.85, delay: 0.25, ease: [0.76, 0, 0.24, 1] } }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-yolk"
            exit={{ y: "100%", transition: { duration: 0.85, delay: 0.25, ease: [0.76, 0, 0.24, 1] } }}
          />

          {/* Contenido central */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-char"
            exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.3 } }}
          >
            <h1
              className="font-poster flex text-[clamp(3rem,13vw,9rem)] uppercase leading-[0.9] tracking-[-0.03em]"
              aria-hidden
            >
              {WORD.map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden px-[0.01em] py-[0.06em]">
                  <motion.span
                    className={`inline-block ${ch === " " ? "w-[0.28em]" : ""}`}
                    initial={{ y: "115%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch === " " ? " " : ch}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="font-poster mt-2 -rotate-2 bg-char px-4 py-1 text-[clamp(1.1rem,4vw,2rem)] uppercase tracking-tight text-yolk"
              initial={{ opacity: 0, scale: 1.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Burgers
            </motion.p>

            {/* Barra de progreso gruesa, con el porcentaje en grande */}
            <div className="mt-10 w-60 sm:w-80">
              <div className="h-5 w-full border-[3px] border-char bg-paper p-[2px]">
                <div className="h-full bg-char" style={{ width: `${progress}%` }} />
              </div>
              <p className="font-poster mt-3 text-center text-2xl tabular-nums">{progress}%</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}