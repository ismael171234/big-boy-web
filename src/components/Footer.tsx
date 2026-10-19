import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999999999";

const EXPLORE = [
  { href: "/#menu", label: "Carta" },
  { href: "/#promociones", label: "Favoritos" },
  { href: "/#reservas", label: "Reservas" },
];

const ACCOUNT = [
  { href: "/login", label: "Ingresar" },
  { href: "/register", label: "Crear cuenta" },
  { href: "/account", label: "Mi cuenta" },
];

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden border-t-[6px] border-char bg-yolk text-char">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="max-w-xs text-base font-medium leading-7">
            Hamburguesas a la parrilla, con buen pan y mucho queso. Arma tu combo y pídelo en
            minutos.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="lift hard-sm mt-5 inline-flex items-center gap-2 rounded-md border-[3px] border-char bg-[#25D366] px-5 py-2.5 text-sm font-bold text-char"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
            Escríbenos por WhatsApp
          </a>
        </div>

        <FooterColumn title="Explorar" links={EXPLORE} />
        <FooterColumn title="Tu cuenta" links={ACCOUNT} />

        <div>
          <p className="mb-3 font-poster text-lg uppercase tracking-tight">Contacto</p>
          <ul className="space-y-2 text-sm font-semibold">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-2 underline-offset-4 hover:text-brick"
              >
                WhatsApp +{WHATSAPP}
              </a>
            </li>
            <li>Pedidos en línea y reservas</li>
          </ul>
        </div>
      </div>

      {/* Nombre gigante, recortado por abajo */}
      <p
        aria-hidden
        className="mt-10 select-none whitespace-nowrap text-center font-poster text-[clamp(4.5rem,21vw,19rem)] uppercase leading-[0.78] tracking-[-0.04em]"
      >
        Big Boy
      </p>

      <div className="relative z-10 border-t-[3px] border-char bg-char text-bone/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 px-5 py-4 text-xs sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Big Boy Burgers. Todos los derechos reservados.</p>
          <p>Hecho con fuego, queso y buen pan.</p>
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
      <p className="mb-3 font-poster text-lg uppercase tracking-tight">{title}</p>
      <ul className="space-y-2 text-sm font-semibold">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-char"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}