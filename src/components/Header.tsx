"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User as UserIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore } from "@/lib/cart-store";
import { useSession } from "@/lib/use-session";

const NAV_LINKS = [
  { id: "menu", href: "/#menu", label: "Carta" },
  { id: "promociones", href: "/#promociones", label: "Promociones" },
  { id: "reservas", href: "/#reservas", label: "Reservas" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");
  const { lines, toggle } = useCartStore();
  const { user } = useSession();
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  // Sombra / compactar el header al hacer scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      if (window.scrollY < 300) setActive("");
    };
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Resalta el enlace de la sección que se está viendo
  useEffect(() => {
    const els = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-mustard/90 shadow-lg shadow-black/20 backdrop-blur-md" : "bg-mustard"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-8 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
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

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "text-bone" : "text-char/75 hover:text-brick"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-char"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#menu"
            className="hidden rounded-full bg-brick px-5 py-2 text-sm font-bold text-bone shadow-md shadow-brick/30 transition hover:bg-brick-light lg:block"
          >
            Pedir ahora
          </Link>

          <Link
            href={user ? "/account" : "/login"}
            className="hidden items-center gap-2 rounded-full border border-char/25 px-4 py-2 text-sm font-medium text-char transition-colors hover:border-brick hover:text-brick sm:flex"
          >
            <UserIcon className="h-4 w-4" />
            {user ? "Mi cuenta" : "Ingresar"}
          </Link>

          <motion.button
            onClick={toggle}
            aria-label="Abrir carrito"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-char text-bone"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brick px-1 text-xs font-bold text-bone"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

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
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-char/10 md:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 py-4 sm:px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                  className="rounded-xl px-3 py-3 text-lg font-semibold text-char/85 transition-colors hover:bg-char/10 hover:text-brick"
                >
                  {link.label}
                </motion.a>
              ))}
              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-3 text-lg font-semibold text-char/85 transition-colors hover:bg-char/10 hover:text-brick"
              >
                <UserIcon className="h-5 w-5" />
                {user ? "Mi cuenta" : "Ingresar"}
              </Link>
              <Link
                href="/#menu"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-brick py-3 text-center text-base font-bold text-bone shadow-md shadow-brick/30"
              >
                Pedir ahora
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}