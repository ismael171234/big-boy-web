import type { ReactNode } from "react";

// Colores y textos de cada estado de pedido (se reutiliza en todo el panel)
export const STATUS_META: Record<
  string,
  { label: string; color: string; bg: string; text: string }
> = {
  pending_payment: { label: "Pendiente de pago", color: "#94a3b8", bg: "bg-slate-100", text: "text-slate-600" },
  confirmed: { label: "Confirmado", color: "#3b82f6", bg: "bg-blue-50", text: "text-blue-700" },
  preparing: { label: "Preparando", color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700" },
  ready: { label: "Listo", color: "#22c55e", bg: "bg-emerald-50", text: "text-emerald-700" },
  delivered: { label: "Entregado", color: "#475569", bg: "bg-slate-100", text: "text-slate-700" },
  cancelled: { label: "Cancelado", color: "#ef4444", bg: "bg-red-50", text: "text-red-700" },
};

export const STATUS_ORDER = [
  "pending_payment",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
];

export function money(n: number) {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function timeAgo(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? {
    label: status,
    color: "#94a3b8",
    bg: "bg-slate-100",
    text: "text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.bg} ${meta.text}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}

// Tarjeta blanca base de todo el panel
export function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-char/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(28,24,21,0.04),0_8px_24px_-12px_rgba(28,24,21,0.08)] ${className}`}
    >
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-sm font-bold text-char">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-char/50">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}