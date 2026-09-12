export function Footer() {
  return (
    <footer className="bg-char-2 py-10 text-bone-dim">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-display text-2xl tracking-wide text-bone">
          BURGER<span className="text-amber-light">HOUSE</span>
        </p>
        <p className="text-sm">
          © {new Date().getFullYear()} Burger House. Hecho con fuego, queso y buen pan.
        </p>
      </div>
    </footer>
  );
}
