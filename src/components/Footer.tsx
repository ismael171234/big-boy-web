import Link from "next/link";
import { Flame, MessageCircle } from "lucide-react";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999999999";

const EXPLORE = [
  { href: "/#menu", label: "Carta" },
  { href: "/#promociones", label: "Promociones" },
  { href: "/#reservas", label: "Reservas" },
];

const ACCOUNT = [
  { href: "/login", label: "Ingresar" },
  { href: "/register", label: "Crear cuenta" },
  { href: "/account", label: "Mi cuenta" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-char-2 text-bone-dim">
      {/* Línea de acento */}
      <div className="h-1 w-full bg-gradient-to-r from-brick via-amber to-amber-light" />

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl tracking-wide text-bone">
            BIG BOY <span className="text-amber-light">BURGERS</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6">
            Hamburguesas a la parrilla, hechas con fuego, queso y buen pan.
            Arma tu combo y pídelo en minutos.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition hover:bg-[#20bd5a]"
          >
            <MessageCircle className="h-4 w-4" />
            Escríbenos por WhatsApp
          </a>
        </div>

        <FooterColumn title="Explorar" links={EXPLORE} />
        <FooterColumn title="Tu cuenta" links={ACCOUNT} />

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-bone">Contacto</p>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-amber-light"
              >
                WhatsApp: +{WHATSAPP}
              </a>
            </li>
            <li>Pedidos en línea y reservas</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Big Boy Burgers. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Hecho con <Flame className="h-3.5 w-3.5 text-amber-light" /> fuego, queso y buen pan
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-bone">{title}</p>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition-colors hover:text-amber-light">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}