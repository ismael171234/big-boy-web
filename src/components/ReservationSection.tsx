"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { saveReservation } from "@/actions/reservations";
import { buildReservationMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/SectionHeading";

const PERKS = [
  "Reservas en menos de un minuto.",
  "Te confirmamos por WhatsApp.",
  "Sirve para cumpleaños y grupos.",
];

const inputCls =
  "w-full rounded-md border-[3px] border-char bg-white px-3.5 py-2.5 text-sm font-medium text-char outline-none transition placeholder:text-char/40 focus:bg-yolk/30";

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
    <section className="bg-char py-16 text-bone sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            tone="dark"
            title="Te guardamos la mesa"
            note="Completa el formulario y reserva sin llamar."
          />
          <ul className="mt-10">
            {PERKS.map((perk) => (
              <li
                key={perk}
                className="border-b-2 border-bone/20 py-4 font-poster text-xl uppercase leading-tight tracking-tight first:border-t-2 sm:text-2xl"
              >
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hard-yolk space-y-4 rounded-md border-[3px] border-yolk bg-paper p-5 text-char sm:p-8"
        >
          <p className="font-poster text-2xl uppercase tracking-tight">Datos de tu reserva</p>

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
                className={inputCls}
              />
            </Field>
            <Field label="Hora" className="sm:col-span-2">
              <input
                required
                type="time"
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                className={inputCls}
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
            className="lift hard-sm flex w-full items-center justify-center gap-2 rounded-md border-[3px] border-char bg-[#25D366] px-6 py-3.5 text-base font-bold text-char disabled:opacity-50"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
            {submitting ? "Enviando..." : "Reservar por WhatsApp"}
          </button>
        </form>
      </div>
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
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      {children}
    </label>
  );
}