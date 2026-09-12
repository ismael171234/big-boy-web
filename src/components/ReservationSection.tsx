"use client";

import { useState } from "react";
import { saveReservation } from "@/actions/reservations";
import { buildReservationMessage, buildWhatsappUrl } from "@/lib/whatsapp";

export function ReservationSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    partySize: 2,
    date: "",
    time: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await saveReservation({
      name: form.name,
      phone: form.phone,
      partySize: Number(form.partySize),
      date: form.date,
      time: form.time,
      notes: form.notes || undefined,
    });

    const message = buildReservationMessage({
      name: form.name,
      phone: form.phone,
      partySize: Number(form.partySize),
      date: form.date,
      time: form.time,
      notes: form.notes || undefined,
    });

    window.open(buildWhatsappUrl(message), "_blank");
    setSubmitting(false);
  };

  return (
    <section id="reservas" className="bg-char py-16 text-bone sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-medium text-amber-light">Reserva tu mesa</p>
          <h2 className="font-display text-4xl tracking-wide sm:text-5xl">
            Te guardamos un lugar
          </h2>
          <p className="mt-4 max-w-md text-bone-dim">
            Completa el formulario y te confirmamos por WhatsApp en minutos.
            Ideal para cumpleaños, salidas de equipo o esa cita de burgers
            que se merece una mesa reservada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre completo">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input"
                placeholder="Tu nombre"
              />
            </Field>
            <Field label="Teléfono">
              <input
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="input"
                placeholder="+51 999 999 999"
              />
            </Field>
            <Field label="Personas">
              <input
                required
                type="number"
                min={1}
                max={20}
                value={form.partySize}
                onChange={(e) => update("partySize", Number(e.target.value))}
                className="input"
              />
            </Field>
            <Field label="Fecha">
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Hora" className="sm:col-span-2">
              <input
                required
                type="time"
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Notas (opcional)" className="sm:col-span-2">
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="input min-h-20 resize-none"
                placeholder="Silla para bebé, mesa en terraza, etc."
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Reservar por WhatsApp"}
          </button>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          background: rgba(247,243,236,0.08);
          border: 1px solid rgba(247,243,236,0.18);
          padding: 0.65rem 0.9rem;
          color: var(--color-bone);
          font-size: 0.9rem;
        }
        .input::placeholder { color: rgba(247,243,236,0.4); }
        .input:focus { border-color: var(--color-amber-light); outline: none; }
      `}</style>
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1.5 block text-bone-dim">{label}</span>
      {children}
    </label>
  );
}
