"use client";

// Generador pseudoaleatorio determinista basado SOLO en operaciones
// enteras (multiplicacion de 32 bits + XOR + shifts). A diferencia de
// Math.sin(), estas operaciones dan EXACTAMENTE el mismo resultado en
// cualquier motor de JavaScript (servidor y navegador), por lo que no
// provocan errores de hidratacion en Next.js.
function mulberry32(seed: number) {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function seeded(i: number, salt: number) {
  return mulberry32(i * 10007 + salt * 7919);
}

export function EmberField({ count = 14 }: { count?: number }) {
  const embers = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.round(seeded(i, 1) * 100)}%`,
    size: 3 + seeded(i, 2) * 5,
    duration: 4 + seeded(i, 3) * 5,
    delay: seeded(i, 4) * 6,
    drift: `${Math.round((seeded(i, 5) - 0.5) * 60)}px`,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {embers.map((e) => (
        <span
          key={e.id}
          className="ember"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            ["--drift" as string]: e.drift,
          }}
        />
      ))}
    </div>
  );
}