import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con la Service Role key: se usa SOLO en el servidor (nunca debe
// llegar al navegador) para operaciones que necesitan saltarse las politicas
// de RLS, como confirmar un pedido desde el webhook de MercadoPago (esa
// llamada viene de los servidores de MercadoPago, no trae la sesion del
// usuario, asi que el cliente normal de Supabase no podria actualizar el
// pedido).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}