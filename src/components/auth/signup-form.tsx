"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, GraduationCap, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signUpAction } from "@/app/auth/actions";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import {
  BRANCH_MAP,
  VALID_BRANCH_CODES,
  getValidAdmissionYears,
} from "@/lib/roll-validation";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const admissionYears = getValidAdmissionYears();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      semester: 1,
    },
  });

  async function onSubmit(data: SignupFormData) {
    startTransition(async () => {
      const formData = new FormData();
      (Object.entries(data) as [string, string | number][]).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const result = await signUpAction(formData);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        setIsSuccess(true);
      }
    });
  }

  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <div className="flex justify-center mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 border border-green-200">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Check your email
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We sent a verification link to your email address. Click the link to
            activate your account before signing in.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">CampusCore</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Join your college&apos;s academic hub
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Arjun Sharma"
              autoComplete="name"
              disabled={isPending}
              aria-invalid={!!errors.full_name}
              {...register("full_name")}
            />
            {errors.full_name && (
              <p className="text-xs text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">College Email</Label>
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

          {/* Roll Number */}
          <div className="space-y-1.5">
            <Label htmlFor="roll_no">Roll Number</Label>
            <Input
              id="roll_no"
              type="text"
              placeholder="25cs003496"
              maxLength={10}
              disabled={isPending}
              aria-invalid={!!errors.roll_no}
              className="font-mono tracking-wider"
              {...register("roll_no")}
            />
            <p className="text-xs text-muted-foreground">
              Format: YY + branch code + 6 digits (e.g., 25cs003496)
            </p>
            {errors.roll_no && (
              <p className="text-xs text-destructive">{errors.roll_no.message}</p>
            )}
          </div>

          {/* Branch + Year — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="branch_code">Branch</Label>
              <Select
                onValueChange={(val) => setValue("branch_code", (val ?? "") as string)}
                disabled={isPending}
              >
                <SelectTrigger id="branch_code" aria-invalid={!!errors.branch_code}>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {VALID_BRANCH_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code.toUpperCase()} — {BRANCH_MAP[code].split(" ").slice(0, 2).join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch_code && (
                <p className="text-xs text-destructive">{errors.branch_code.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="year">Admission Year</Label>
              <Select
                onValueChange={(val) => setValue("year", Number(val ?? 0))}
                disabled={isPending}
              >
                <SelectTrigger id="year" aria-invalid={!!errors.year}>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {admissionYears.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.year && (
                <p className="text-xs text-destructive">{errors.year.message}</p>
              )}
            </div>
          </div>

          {/* Semester */}
          <div className="space-y-1.5">
            <Label htmlFor="semester">Current Semester</Label>
            <Select
              onValueChange={(val) => setValue("semester", Number(val ?? 1))}
              defaultValue="1"
              disabled={isPending}
            >
              <SelectTrigger id="semester" aria-invalid={!!errors.semester}>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                  <SelectItem key={sem} value={String(sem)}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.semester && (
              <p className="text-xs text-destructive">{errors.semester.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 chars, upper, lower, number"
                autoComplete="new-password"
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isPending}
                aria-invalid={!!errors.confirm_password}
                className="pr-10"
                {...register("confirm_password")}
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
