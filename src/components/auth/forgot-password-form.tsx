"use client";

import { useTransition, useState, Suspense } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Loader2, ArrowLeft, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "@/app/auth/actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { useSearchParams } from "next/navigation";

function ForgotPasswordContent() {
  const [isPending, startTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  function onSubmit(data: ForgotPasswordFormData) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      const result = await forgotPasswordAction(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setEmailSent(true);
      }
    });
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">CampusCore</span>
        </div>

        {emailSent ? (
          <div className="text-center">
            <div className="flex justify-center mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                <Mail className="h-7 w-7 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We&apos;ve sent a password reset link to your email. The link
              expires in 1 hour.
            </p>
            <Link
              href="/login"
              className={cn(
                "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Reset your password
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>
            
            {errorParam === "expired_scanner" && (
              <div className="mb-6 relative w-full rounded-lg border border-red-200 bg-red-50/50 p-4 text-red-800 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-red-800">
                <AlertCircle className="h-4 w-4" />
                <h5 className="mb-1 font-medium leading-none tracking-tight pl-7">Link Expired</h5>
                <div className="text-xs mt-1 leading-relaxed pl-7">
                  The link you clicked was already used. This often happens if an <b>Email Scanner</b> (like Outlook Safe Links) clicks the link before you do.
                  <br className="mb-2" />
                  <b>To fix this:</b> Request a new link below, then <b>Right-Click {"->"} Copy Link Address</b> in your email and paste it directly into your browser.
                </div>
              </div>
            )}

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
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-semibold"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <Link
              href="/login"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export function ForgotPasswordForm() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
