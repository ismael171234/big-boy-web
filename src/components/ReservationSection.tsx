"use client";

import { useState } from "react";
import { CalendarCheck, Clock, MessageCircle, Users } from "lucide-react";
import { saveReservation } from "@/actions/reservations";
import { buildReservationMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { Reveal } from "@/components/Reveal";

const PERKS = [
  { icon: Clock, title: "Rápido", text: "Reservas en menos de un minuto." },
  { icon: MessageCircle, title: "Confirmación por WhatsApp", text: "Te respondemos en minutos." },
  { icon: Users, title: "Para grupos", text: "Cumpleaños, salidas de equipo y más." },
];

const inputCls =
  "w-full rounded-xl border border-bone/15 bg-bone/[0.07] px-3.5 py-3 text-sm text-bone outline-none transition placeholder:text-bone/35 focus:border-amber-light focus:bg-bone/[0.1] focus:ring-2 focus:ring-amber-light/20";

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
    <section className="relative overflow-hidden bg-char py-16 text-bone sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brick/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber/15 blur-[110px]"
      />

      <Reveal className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="lg:pt-6">
          <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-amber-light">
            <span className="h-px w-8 bg-amber-light/50" />
            Reserva tu mesa
          </p>
          <h2 className="font-display mt-3 text-5xl tracking-wide sm:text-6xl">
            Te guardamos un lugar
          </h2>
          <p className="mt-4 max-w-md text-bone-dim">
            Completa el formulario y te confirmamos por WhatsApp en minutos.
            Ideal para cumpleaños, salidas de equipo o esa cita de burgers
            que se merece una mesa reservada.
          </p>

          <ul className="mt-8 space-y-4">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brick to-brick-light shadow-lg shadow-brick/30">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="text-sm text-bone-dim">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-bone/10 bg-bone/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8"
        >
          <div className="mb-2 flex items-center gap-3">
            <CalendarCheck className="h-6 w-6 text-amber-light" />
            <p className="font-display text-2xl tracking-wide">Datos de tu reserva</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre completo">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputCls}
                placeholder="Tu nombre"
              />
            </Field>
            <Field label="Teléfono">
              <input
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputCls}
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
                className={inputCls}
              />
            </Field>
            <Field label="Fecha">
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className={`${inputCls} [color-scheme:dark]`}
              />
            </Field>
            <Field label="Hora" className="sm:col-span-2">
              <input
                required
                type="time"
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                className={`${inputCls} [color-scheme:dark]`}
              />
            </Field>
            <Field label="Notas (opcional)" className="sm:col-span-2">
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className={`${inputCls} min-h-20 resize-none`}
                placeholder="Silla para bebé, mesa en terraza, etc."
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/25 transition hover:scale-[1.02] hover:bg-[#20bd5a] disabled:opacity-50"
          >
            <MessageCircle className="h-5 w-5" />
            {submitting ? "Enviando..." : "Reservar por WhatsApp"}
          </button>
        </form>
      </Reveal>
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
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-bone-dim">
        {label}
      </span>
      {children}
    </label>
  );
}