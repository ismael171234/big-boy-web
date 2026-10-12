"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

export default function PagoPendientePage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 py-20 text-center">
      <Clock className="h-16 w-16 text-amber" />
      <h1 className="font-display text-4xl tracking-wide text-char">Pago en proceso</h1>
      <p className="max-w-md text-char/70">
        Tu pago esta siendo procesado (esto es normal con algunos metodos, como pago en
        efectivo o transferencias). Te avisaremos apenas se confirme.
      </p>
      <Link href="/" className="rounded-full bg-char px-8 py-3.5 font-semibold text-bone">
        Volver al inicio
      </Link>
    </main>
  );
}