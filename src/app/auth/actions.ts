"use server";

// src/app/auth/actions.ts
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { getAppUrl } from "@/lib/url";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export type ActionResult = {
  error?: string;
  success?: string;
};

// ─── SIGN UP ────────────────────────────────────────────────────────────────

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
    roll_no: formData.get("roll_no") as string,
    branch_code: formData.get("branch_code") as string,
    semester: Number(formData.get("semester")),
    year: Number(formData.get("year")),
  };

  const result = signupSchema.safeParse(raw);
  if (!result.success) {
    const firstError = result.error.issues[0];
    return { error: firstError.message };
  }

  const { full_name, email, password, roll_no, branch_code, semester, year } =
    result.data;

  const supabase = await createClient();

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("roll_no", roll_no.toLowerCase())
    .single();

  if (existingProfile) {
    return {
      error:
        "This roll number is already registered. Please contact admin if this is an error.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        roll_no: roll_no.toLowerCase(),
        branch_code: branch_code.toLowerCase(),
        semester,
        year,
      },
      emailRedirectTo: `${getAppUrl()}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Failed to create account. Please try again." };
  }

  return {
    success:
      "Account created! Please check your email to verify your account before logging in.",
  };
}

// ─── LOG IN ──────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  // Enforce IP-based rate limiting (Max 5 attempts per minute per IP)
  const limitRes = rateLimit(`login:${ip}`, 5, 60000);
  if (!limitRes.success) {
    logger.warn("Login attempt rate limited", { ip });
    return {
      error: `Too many login attempts. Please try again in ${limitRes.reset} seconds.`,
    };
  }

  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return {
      error:
        "Invalid email or password. Please check your credentials and ensure your email is verified.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = (await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()) as { data: { role: string } | null; error: unknown };

    revalidatePath("/", "layout");
    if (profile?.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// ─── LOG OUT ─────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────

export async function forgotPasswordAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = { email: formData.get("email") as string };
  const result = forgotPasswordSchema.safeParse(raw);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    result.data.email,
    {
      redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
    }
  );

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "Password reset email sent. Please check your inbox (and spam folder).",
  };
}

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────

export async function resetPasswordAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    password: formData.get("password") as string,
    confirm_password: formData.get("confirm_password") as string,
  };

  const result = resetPasswordSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login?message=password-reset-success");
}
