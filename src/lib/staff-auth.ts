import { cookies } from "next/headers";
import crypto from "crypto";

export type StaffRole = "kitchen" | "admin";

const SECRET = process.env.STAFF_SESSION_SECRET ?? "dev-secret-cambiar-en-produccion";
const COOKIE_NAME = "staff_session";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 horas

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

function createStaffToken(role: StaffRole) {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${role}.${expires}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export async function setStaffCookie(role: StaffRole) {
  const store = await cookies();
  store.set(COOKIE_NAME, createStaffToken(role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearStaffCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

// Lee la cookie firmada y devuelve el rol si es valida y no vencio.
// No usa cuentas de Supabase: es una clave compartida simple, pensada para
// que la use el personal del local desde una tablet/PC compartida.
export async function getStaffRole(): Promise<StaffRole | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [role, expiresStr, signature] = parts;
  const payload = `${role}.${expiresStr}`;
  if (sign(payload) !== signature) return null;

  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return null;

  if (role !== "kitchen" && role !== "admin") return null;
  return role;
}

export function verifyCredentials(role: StaffRole, email: string, password: string) {
  const expectedEmail =
    role === "kitchen" ? process.env.KITCHEN_EMAIL : process.env.ADMIN_EMAIL;
  const expectedPassword =
    role === "kitchen" ? process.env.KITCHEN_PASSWORD : process.env.ADMIN_PASSWORD;
    console.log(
  "DEBUG login:",
  JSON.stringify({ role, email, password, expectedEmail, expectedPassword })
);
  if (!expectedEmail || !expectedPassword) return false;
  console.log("DEBUG login:", {
  role,
  emailRecibido: email,
  emailEsperado: expectedEmail,
  passwordRecibida: password,
  passwordEsperada: expectedPassword,
});

  return (
    email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
    password === expectedPassword
  );
}