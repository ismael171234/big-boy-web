"use client";

// Valores deterministas (no Math.random) para evitar mismatches de
// hidratación entre servidor y cliente, y para no violar la regla de
// pureza de render de React. Igual se ven orgánicos gracias al patrón
// pseudoaleatorio basado en el índice.
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
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