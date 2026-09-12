import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/actions/auth";
import { ProfileCard } from "@/components/ProfileCard";
import { Ticket, LogOut, ShoppingBag, Receipt } from "lucide-react";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: coupons }, { data: orders }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, purchase_count, avatar_url")
      .eq("id", user.id)
      .single(),
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
  const totalSpent = (orders ?? []).reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="min-h-screen bg-bone px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-brick">Mi cuenta</p>
          <form action={signOutAction}>
            <button className="flex items-center gap-2 rounded-full border border-char/20 px-4 py-2 text-sm font-medium text-char hover:border-brick hover:text-brick">
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </form>
        </div>

        <ProfileCard
          fullName={profile?.full_name ?? "Sin nombre"}
          email={user.email ?? ""}
          avatarUrl={profile?.avatar_url ?? null}
        />

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-char/5">
            <div className="flex items-center gap-2 text-char/50">
              <ShoppingBag className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Pedidos totales</p>
            </div>
            <p className="mt-2 font-display text-3xl text-char">{orders?.length ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-char/5">
            <div className="flex items-center gap-2 text-char/50">
              <Receipt className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Total gastado</p>
            </div>
            <p className="mt-2 font-display text-3xl text-char">S/ {totalSpent.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-char/5">
            <div className="flex items-center gap-2 text-char/50">
              <Ticket className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wide">Cupones activos</p>
            </div>
            <p className="mt-2 font-display text-3xl text-char">{coupons?.length ?? 0}</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-char p-6 text-bone">
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
            <ul className="divide-y divide-char/10 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-char/5">
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
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        o.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-light/30 text-amber"
                      }`}
                    >
                      {o.status}
                    </span>
                    <span className="font-semibold text-char">
                      S/ {Number(o.total).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl bg-white p-6 text-center text-char/60 shadow-sm ring-1 ring-char/5">
              Todavía no tienes pedidos. ¡Ve a la carta!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}