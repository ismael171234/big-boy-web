"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Gift,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Users,
  X,
} from "lucide-react";
import { logoutStaff } from "@/actions/staff";
import { DashboardView } from "@/components/admin/DashboardView";
import { PedidosView } from "@/components/admin/PedidosView";
import { ProductosView } from "@/components/admin/ProductosView";

type SectionId =
  | "dashboard"
  | "reportes"
  | "pedidos"
  | "productos"
  | "ofertas"
  | "categorias"
  | "usuarios"
  | "configuracion";

const NAV: { id: SectionId; label: string; subtitle: string; icon: typeof Menu }[] = [
  { id: "dashboard", label: "Dashboard", subtitle: "Resumen del negocio en tiempo real", icon: LayoutDashboard },
  { id: "reportes", label: "Reportes", subtitle: "Ventas y analíticas por período", icon: BarChart3 },
  { id: "pedidos", label: "Pedidos", subtitle: "Gestión de todos los pedidos", icon: ClipboardList },
  { id: "productos", label: "Productos", subtitle: "Carta y catálogo de productos", icon: Package },
  { id: "ofertas", label: "Ofertas", subtitle: "Promociones por tiempo limitado", icon: Gift },
  { id: "categorias", label: "Categorías", subtitle: "Organiza tu carta", icon: Layers },
  { id: "usuarios", label: "Usuarios", subtitle: "Clientes registrados", icon: Users },
  { id: "configuracion", label: "Configuración", subtitle: "Datos del restaurante, envíos y pagos", icon: Settings },
];

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-char/15 bg-white px-6 py-20 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-mustard/20 text-amber">
        <Settings className="h-6 w-6" />
      </span>
      <p className="font-display text-2xl tracking-wide text-char">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-char/55">
        Esta sección se está construyendo por partes. Pronto estará disponible.
      </p>
    </div>
  );
}

export function AdminOrders() {
  const router = useRouter();
  const [section, setSection] = useState<SectionId>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [today] = useState(() =>
    new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date())
  );

  const current = NAV.find((n) => n.id === section) ?? NAV[0];

  const handleLogout = async () => {
    await logoutStaff();
    router.refresh();
  };

  return (
    // fixed + z alto: cubre cualquier header/footer de la web pública
    <div className="fixed inset-0 z-[60] flex bg-[#f4f1ea] font-body text-char">
      {/* Fondo oscuro en móvil cuando el menú está abierto */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-10 bg-char/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ───── Sidebar ───── */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-char text-bone transition-transform duration-300 lg:static lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-mustard">
              Big Boy Burgers
            </p>
            <p className="font-display text-xl leading-none tracking-wide">Panel Admin</p>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-bone/60 hover:text-bone lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brick text-sm font-bold">
            A
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">Administrador</p>
            <span className="mt-0.5 inline-block rounded-full bg-brick/30 px-2 py-0.5 text-[10px] font-semibold text-amber-light">
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.id === section;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSection(item.id);
                  setMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-brick to-brick-light text-white shadow-lg shadow-brick/30"
                    : "text-bone/65 hover:bg-white/[0.06] hover:text-bone"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="m-3 flex items-center gap-3 rounded-xl border-t border-white/10 px-3.5 py-3 text-sm font-medium text-bone/65 transition-colors hover:bg-white/[0.06] hover:text-bone"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Cerrar sesión
        </button>
      </aside>

      {/* ───── Contenido ───── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-char/[0.07] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-char/10 text-char/70 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold leading-tight text-char">{current.label}</h1>
              <p className="hidden text-xs text-char/50 sm:block">{current.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              En línea
            </span>
            <span suppressHydrationWarning className="hidden text-xs capitalize text-char/50 md:block">
              {today}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {section === "dashboard" ? (
            <DashboardView />
          ) : section === "pedidos" ? (
            <PedidosView />
          ) : section === "productos" ? (
            <ProductosView />
          ) : (
            <ComingSoon title={current.label} />
          )}
        </main>
      </div>
    </div>
  );
}