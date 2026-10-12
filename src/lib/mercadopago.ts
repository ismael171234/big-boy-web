import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.warn(
    "MERCADOPAGO_ACCESS_TOKEN no esta configurado. La pasarela de pagos no funcionara hasta que lo agregues a tu .env.local (y en Vercel)."
  );
}

const client = new MercadoPagoConfig({
  accessToken: accessToken ?? "",
});

export const mpPreference = new Preference(client);
export const mpPayment = new Payment(client);