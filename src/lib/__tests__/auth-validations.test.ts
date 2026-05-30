import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth";

describe("auth-validations", () => {
  describe("loginSchema", () => {
    it("should pass with a valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "student@university.edu",
        password: "Password123",
      });
      expect(result.success).toBe(true);
    });

    it("should fail with an invalid email address", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "Password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("valid email");
      }
    });

    it("should fail with a short password", () => {
      const result = loginSchema.safeParse({
        email: "student@university.edu",
        password: "short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "at least 8 characters"
        );
      }
    });
  });

  describe("signupSchema", () => {
    const validBase = {
      full_name: "Sir Padampat Singhania",
      email: "singhania@university.edu",
      password: "Password123",
      confirm_password: "Password123",
      roll_no: "25cs003496",
      branch_code: "cs",
      semester: 1,
      year: 2025,
    };

    it("should pass with a perfectly valid dataset", () => {
      const result = signupSchema.safeParse(validBase);
      expect(result.success).toBe(true);
    });

    it("should fail if passwords do not match", () => {
      const result = signupSchema.safeParse({
        ...validBase,
        confirm_password: "DifferentPassword1",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("do not match");
      }
    });

    it("should fail if password does not meet complexity requirements", () => {
      const result = signupSchema.safeParse({
        ...validBase,
        password: "plainpassword",
        confirm_password: "plainpassword",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "uppercase letter, one lowercase letter, and one number"
        );
      }
    });

    it("should fail if roll number mismatches branch and year", () => {
      const result = signupSchema.safeParse({
        ...validBase,
        roll_no: "25cs003496",
        branch_code: "it", // mismatched branch!
      });
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("should validate emails correctly", () => {
      expect(
        forgotPasswordSchema.safeParse({ email: "test@university.edu" }).success
      ).toBe(true);
      expect(
        forgotPasswordSchema.safeParse({ email: "invalid-email" }).success
      ).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("should require matching complex passwords", () => {
      expect(
        resetPasswordSchema.safeParse({
          password: "ComplexPassword123",
          confirm_password: "ComplexPassword123",
        }).success
      ).toBe(true);
      expect(
        resetPasswordSchema.safeParse({
          password: "ComplexPassword123",
          confirm_password: "mismatch",
        }).success
      ).toBe(false);
    });
  });
});
