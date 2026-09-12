"use client";

import { useActionState, useRef, useState } from "react";
import { Camera, Check, Pencil } from "lucide-react";
import { updateProfileAction, type ProfileFormState } from "@/actions/profile";

const initialState: ProfileFormState = {};

export function ProfileCard({
  fullName,
  email,
  avatarUrl,
}: {
  fullName: string;
  email: string;
  avatarUrl: string | null;
}) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);
  const [editingName, setEditingName] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      e.target.form?.requestSubmit();
    }
  };

  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <form
      action={formAction}
      className="flex flex-col items-center gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-char/5 sm:flex-row sm:items-center"
    >
      <div className="relative shrink-0">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-char text-2xl font-bold text-bone">
          {preview || avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview ?? avatarUrl ?? ""}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            initials || "?"
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Cambiar foto de perfil"
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-mustard text-char shadow ring-2 ring-white transition-transform hover:scale-105"
        >
          <Camera className="h-4 w-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          name="avatar"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex-1 text-center sm:text-left">
        {editingName ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              name="fullName"
              defaultValue={fullName}
              autoFocus
              className="rounded-lg border border-char/15 px-3 py-2 font-display text-xl tracking-wide text-char outline-none focus:border-brick"
            />
            <button
              type="submit"
              onClick={() => setEditingName(false)}
              className="flex items-center justify-center gap-1 rounded-full bg-char px-4 py-2 text-sm font-semibold text-bone hover:bg-brick"
            >
              <Check className="h-4 w-4" /> Guardar
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <h1 className="font-display text-3xl tracking-wide text-char">{fullName}</h1>
            <button
              type="button"
              onClick={() => setEditingName(true)}
              aria-label="Editar nombre"
              className="text-char/40 hover:text-brick"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        )}
        <p className="mt-1 text-sm text-char/60">{email}</p>

        {isPending && <p className="mt-2 text-xs text-amber">Guardando cambios...</p>}
        {state.error && <p className="mt-2 text-xs text-brick">{state.error}</p>}
        {state.success && !isPending && (
          <p className="mt-2 text-xs text-emerald-700">Perfil actualizado.</p>
        )}
      </div>
    </form>
  );
}