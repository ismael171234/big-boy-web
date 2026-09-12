"use server";

import { createClient } from "@/lib/supabase/server";

export type ReservationInput = {
  name: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  notes?: string;
};

export async function saveReservation(input: ReservationInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("reservations").insert({
    user_id: user?.id ?? null,
    full_name: input.name,
    phone: input.phone,
    party_size: input.partySize,
    reservation_date: input.date,
    reservation_time: input.time,
    notes: input.notes ?? null,
  });

  if (error) {
    // Don't block the WhatsApp redirect if the DB write fails — log and continue,
    // the reservation still reaches the business over WhatsApp.
    console.error("saveReservation error:", error.message);
    return { ok: false };
  }
  return { ok: true };
}
