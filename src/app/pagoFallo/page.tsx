"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PagoFalloPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 py-20 text-center">
      <XCircle className="h-16 w-16 text-brick" />
      <h1 className="font-display text-4xl tracking-wide text-char">No se pudo procesar el pago</h1>
      <p className="max-w-md text-char/70">
        No te preocupes, no se realizo ningun cobro. Puedes intentarlo de nuevo desde tu carrito.
      </p>
      <Link href="/#menu" className="rounded-full bg-char px-8 py-3.5 font-semibold text-bone">
        Volver a la carta
      </Link>
    </main>
  );
}