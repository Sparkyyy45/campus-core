"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GraduationCap, Loader2 } from "lucide-react";
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
import {
  BRANCH_MAP,
  VALID_BRANCH_CODES,
  getValidAdmissionYears,
} from "@/lib/roll-validation";
import {
  onboardingSchema,
  type OnboardingFormData,
} from "@/lib/validations/auth";
import { completeOnboardingAction } from "./actions";

export function OnboardingClient({
  defaultName,
  email,
  nextPath,
}: {
  defaultName: string;
  email: string;
  nextPath: string;
}) {
  const [isPending, startTransition] = useTransition();
  const admissionYears = getValidAdmissionYears();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: defaultName,
      semester: 1,
    },
  });

  async function onSubmit(data: OnboardingFormData) {
    startTransition(async () => {
      const formData = new FormData();
      (Object.entries(data) as [string, string | number][]).forEach(
        ([key, value]) => {
          formData.append(key, String(value));
        }
      );
      formData.append("next", nextPath);

      const result = await completeOnboardingAction(formData);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="flex items-center justify-center gap-2.5 mb-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">CampusCore</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Complete your profile
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We need a few academic details to personalize your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <p className="text-xs text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              disabled
            />
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="branch_code">Branch</Label>
              <Select
                onValueChange={(val) =>
                  setValue("branch_code", (val ?? "") as string)
                }
                disabled={isPending}
              >
                <SelectTrigger
                  id="branch_code"
                  aria-invalid={!!errors.branch_code}
                >
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {VALID_BRANCH_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code.toUpperCase()} —{" "}
                      {BRANCH_MAP[code].split(" ").slice(0, 2).join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branch_code && (
                <p className="text-xs text-destructive">
                  {errors.branch_code.message}
                </p>
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
              <p className="text-xs text-destructive">
                {errors.semester.message}
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
                Saving...
              </>
            ) : (
              "Finish setup"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
