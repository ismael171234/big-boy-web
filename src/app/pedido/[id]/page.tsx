"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, ChefHat, Clock, PackageCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type TrackingOrder = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items: { product_name: string; quantity: number }[];
};

const STEPS = [
  { key: "confirmed", label: "Recibido", icon: CheckCircle2 },
  { key: "preparing", label: "Preparando", icon: ChefHat },
  { key: "ready", label: "Listo", icon: Clock },
  { key: "delivered", label: "Entregado", icon: PackageCheck },
];

export default function PedidoTrackingPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const { data, error } = await supabase.rpc("get_order_tracking", {
        order_id: params.id,
      });
      if (error || !data) {
        setNotFound(true);
        return;
      }
      setOrder(data as TrackingOrder);
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [params.id]);

  if (notFound) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-char/70">No encontramos ese pedido.</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <p className="text-char/50">Cargando...</p>
      </main>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === order.status);
  const isWaitingPayment = order.status === "pending_payment" || order.status === "cancelled";

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="text-sm text-char/50">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
      <h1 className="mt-1 font-display text-4xl tracking-wide text-char">
        {isWaitingPayment ? "Esperando confirmación de pago" : "Estado de tu pedido"}
      </h1>

      {!isWaitingPayment && (
        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-char/10" />
          <div
            className="absolute left-0 top-6 h-0.5 bg-brick transition-all duration-500"
            style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const reached = i <= currentIndex;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / STEPS.length}%` }}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      reached ? "bg-brick text-bone" : "bg-bone text-char/30 ring-1 ring-char/10"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p
                    className={`mt-2 text-center text-xs font-semibold ${
                      reached ? "text-char" : "text-char/40"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-10 rounded-xl bg-white p-5 shadow-sm ring-1 ring-char/10">
        <ul className="space-y-1 text-sm text-char/70">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.quantity}x {item.product_name}
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-char/10 pt-3 text-right font-display text-xl text-char">
          S/ {Number(order.total).toFixed(2)}
        </div>
      </div>
    </main>
  );
}