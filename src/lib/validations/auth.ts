// src/lib/validations/auth.ts
import { z } from "zod";
import { VALID_BRANCH_CODES, validateRollNumber } from "@/lib/roll-validation";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name is too long."),
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number."
      ),
    confirm_password: z.string(),
    roll_no: z
      .string()
      .min(10, "Roll number must be 10 characters.")
      .max(10, "Roll number must be 10 characters.")
      .toLowerCase(),
    branch_code: z.string().refine(
      (val) => (VALID_BRANCH_CODES as readonly string[]).includes(val.toLowerCase()),
      { message: "Please select a valid branch." }
    ),
    semester: z
      .number()
      .int()
      .min(1, "Semester must be between 1 and 8.")
      .max(8, "Semester must be between 1 and 8."),
    year: z.number().int().min(2000).max(new Date().getFullYear()),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  })
  .refine(
    (data) => {
      const result = validateRollNumber(data.roll_no, data.branch_code, data.year);
      return result.valid;
    },
    {
      message: "Roll number does not match the selected branch and year.",
      path: ["roll_no"],
    }
  );

export const onboardingSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name is too long."),
    roll_no: z
      .string()
      .min(10, "Roll number must be 10 characters.")
      .max(10, "Roll number must be 10 characters.")
      .toLowerCase(),
    branch_code: z.string().refine(
      (val) => (VALID_BRANCH_CODES as readonly string[]).includes(val.toLowerCase()),
      { message: "Please select a valid branch." }
    ),
    semester: z
      .number()
      .int()
      .min(1, "Semester must be between 1 and 8.")
      .max(8, "Semester must be between 1 and 8."),
    year: z.number().int().min(2000).max(new Date().getFullYear()),
  })
  .refine(
    (data) => {
      const result = validateRollNumber(data.roll_no, data.branch_code, data.year);
      return result.valid;
    },
    {
      message: "Roll number does not match the selected branch and year.",
      path: ["roll_no"],
    }
  );

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number."
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
