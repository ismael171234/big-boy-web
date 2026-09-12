"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthFormState } from "@/actions/auth";

const initialState: AuthFormState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-char px-5 py-28 text-bone">
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl tracking-wide">Bienvenido de vuelta</h1>
        <p className="mt-2 text-bone-dim">Ingresa para ver tus pedidos y cupones.</p>

        <form action={formAction} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block text-bone-dim">Correo</span>
            <input name="email" type="email" required className="input" placeholder="tucorreo@gmail.com" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-bone-dim">Contraseña</span>
            <input name="password" type="password" required className="input" placeholder="••••••••" />
          </label>

          {state.error && <p className="text-sm text-amber-light">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-brick px-6 py-3 text-sm font-semibold text-bone transition-colors hover:bg-brick-light disabled:opacity-50"
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-bone-dim">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/register" className="text-amber-light underline">
            Regístrate
          </Link>
        </p>
      </div>

      <style>{`
        .input { width: 100%; border-radius: 0.75rem; background: rgba(247,243,236,0.08);
          border: 1px solid rgba(247,243,236,0.18); padding: 0.65rem 0.9rem; color: var(--color-bone); font-size: 0.9rem; }
        .input::placeholder { color: rgba(247,243,236,0.4); }
        .input:focus { border-color: var(--color-amber-light); outline: none; }
      `}</style>
    </div>
  );
}
