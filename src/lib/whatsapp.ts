import type { CartLine } from "@/lib/types";
import { lineTotal } from "@/lib/cart-store";

// Set this to the business WhatsApp number in international format, no symbols.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999999999";

export function buildWhatsappUrl(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function buildReservationMessage(params: {
  name: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  notes?: string;
}) {
  const lines = [
    "¡Hola! Quiero hacer una reserva en Burger House 🍔",
    `Nombre: ${params.name}`,
    `Teléfono: ${params.phone}`,
    `Personas: ${params.partySize}`,
    `Fecha: ${params.date}`,
    `Hora: ${params.time}`,
  ];
  if (params.notes) lines.push(`Notas: ${params.notes}`);
  return lines.join("\n");
}

export function buildOrderMessage(params: {
  lines: CartLine[];
  total: number;
  couponCode?: string;
  discount?: number;
}) {
  const header = "¡Hola! Quiero confirmar este pedido de Burger House 🍔";
  const items = params.lines.map((line) => {
    const options = line.selectedOptions.length
      ? "\n   - " + line.selectedOptions.map((o) => o.optionName).join("\n   - ")
      : "";
    return `• ${line.quantity}x ${line.productName} — S/ ${lineTotal(line).toFixed(2)}${options}`;
  });
  const footer = [
    params.couponCode ? `Cupón aplicado: ${params.couponCode} (-S/ ${params.discount?.toFixed(2)})` : null,
    `Total: S/ ${params.total.toFixed(2)}`,
  ].filter(Boolean);

  return [header, "", ...items, "", ...footer].join("\n");
}
