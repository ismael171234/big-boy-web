"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, User as UserIcon } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useSession } from "@/lib/use-session";

const NAV_LINKS = [
  { href: "#menu", label: "Carta" },
  { href: "#promociones", label: "Promociones" },
  { href: "#reservas", label: "Reservas" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { lines, toggle } = useCartStore();
  const { user } = useSession();
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
        </div>
      </div>
    </header>
  );
}