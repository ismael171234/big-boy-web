export function welcomeEmailHtml(fullName: string) {
  const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/imagenes/logo_bigboy.png`;

  return `
  <div style="font-family: Arial, sans-serif; background-color: #1a1512; padding: 40px 20px; text-align: center;">
    <img src="${logoUrl}" alt="BurgerHouse" style="max-width: 160px; margin-bottom: 24px;" />
    <h1 style="color: #f5c453; font-size: 24px; margin-bottom: 8px;">
      ¡Bienvenido, ${fullName}!
    </h1>
    <p style="color: #e8e2d8; font-size: 15px; line-height: 1.5; max-width: 420px; margin: 0 auto 24px;">
      Tu cuenta en BurgerHouse ha sido creada con éxito. Ya puedes armar tu combo, reservar tu mesa o pedir para llevar en minutos.
    </p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}"
       style="display: inline-block; background-color: #b3402c; color: #f5f1e8; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: bold; font-size: 14px;">
      Ver la carta
    </a>
  </div>
  `;
}