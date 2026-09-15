"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useSession } from "@/lib/use-session";

const NAV_LINKS = [
  { href: "/#menu", label: "Carta" },
  { href: "/#promociones", label: "Promociones" },
  { href: "/#reservas", label: "Reservas" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lines, toggle } = useCartStore();
  const { user } = useSession();
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil automáticamente si la pantalla crece a tamaño desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 bg-mustard transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-black/15" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="relative block h-9 w-36 shrink-0 sm:h-11 sm:w-44">
          <Image
            src="/logo-bigboy.png"
            alt="Big Boy Burgers"
            fill
            sizes="180px"
            className="object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-char/75 transition-colors hover:text-brick"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={user ? "/account" : "/login"}
            className="hidden items-center gap-2 rounded-full border border-char/25 px-4 py-2 text-sm font-medium text-char transition-colors hover:border-brick hover:text-brick sm:flex"
          >
            <UserIcon className="h-4 w-4" />
            {user ? "Mi cuenta" : "Ingresar"}
          </Link>

          <button
            onClick={toggle}
            aria-label="Abrir carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-char text-bone transition-transform hover:scale-105"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brick px-1 text-xs font-bold text-bone">
                {itemCount}
              </span>
            )}
          </button>

          {/* Botón hamburguesa: solo visible por debajo de md */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-char transition-colors hover:bg-char/10 md:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Panel del menú móvil */}
      <div
        className={`overflow-hidden bg-mustard transition-[max-height] duration-300 ease-in-out md:hidden ${
          mobileOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 border-t border-char/10 px-5 py-3 sm:px-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-3 text-base font-medium text-char/85 transition-colors hover:bg-char/10 hover:text-brick"
            >
              {link.label}
            </a>
          ))}
          <Link
            href={user ? "/account" : "/login"}
            onClick={() => setMobileOpen(false)}
            className="mt-1 flex items-center gap-2 rounded-lg px-2 py-3 text-base font-medium text-char/85 transition-colors hover:bg-char/10 hover:text-brick"
          >
            <UserIcon className="h-4 w-4" />
            {user ? "Mi cuenta" : "Ingresar"}
          </Link>
        </nav>
      </div>
    </header>
  );
}