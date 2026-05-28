"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { subjectSchema } from "@/lib/validations/admin";

export type SubjectActionResult = { error?: string; success?: string };

function adminGuard(role: string | undefined): boolean {
  return role === "ADMIN";
}

export async function createSubjectAction(
  formData: FormData
): Promise<SubjectActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: { role: string } | null; error: unknown };
  if (!adminGuard(profile?.role)) return { error: "Unauthorized" };

  const nameInput = (formData.get("name") as string)?.trim();
  const branch_code = (formData.get("branch_code") as string)
    ?.trim()
    .toLowerCase();
  const semester = Number(formData.get("semester"));

  const stripHtml = (str: string) => str.replace(/<[^>]*>/g, "");

  const validated = subjectSchema.safeParse({
    name: nameInput ? stripHtml(nameInput) : "",
    branch_code,
    semester,
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const data = validated.data;

  const { error } = await (supabase as any).from("subjects").insert({
    name: data.name,
    branch_code: data.branch_code,
    semester: data.semester,
  });
  if (error) {
    if (error.code === "23505")
      return { error: "Subject already exists for this branch/semester." };
    return { error: error.message };
  }

  revalidateTag("subjects", "max");
  revalidatePath("/admin/subjects");
  return { success: "Subject created." };
}

export async function deleteSubjectAction(
  id: string
): Promise<SubjectActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: { role: string } | null; error: unknown };
  if (!adminGuard(profile?.role)) return { error: "Unauthorized" };

  const { error } = await (supabase as any)
    .from("subjects")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };

  revalidateTag("subjects", "max");
  revalidatePath("/admin/subjects");
  return { success: "Subject deleted." };
}
