"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChefHat,
  Clock,
  DollarSign,
  Receipt,
  ShoppingBag,
  Trophy,
} from "lucide-react";
import { getDashboardData, type DashboardData } from "@/actions/admin-data";
import { Card, STATUS_META, STATUS_ORDER, StatusBadge, money, timeAgo } from "./ui";

/* ───────────── Tarjeta de indicador (KPI) ───────────── */
function Kpi({
  label,
  value,
  icon,
  tone,
  foot,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: string; // clases del círculo del icono
  foot?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-char/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(28,24,21,0.04),0_8px_24px_-12px_rgba(28,24,21,0.08)]">
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-char/45">
            {label}
          </p>
          <p className="font-display text-3xl leading-none tracking-wide text-char">{value}</p>
        </div>
      </div>
      {foot && <div className="mt-3 border-t border-char/[0.06] pt-3 text-xs">{foot}</div>}
    </div>
  );
}

/* ───────────── Gráfico de barras: ventas por día ───────────── */
function SalesChart({ days }: { days: DashboardData["days"] }) {
  const max = Math.max(...days.map((d) => d.sales), 1);
  const total = days.reduce((s, d) => s + d.sales, 0);
  const orders = days.reduce((s, d) => s + d.orders, 0);
  const lines = [1, 0.75, 0.5, 0.25, 0];

  return (
    <Card
      title="Ventas de los últimos 7 días"
      subtitle={`${money(total)} · ${orders} pedidos pagados`}
    >
      <div className="relative h-56 pl-10">
        {/* Líneas guía */}
        {lines.map((p) => (
          <div
            key={p}
            className="absolute inset-x-0 flex items-center"
            style={{ bottom: `calc(${p * 100}% * 0.86 + 1.5rem)` }}
          >
            <span className="w-9 pr-2 text-right text-[10px] text-char/35">
              {Math.round(max * p)}
            </span>
            <span className="h-px flex-1 border-t border-dashed border-char/10" />
          </div>
        ))}

        {/* Barras */}
        <div className="absolute inset-0 flex items-end gap-2 pb-6 pl-10 sm:gap-4">
          {days.map((d, i) => {
            const h = (d.sales / max) * 86;
            const isToday = i === days.length - 1;
            return (
              <div key={d.key} className="group relative flex h-full flex-1 flex-col justify-end">
                <div className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-char px-2.5 py-1.5 text-[11px] text-bone opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <p className="font-bold">{money(d.sales)}</p>
                  <p className="text-bone/60">{d.orders} pedidos</p>
                </div>
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isToday
                      ? "bg-gradient-to-t from-brick to-amber"
                      : "bg-gradient-to-t from-char/80 to-char/50 group-hover:from-brick group-hover:to-amber"
                  }`}
                  style={{ height: `${Math.max(h, d.sales > 0 ? 3 : 1)}%` }}
                />
                <p className="absolute -bottom-6 left-0 right-0 text-center text-[10px] font-medium capitalize text-char/50">
                  {d.weekday} {d.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ───────────── Dona: estado de los pedidos ───────────── */
function StatusDonut({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const active = STATUS_ORDER.filter((s) => (counts[s] ?? 0) > 0);
  const segments = active.map((s, i) => {
    const pct = total > 0 ? (counts[s] / total) * 100 : 0;
    const offset = active
      .slice(0, i)
      .reduce((sum, prev) => sum + (total > 0 ? (counts[prev] / total) * 100 : 0), 0);
    return { status: s, pct, offset };
  });

  return (
    <Card title="Estado de pedidos" subtitle="Distribución total">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
            <circle cx="21" cy="21" r="15.915" fill="none" stroke="#f1ede4" strokeWidth="5" />
            {segments.map((s) => (
              <circle
                key={s.status}
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke={STATUS_META[s.status]?.color ?? "#94a3b8"}
                strokeWidth="5"
                strokeDasharray={`${s.pct} ${100 - s.pct}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl leading-none text-char">{total}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-char/45">
              pedidos
            </span>
          </div>
        </div>

        <ul className="w-full space-y-2">
          {STATUS_ORDER.map((s) => (
            <li key={s} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-char/70">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: STATUS_META[s].color }}
                />
                {STATUS_META[s].label}
              </span>
              <span className="font-bold text-char">{counts[s] ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ───────────── Productos más vendidos ───────────── */
function TopProducts({ items }: { items: DashboardData["topProducts"] }) {
  const max = Math.max(...items.map((i) => i.qty), 1);
  return (
    <Card title="Más vendidos" subtitle="Por unidades en pedidos pagados">
      {items.length === 0 ? (
        <p className="py-8 text-center text-xs text-char/40">Aún no hay ventas registradas.</p>
      ) : (
        <ol className="space-y-4">
          {items.map((p, i) => (
            <li key={p.name}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="flex min-w-0 items-center gap-2 font-semibold text-char">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                      i === 0 ? "bg-mustard text-char" : "bg-char/[0.06] text-char/60"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate">{p.name}</span>
                </span>
                <span className="shrink-0 font-bold text-char">{p.qty} uds.</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-char/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber to-brick transition-all duration-700"
                  style={{ width: `${(p.qty / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

/* ───────────── Últimos pedidos ───────────── */
function RecentOrders({ rows }: { rows: DashboardData["recent"] }) {
  return (
    <Card title="Últimos pedidos" subtitle="Los 8 más recientes">
      {rows.length === 0 ? (
        <p className="py-8 text-center text-xs text-char/40">Aún no hay pedidos.</p>
      ) : (
        <ul className="divide-y divide-char/[0.06]">
          {rows.map((o) => (
            <li key={o.id} className="flex items-center gap-3 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-char/[0.05] text-char/60">
                <Receipt className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-xs font-bold text-char">
                  #{o.short}
                  <span className="font-normal text-char/40">{timeAgo(o.createdAt)}</span>
                </p>
                <p className="truncate text-xs text-char/55">{o.items || "—"}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-char">{money(o.total)}</span>
                <StatusBadge status={o.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ───────────── Vista principal ───────────── */
export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const d = await getDashboardData();
      if (!alive) return;
      setData(d);
      setLoading(false);
    };
    load();
    const t = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-char/[0.06]" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-char/[0.06]" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <p className="py-10 text-center text-sm text-char/60">
          No se pudieron cargar los datos. Revisa tu sesión o la conexión con Supabase.
        </p>
      </Card>
    );
  }

  const { kpis, totals } = data;
  const delta = kpis.salesDeltaPct;

  return (
    <div className="space-y-5">
      {/* Fila 1: indicadores del día */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Ventas de hoy"
          value={money(kpis.salesToday)}
          icon={<DollarSign className="h-5 w-5" />}
          tone="bg-emerald-50 text-emerald-600"
          foot={
            delta === null ? (
              <span className="text-char/45">Sin ventas ayer para comparar</span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  delta >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {delta >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(delta).toFixed(0)}% vs ayer
              </span>
            )
          }
        />
        <Kpi
          label="Pedidos de hoy"
          value={String(kpis.ordersToday)}
          icon={<ShoppingBag className="h-5 w-5" />}
          tone="bg-blue-50 text-blue-600"
          foot={<span className="text-char/45">Ticket promedio {money(kpis.avgTicket)}</span>}
        />
        <Kpi
          label="Pendientes de pago"
          value={String(kpis.pendingPayment)}
          icon={<Clock className="h-5 w-5" />}
          tone="bg-amber-50 text-amber-600"
          foot={<span className="text-char/45">Esperando confirmación de MercadoPago</span>}
        />
        <Kpi
          label="En cocina"
          value={String(kpis.inKitchen)}
          icon={<ChefHat className="h-5 w-5" />}
          tone="bg-brick/10 text-brick"
          foot={<span className="text-char/45">Confirmados + preparando</span>}
        />
      </div>

      {/* Fila 2: gráfico + resumen */}
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart days={data.days} />
        </div>
        <Card title="Resumen general" subtitle="Totales del negocio">
          <dl className="divide-y divide-char/[0.06] text-xs">
            {[
              ["Total de pedidos", String(totals.orders)],
              ["Total de ventas", money(totals.sales)],
              ["Usuarios registrados", String(totals.users)],
              ["Productos en carta", String(totals.products)],
              ["Pedidos entregados", String(data.statusCounts["delivered"] ?? 0)],
              ["Pedidos cancelados", String(data.statusCounts["cancelled"] ?? 0)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-3">
                <dt className="text-char/60">{k}</dt>
                <dd className="font-bold text-char">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      {/* Fila 3: estado, más vendidos, últimos pedidos */}
      <div className="grid gap-5 xl:grid-cols-3">
        <StatusDonut counts={data.statusCounts} />
        <TopProducts items={data.topProducts} />
        <RecentOrders rows={data.recent} />
      </div>

      <p className="flex items-center justify-center gap-1.5 pb-2 text-[11px] text-char/35">
        <Trophy className="h-3 w-3" /> Datos en vivo · se actualizan cada 15 segundos
      </p>
    </div>
  );
}