// src/app/auth/callback/route.ts
// Handles Supabase Auth email confirmation redirects and OAuth callbacks

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();
  let error = null;

  if (token_hash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });
    error = verifyError;
  } else if (code) {
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    error = sessionError;
  }

  if (code || (token_hash && type)) {
    if (!error) {
      // Ensure the profile exists (for OAuth users whose profile may not be auto-created)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingProfile) {
          // Google OAuth users — redirect to profile setup to collect roll/branch/semester
          const nextParam = encodeURIComponent(next);
          return NextResponse.redirect(`${origin}/onboarding?next=${nextParam}`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login with error if something went wrong
  const redirectUrl = new URL(`${origin}/login`);
  redirectUrl.searchParams.set("error", "auth_callback_failed");
  if (error) {
    redirectUrl.searchParams.set("details", error.message);
  }
  return NextResponse.redirect(redirectUrl.href);
}
