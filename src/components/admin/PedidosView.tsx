"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clock, CreditCard, Mail, Phone, RefreshCw, Search, Tag } from "lucide-react";
import { getAdminOrders, type AdminOrder } from "@/actions/admin-data";
import { updateOrderStatus } from "@/actions/staff";
import { STATUS_META, STATUS_ORDER, StatusBadge, money, timeAgo } from "./ui";

const CHANNEL_LABEL: Record<string, string> = {
  mercadopago: "MercadoPago (online)",
  whatsapp: "WhatsApp",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function PedidosView() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tick, setTick] = useState(0); // al subirlo se vuelve a cargar

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const data = await getAdminOrders();
      if (!alive) return;
      setOrders(data);
      setLoading(false);
    };
    load();
    const t = setInterval(load, 10000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [tick]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    for (const o of orders ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders ?? []).filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.short.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    });
  }, [orders, filter, query]);

  const changeStatus = async (order: AdminOrder, status: string) => {
    if (status === order.status || busyId) return;
    if (status === "cancelled" && !window.confirm(`¿Cancelar el pedido #${order.short}?`)) return;

    setBusyId(order.id);
    // Cambio inmediato en pantalla; si falla, se revierte
    setOrders((prev) => prev?.map((o) => (o.id === order.id ? { ...o, status } : o)) ?? prev);
    const res = await updateOrderStatus(order.id, status);
    if (!res.ok) {
      setOrders((prev) =>
        prev?.map((o) => (o.id === order.id ? { ...o, status: order.status } : o)) ?? prev
      );
      window.alert("No se pudo cambiar el estado. Intenta de nuevo.");
    }
    setBusyId(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-char/[0.06]" />
        ))}
      </div>
    );
  }

  if (orders === null) {
    return (
      <div className="rounded-2xl border border-char/[0.07] bg-white py-16 text-center text-sm text-char/60">
        No se pudieron cargar los pedidos. Revisa tu sesión o la conexión con Supabase.
      </div>
    );
  }

  const tabs = [{ id: "all", label: "Todos" }, ...STATUS_ORDER.map((s) => ({ id: s, label: STATUS_META[s].label }))];

  return (
    <div className="space-y-5">
      {/* Barra de búsqueda + filtros */}
      <div className="rounded-2xl border border-char/[0.07] bg-white p-4 shadow-[0_1px_2px_rgba(28,24,21,0.04)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-char/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código, cliente o producto…"
              className="w-full rounded-xl border border-char/10 bg-bone/50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brick focus:bg-white focus:ring-2 focus:ring-brick/15"
            />
          </div>
          <button
            onClick={() => setTick((n) => n + 1)}
            className="flex items-center justify-center gap-2 rounded-xl border border-char/10 px-3.5 py-2.5 text-xs font-semibold text-char/70 transition hover:border-brick hover:text-brick"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Actualizar
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-brick text-white shadow-md shadow-brick/25"
                    : "bg-char/[0.05] text-char/65 hover:bg-char/10"
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active ? "bg-white/25" : "bg-white text-char/60"
                  }`}
                >
                  {counts[t.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-char/15 bg-white py-16 text-center text-sm text-char/50">
          No hay pedidos con ese filtro.
        </div>
      ) : (
        <ul className="space-y-4">
          {visible.map((o) => (
            <li
              key={o.id}
              className="overflow-hidden rounded-2xl border border-char/[0.07] bg-white shadow-[0_1px_2px_rgba(28,24,21,0.04),0_8px_24px_-12px_rgba(28,24,21,0.08)]"
            >
              {/* Cabecera */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-char/[0.06] px-5 py-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-xs font-bold text-brick">
                    #{o.short}
                    <span className="flex items-center gap-1 font-normal text-char/40">
                      <Clock className="h-3 w-3" />
                      {timeAgo(o.createdAt)} · {formatDate(o.createdAt)}
                    </span>
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-char">{o.customerName}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-char/55">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {o.customerEmail}
                    </span>
                    {o.customerPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {o.customerPhone}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-display text-2xl leading-none tracking-wide text-char">
                    {money(o.total)}
                  </span>
                  <StatusBadge status={o.status} />
                </div>
              </div>

              {/* Productos */}
              <div className="px-5 py-4">
                <ul className="space-y-2.5">
                  {o.items.map((it, idx) => (
                    <li key={idx} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="font-semibold text-char">
                          <span className="mr-1.5 rounded-md bg-char/[0.06] px-1.5 py-0.5 text-xs font-bold">
                            {it.quantity}×
                          </span>
                          {it.name}
                        </p>
                        {it.options.length > 0 && (
                          <p className="mt-0.5 pl-9 text-xs text-char/50">{it.options.join(" · ")}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-char/55">
                        {money(it.unitPrice * it.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-bone/60 px-4 py-3 text-xs text-char/65">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" />
                    <b className="text-char">Pago:</b> {CHANNEL_LABEL[o.channel] ?? o.channel}
                  </span>
                  <span>
                    <b className="text-char">Subtotal:</b> {money(o.subtotal)}
                  </span>
                  {o.discount > 0 && (
                    <span className="flex items-center gap-1.5 text-brick">
                      <Tag className="h-3.5 w-3.5" />
                      <b>Descuento{o.couponCode ? ` (${o.couponCode})` : ""}:</b> -{money(o.discount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Cambiar estado */}
              <div className="flex flex-wrap items-center gap-2 border-t border-char/[0.06] bg-char/[0.02] px-5 py-3">
                <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-char/40">
                  Estado
                </span>
                {STATUS_ORDER.map((s) => {
                  const active = o.status === s;
                  return (
                    <button
                      key={s}
                      disabled={busyId === o.id}
                      onClick={() => changeStatus(o, s)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                        active
                          ? "bg-brick text-white shadow-md shadow-brick/25"
                          : "border border-char/10 bg-white text-char/65 hover:border-brick hover:text-brick"
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {STATUS_META[s].label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="pb-2 text-center text-[11px] text-char/35">
        Mostrando {visible.length} de {orders.length} pedidos · se actualiza cada 10 segundos
      </p>
    </div>
  );
}