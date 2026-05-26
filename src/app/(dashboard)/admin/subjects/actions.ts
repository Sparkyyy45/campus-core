"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SubjectActionResult = { error?: string; success?: string };

function adminGuard(role: string | undefined): boolean {
  return role === "ADMIN";
}

export async function createSubjectAction(
  formData: FormData
): Promise<SubjectActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null; error: unknown };
  if (!adminGuard(profile?.role)) return { error: "Unauthorized" };

  const name = (formData.get("name") as string)?.trim();
  const branch_code = (formData.get("branch_code") as string)?.trim().toLowerCase();
  const semester = Number(formData.get("semester"));

  if (!name || !branch_code || !semester) return { error: "All fields are required." };
  if (semester < 1 || semester > 8) return { error: "Semester must be 1–8." };

  const { error } = await (supabase as any).from("subjects").insert({ name, branch_code, semester });
  if (error) {
    if (error.code === "23505") return { error: "Subject already exists for this branch/semester." };
    return { error: error.message };
  }

  revalidatePath("/admin/subjects");
  return { success: "Subject created." };
}

export async function deleteSubjectAction(id: string): Promise<SubjectActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null; error: unknown };
  if (!adminGuard(profile?.role)) return { error: "Unauthorized" };

  const { error } = await (supabase as any).from("subjects").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/subjects");
  return { success: "Subject deleted." };
}
