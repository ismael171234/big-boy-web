import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/actions/auth";
import { Ticket, LogOut } from "lucide-react";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: coupons }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("full_name, purchase_count").eq("id", user.id).single(),
    supabase
      .from("coupons")
      .select("code, discount_percent, expires_at")
      .eq("user_id", user.id)
      .eq("is_used", false),
    supabase
      .from("orders")
      .select("id, total, created_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const purchaseCount = profile?.purchase_count ?? 0;
  const progressToNextCoupon = purchaseCount % 10;

  return (
    <div className="min-h-screen bg-bone px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brick">Mi cuenta</p>
            <h1 className="font-display text-4xl tracking-wide text-char">
              Hola, {profile?.full_name ?? user.email}
            </h1>
          </div>
          <form action={signOutAction}>
            <button className="flex items-center gap-2 rounded-full border border-char/20 px-4 py-2 text-sm font-medium text-char hover:border-brick hover:text-brick">
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-2xl bg-char p-6 text-bone">
          <div className="flex items-center justify-between">
            <p className="font-medium">Progreso hacia tu próximo cupón</p>
            <span className="text-amber-light">{progressToNextCoupon}/10 compras</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bone/15">
            <div
              className="h-full rounded-full bg-amber-light transition-all"
              style={{ width: `${(progressToNextCoupon / 10) * 100}%` }}
            />
          </div>
        </div>

        {coupons && coupons.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 font-display text-2xl tracking-wide text-char">Tus cupones</h2>
            <div className="flex flex-wrap gap-3">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-amber bg-amber-light/20 px-4 py-3"
                >
                  <Ticket className="h-5 w-5 text-brick" />
                  <div>
                    <p className="font-semibold text-char">{c.code}</p>
                    <p className="text-xs text-char/60">-{c.discount_percent}% de descuento</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 font-display text-2xl tracking-wide text-char">Tus pedidos</h2>
          {orders && orders.length > 0 ? (
            <ul className="divide-y divide-char/10 rounded-2xl bg-white">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-char">
                      Pedido #{o.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-char/50">
                      {new Date(o.created_at).toLocaleDateString("es-PE")}
                    </p>
                  </div>
                  <span className="font-semibold text-char">S/ {Number(o.total).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-char/60">Todavía no tienes pedidos. ¡Ve a la carta!</p>
          )}
        </div>
      </div>
    </div>
  );
}
