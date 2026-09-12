"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autenticado." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const avatarFile = formData.get("avatar") as File | null;

  const updates: { full_name?: string; avatar_url?: string } = {};

  if (fullName) {
    updates.full_name = fullName;
  }

  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true });

    if (uploadError) {
      return { error: "No se pudo subir la foto: " + uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
    updates.avatar_url = `${publicUrlData.publicUrl}?t=${Date.now()}`;
  }

  if (Object.keys(updates).length === 0) {
    return { error: "No hay cambios para guardar." };
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/account");
  return { success: true };
}