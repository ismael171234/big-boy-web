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
  { id: "promociones", href: "/#promociones", label: "Favoritos" },
  { id: "reservas", href: "/#reservas", label: "Reservas" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");
  const { lines, toggle } = useCartStore();
  const { user } = useSession();
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  // Compacta el header al hacer scroll
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

  // Marca el enlace de la sección que se está viendo
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

  // Cierra el menú móvil si la pantalla crece a tamaño desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-[3px] border-char bg-yolk">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-8 ${
          scrolled ? "py-1.5" : "py-3"
        }`}
      >
        <Link href="/" className="relative block h-9 w-36 shrink-0 sm:h-11 sm:w-44">
          <Image
            src="/logo-bigboy.png"
            alt="Big Boy Burgers"
            fill
            sizes="180px"
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className="group relative py-2 text-sm font-bold text-char"
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-char transition-transform duration-200 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/#menu"
            className="lift hard-red hidden rounded-md border-[3px] border-char bg-char px-5 py-1.5 text-sm font-bold text-yolk lg:block"
          >
            Pedir ahora
          </Link>

          <Link
            href={user ? "/account" : "/login"}
            className="hidden items-center gap-2 rounded-md border-[3px] border-char px-3.5 py-1.5 text-sm font-bold text-char transition-colors hover:bg-char hover:text-yolk sm:flex"
          >
            <UserIcon className="h-4 w-4" />
            {user ? "Mi cuenta" : "Ingresar"}
          </Link>

          <button
            onClick={toggle}
            aria-label="Abrir carrito"
            className="lift hard-sm relative flex h-10 w-10 items-center justify-center rounded-md border-[3px] border-char bg-paper text-char"
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
                  className="absolute -right-2.5 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-char bg-ketchup px-1 text-xs font-bold text-yolk"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Botón hamburguesa: solo visible por debajo de md */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md border-[3px] border-char text-char md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Panel del menú móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t-[3px] border-char bg-yolk md:hidden"
          >
            <nav className="flex flex-col px-5 py-2 sm:px-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b-2 border-char/25 py-4 font-poster text-2xl uppercase tracking-tight text-char"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="border-b-2 border-char/25 py-4 font-poster text-2xl uppercase tracking-tight text-char"
              >
                {user ? "Mi cuenta" : "Ingresar"}
              </Link>
              <Link
                href="/#menu"
                onClick={() => setMobileOpen(false)}
                className="hard-red my-4 rounded-md border-[3px] border-char bg-char py-3 text-center font-bold text-yolk"
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