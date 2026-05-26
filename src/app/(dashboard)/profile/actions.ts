// src/app/(dashboard)/profile/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileName(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  if (!fullName || fullName.trim() === "") {
    return { error: "Name is required" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const db = supabase as any;
  const { error } = await db
    .from("profiles")
    .update({ full_name: fullName.trim() })
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to update profile" };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
