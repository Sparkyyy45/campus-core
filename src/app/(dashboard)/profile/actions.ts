// src/app/(dashboard)/profile/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updateProfileName(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  if (!fullName || fullName.trim() === "") {
    return { error: "Name is required" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

export async function deleteAccountAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const db = supabase as any;
  const { data: profile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "ADMIN") {
    // Prevent deleting the last admin to secure the system
    const { count } = await db
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "ADMIN");

    if (count !== null && count <= 1) {
      return {
        error: "You cannot delete your account: you are the only Admin.",
      };
    }
  }

  // Initialize administrative client using server-only service role key
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Delete the user from auth.users (cascades deletion across profiles, logs, and tokens in PostgreSQL)
  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Account deletion error:", error);
    return { error: `Failed to delete account: ${error.message}` };
  }

  // Sign out the current user session cookies
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  return { success: true };
}
