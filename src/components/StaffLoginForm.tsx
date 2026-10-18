"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginStaff } from "@/actions/staff";
import type { StaffRole } from "@/lib/staff-auth";

export function StaffLoginForm({ role, title }: { role: StaffRole; title: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await loginStaff(role, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-char px-6">
      <form action={handleSubmit} className="w-full max-w-sm rounded-2xl bg-bone p-8 shadow-xl">
        <h1 className="font-display text-3xl tracking-wide text-char">{title}</h1>
        <p className="mt-1 text-sm text-char/60">Ingresa tu correo y clave para continuar.</p>

        <input
          type="email"
          name="email"
          placeholder="Correo"
          required
          autoFocus
          className="mt-6 w-full rounded-lg border border-char/20 px-4 py-3 text-char outline-none focus:border-brick"
        />

        <input
          type="password"
          name="password"
          placeholder="Clave"
          required
          className="mt-3 w-full rounded-lg border border-char/20 px-4 py-3 text-char outline-none focus:border-brick"
        />

        {error && <p className="mt-3 text-sm text-brick">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full rounded-full bg-char py-3 font-semibold text-bone disabled:opacity-50"
        >
          {pending ? "Verificando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
} 