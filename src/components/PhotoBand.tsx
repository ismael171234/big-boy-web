import Image from "next/image";

// Foto a todo el ancho con una frase grande encima.
export function PhotoBand() {
  return (
    <section className="relative isolate h-[62vh] min-h-[380px] overflow-hidden bg-char">
      <Image
        src="/imagenes/imagen1carrusel.jpeg"
        alt="Hamburguesa doble con queso, tocino y papas fritas"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-char/90 via-char/25 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-10 sm:px-8 sm:pb-14">
        <p className="font-poster text-[clamp(2.4rem,8.5vw,6.5rem)] uppercase leading-[0.9] tracking-[-0.02em] text-yolk">
          Así sale
          <br />
          de la parrilla.
        </p>
      </div>
    </section>
  );
}