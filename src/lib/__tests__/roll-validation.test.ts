import { describe, it, expect } from "vitest";
import {
  parseRollNumber,
  validateRollNumber,
  getValidAdmissionYears,
} from "../roll-validation";

describe("roll-validation", () => {
  describe("parseRollNumber", () => {
    it("should correctly parse a valid roll number", () => {
      const parsed = parseRollNumber("25cs003496");
      expect(parsed).not.toBeNull();
      expect(parsed).toEqual({
        year: 2025,
        branchCode: "cs",
        digits: "003496",
      });
    });

    it("should normalize uppercase inputs", () => {
      const parsed = parseRollNumber("23IT001234");
      expect(parsed).not.toBeNull();
      expect(parsed).toEqual({
        year: 2023,
        branchCode: "it",
        digits: "001234",
      });
    });

    it("should return null for malformed roll numbers", () => {
      expect(parseRollNumber("25cs000")).toBeNull(); // short digits
      expect(parseRollNumber("25css001234")).toBeNull(); // long branch
      expect(parseRollNumber("abcs001234")).toBeNull(); // non-numeric year
      expect(parseRollNumber("25cs00123a")).toBeNull(); // non-numeric digits
    });
  });

  describe("validateRollNumber", () => {
    it("should validate a correct roll number against branch and year", () => {
      const result = validateRollNumber("25cs003496", "cs", 2025);
      expect(result.valid).toBe(true);
    });

    it("should reject an unknown branch code", () => {
      const result = validateRollNumber("25xx001234", "xx", 2025);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Unknown branch code");
    });

    it("should reject when admission year mismatches", () => {
      const result = validateRollNumber("25cs003496", "cs", 2024);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("admission year");
    });

    it("should reject when branch mismatches", () => {
      const result = validateRollNumber("25cs003496", "it", 2025);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("indicates branch");
    });
  });

  describe("getValidAdmissionYears", () => {
    it("should return an array of 6 admission years", () => {
      const years = getValidAdmissionYears();
      expect(years).toBeInstanceOf(Array);
      expect(years).toHaveLength(6);
      expect(years[0]).toBe(new Date().getFullYear());
    });
  });
});
