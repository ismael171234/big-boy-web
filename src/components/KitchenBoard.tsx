"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { listKitchenOrders, logoutStaff, updateOrderStatus } from "@/actions/staff";

type KitchenOrder = Awaited<ReturnType<typeof listKitchenOrders>>[number];

const COLUMNS = ["confirmed", "preparing", "ready"] as const;

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Recibido",
  preparing: "Preparando",
  ready: "Listo",
  delivered: "Entregado",
};

const STATUS_DOT: Record<string, string> = {
  confirmed: "bg-blue-500",
  preparing: "bg-amber-500",
  ready: "bg-green-500",
};

const NEXT_STATUS: Record<string, string> = {
  confirmed: "preparing",
  preparing: "ready",
  ready: "delivered",
};

const NEXT_ACTION_LABEL: Record<string, string> = {
  confirmed: "Empezar a preparar",
  preparing: "Marcar como listo",
  ready: "Marcar como entregado",
};

export function KitchenBoard({ embedded = false }: { embedded?: boolean }) {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const refresh = async () => {
    const data = await listKitchenOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdvance = (orderId: string, nextStatus: string) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, nextStatus);
      refresh();
    });
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logoutStaff();
      router.refresh();
    });
  };

  const grouped = {
    confirmed: orders.filter((o) => o.status === "confirmed"),
    preparing: orders.filter((o) => o.status === "preparing"),
    ready: orders.filter((o) => o.status === "ready"),
  };

  return (
    <section className={embedded ? "" : "min-h-screen bg-gray-50"}>
      {!embedded && (
        <header className="border-b border-char/10 bg-char px-5 py-5 sm:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-light/80">
                Big Boy Burgers
              </p>
              <h1 className="font-display text-3xl tracking-wide text-bone">Panel de Cocina</h1>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-bone/20 px-4 py-2 text-sm font-semibold text-bone hover:bg-bone/10"
            >
              Cerrar sesión
            </button>
          </div>
        </header>
      )}

      <div className={embedded ? "" : "mx-auto max-w-6xl px-5 py-8 sm:px-8"}>
        {!embedded && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            {COLUMNS.map((statusKey) => (
              <div key={statusKey} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-char/10">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[statusKey]}`} />
                  <p className="text-xs font-semibold uppercase tracking-wide text-char/50">
                    {STATUS_LABEL[statusKey]}
                  </p>
                </div>
                <p className="mt-1 font-display text-3xl text-char">{grouped[statusKey].length}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-char/60">Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-char/10">
            <p className="text-char/60">No hay pedidos activos por ahora.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {COLUMNS.map((statusKey) => (
              <div key={statusKey}>
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[statusKey]}`} />
                  <h2 className="font-semibold text-char/70">
                    {STATUS_LABEL[statusKey]} ({grouped[statusKey].length})
                  </h2>
                </div>
                <div className="flex flex-col gap-3">
                  {grouped[statusKey].map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-char/10"
                    >
                      <p className="text-xs text-char/40">
                        #{order.id.slice(0, 8).toUpperCase()} ·{" "}
                        {new Date(order.created_at).toLocaleTimeString("es-PE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-char">
                        {order.order_items?.map((item, i) => (
                          <li key={i}>
                            {item.quantity}x {item.product_name}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 font-semibold text-brick">
                        S/ {Number(order.total).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleAdvance(order.id, NEXT_STATUS[statusKey])}
                        className="mt-3 w-full rounded-full bg-char py-2 text-sm font-semibold text-bone hover:bg-brick"
                      >
                        {NEXT_ACTION_LABEL[statusKey]}
                      </button>
                    </div>
                  ))}
                  {grouped[statusKey].length === 0 && (
                    <p className="text-sm text-char/40">Vacío</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 