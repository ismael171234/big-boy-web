"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { signUpAction, type AuthFormState } from "@/actions/auth";

const initialState: AuthFormState = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  if (state.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-char px-5 py-28 text-bone">
        <div className="max-w-md text-center">
          <Mail className="mx-auto h-10 w-10 text-amber-light" />
          <h1 className="mt-4 font-display text-3xl tracking-wide">Revisa tu correo</h1>
          <p className="mt-2 text-bone-dim">
            Te enviamos un enlace de confirmación a tu correo. Ábrelo para activar tu cuenta y
            empezar a acumular compras.
          </p>
          <Link href="/login" className="mt-6 inline-block text-amber-light underline">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-char px-5 py-28 text-bone">
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl tracking-wide">Crea tu cuenta</h1>
        <p className="mt-2 text-bone-dim">
          Acumula tus compras y desbloquea un cupón cada 10 pedidos.
        </p>

        <form action={formAction} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block text-bone-dim">Nombre completo</span>
            <input name="fullName" required className="input" placeholder="Tu nombre" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-bone-dim">Correo (Gmail u otro)</span>
            <input name="email" type="email" required className="input" placeholder="tucorreo@gmail.com" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-bone-dim">Teléfono</span>
            <input name="phone" className="input" placeholder="+51 999 999 999" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-bone-dim">Contraseña</span>
            <input name="password" type="password" required minLength={6} className="input" placeholder="Mínimo 6 caracteres" />
          </label>

          {state.error && <p className="text-sm text-amber-light">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-brick px-6 py-3 text-sm font-semibold text-bone transition-colors hover:bg-brick-light disabled:opacity-50"
          >
            {pending ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-sm text-bone-dim">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-amber-light underline">
            Ingresa
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
