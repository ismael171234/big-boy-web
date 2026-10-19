"use client";

import { motion, useScroll, useSpring } from "motion/react";

// Barra fina en la parte superior que se llena mientras el cliente baja por la página.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[55] h-[4px] origin-left bg-ketchup"
    />
  );
}