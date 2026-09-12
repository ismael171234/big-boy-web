"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { resend } from "@/lib/resend";
import { welcomeEmailHtml } from "@/lib/emails/welcome-email";

export type AuthFormState = {
  error?: string;
  success?: boolean;
};

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!email || !password || !fullName) {
    return { error: "Completa nombre, correo y contraseña." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  try {
    await resend.emails.send({
      from: "BurgerHouse <onboarding@resend.dev>",
      to: email,
      subject: "¡Tu cuenta en BurgerHouse fue creada!",
      html: welcomeEmailHtml(fullName),
    });
  } catch (emailError) {
    console.error("Error enviando correo de bienvenida:", emailError);
    // No bloqueamos el registro si el correo falla
  }

  return { success: true };
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  redirect("/account");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}