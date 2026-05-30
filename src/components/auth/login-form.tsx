"use client";

import { useState, useTransition, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/auth/actions";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

function LoginContent() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const message = searchParams.get("message");
  const errorParam = searchParams.get("error");
  const errorDetails = searchParams.get("details");

  useEffect(() => {
    // Handle Supabase hash fragment errors (e.g. #error=access_denied&error_code=otp_expired)
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorCode = hashParams.get("error_code");
      const hashError =
        hashParams.get("error_description") || hashParams.get("error");

      if (errorCode === "otp_expired") {
        // Clean up the URL to prevent showing the error again on back navigation
        window.history.replaceState(null, "", window.location.pathname);
        // Redirect to forgot password with a custom message query param
        window.location.href = "/forgot-password?error=expired_scanner";
        return;
      }

      if (hashError) {
        toast.error(hashError.replace(/\+/g, " "));
        // Clean up the URL to prevent showing the error again on refresh
        window.history.replaceState(null, "", window.location.pathname);
      }
    } else if (errorParam) {
      toast.error(errorDetails || "Authentication failed. Please try again.");
    }
  }, [errorParam, errorDetails]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await loginAction(formData);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 mb-8 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl font-black tracking-tighter text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
            CampusCore
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to access your academic resources
          </p>
        </div>

        {/* Success message (e.g., after password reset) */}
        {message === "password-reset-success" && (
          <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
            Password updated successfully. Please sign in with your new
            password.
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@college.edu"
              autoComplete="email"
              disabled={isPending}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
                tabIndex={-1}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isPending}
                aria-invalid={!!errors.password}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-semibold mt-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </Link>
        </p>

        {/* Developer Credit Signature */}
        <div className="mt-8 pt-4 border-t border-border/40 text-center select-none">
          <p className="text-[10px] font-mono tracking-widest text-muted-foreground/60 uppercase">
            Designed & built by
          </p>
          <p className="text-xs font-semibold text-foreground mt-0.5 tracking-wide">
            Suyash Yadav
          </p>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="auth-container">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
