"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UserActionResult = { error?: string; success?: string };

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase: null };
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single() as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") return { supabase: null };
  return { supabase };
}

export async function updateUserRoleAction(userId: string, newRole: "STUDENT" | "ADMIN"): Promise<UserActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const { error } = await (supabase as any).from("profiles").update({ role: newRole }).eq("id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: `User role updated to ${newRole}.` };
}
