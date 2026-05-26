// src/lib/supabase/middleware.ts
// Used inside Next.js middleware to refresh sessions
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Basic validation to prevent crash if env vars are missing/placeholders
  if (!supabaseUrl || !supabaseUrl.startsWith("http") || !supabaseAnonKey) {
    console.error("Missing or invalid Supabase environment variables");
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — MUST await getUser() before any redirects
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // --- Route protection logic ---
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/auth");

  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isProtectedRoute = isDashboardRoute || isAdminRoute || isOnboardingRoute;

  // 1. Unauthenticated user hitting protected route → login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Authenticated user handling
  if (user) {
    // Fetch profile to check role and existence
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const profile = profileData as { role: string } | null;

    // A. Profile doesn't exist → Force Onboarding (unless already there or on auth callback)
    if (!profile && !isOnboardingRoute && !pathname.startsWith("/auth")) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      if (pathname !== "/") url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // B. Profile exists but user is on Onboarding → Redirect to Dashboard
    if (profile && isOnboardingRoute) {
      const url = request.nextUrl.clone();
      url.pathname = profile.role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }

    // C. Authenticated user hitting auth pages → appropriate dashboard
    if (isAuthPage && request.method === "GET") {
      const url = request.nextUrl.clone();
      url.pathname = profile?.role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(url);
    }

    // D. Admin route protection
    if (isAdminRoute && profile?.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
