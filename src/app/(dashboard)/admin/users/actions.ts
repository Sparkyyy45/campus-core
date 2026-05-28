"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/supabase/admin";

export type UserActionResult = { error?: string; success?: string };

export async function updateUserRoleAction(
  userId: string,
  newRole: "STUDENT" | "ADMIN"
): Promise<UserActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  // Check for self-demotion of the sole system administrator
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && user.id === userId && newRole === "STUDENT") {
    const db = supabase as any;
    const { count } = await db
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "ADMIN");

    if (count !== null && count <= 1) {
      return {
        error:
          "You cannot demote yourself. You are the only Admin in the system.",
      };
    }
  }

  const { error } = await (supabase as any)
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: `User role updated to ${newRole}.` };
}
