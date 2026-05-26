"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validations/auth";

export type OnboardingActionResult = { error?: string };

function getSafeRedirect(path: string | null): string {
  if (path && path.startsWith("/")) return path;
  return "/dashboard";
}

export async function completeOnboardingAction(
  formData: FormData
): Promise<OnboardingActionResult> {
  const raw = {
    full_name: formData.get("full_name") as string,
    roll_no: formData.get("roll_no") as string,
    branch_code: formData.get("branch_code") as string,
    semester: Number(formData.get("semester")),
    year: Number(formData.get("year")),
  };

  const nextPath = getSafeRedirect((formData.get("next") as string) ?? null);

  const result = onboardingSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!user.email) {
    return { error: "Email missing from provider. Please contact support." };
  }

  const { data: existingProfile } = (await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle()) as { data: { id: string } | null };

  if (existingProfile) {
    redirect(nextPath);
  }

  const { data: rollMatch } = (await supabase
    .from("profiles")
    .select("id")
    .eq("roll_no", result.data.roll_no.toLowerCase())
    .maybeSingle()) as { data: { id: string } | null };

  if (rollMatch && rollMatch.id !== user.id) {
    return {
      error:
        "This roll number is already registered. Please contact admin if this is an error.",
    };
  }

  const { error } = await supabase.from("profiles").insert([
    {
      id: user.id,
      full_name: result.data.full_name.trim(),
      email: user.email,
      roll_no: result.data.roll_no.toLowerCase(),
      branch_code: result.data.branch_code.toLowerCase(),
      semester: result.data.semester,
      year: result.data.year,
      role: "STUDENT",
    },
  ] as any);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");

  redirect(nextPath);
}
