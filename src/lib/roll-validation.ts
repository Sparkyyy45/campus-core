// src/lib/roll-validation.ts
// Roll number format: YY + 2 uppercase letters (branch code) + 6 digits
// Example: 25cs003496 → Year=2025, Branch=CS

/**
 * Branch code → display name mapping.
 * Admin-configurable in a real system; kept as a config file for MVP.
 */
export const BRANCH_MAP: Record<string, string> = {
  cs: "Computer Science & Engineering",
  it: "Information Technology",
  ec: "Electronics & Communication Engineering",
  ee: "Electrical Engineering",
  me: "Mechanical Engineering",
  ce: "Civil Engineering",
  ch: "Chemical Engineering",
  bt: "Biotechnology",
};

export type BranchCode = keyof typeof BRANCH_MAP;

// All valid branch codes (lowercase)
export const VALID_BRANCH_CODES = Object.keys(BRANCH_MAP) as BranchCode[];

/**
 * Parses a roll number into its components.
 * Returns null if the format is invalid.
 */
export function parseRollNumber(rollNo: string): {
  year: number;
  branchCode: string;
  digits: string;
} | null {
  // Must match: exactly 2 digits + 2 letters + 6 digits = 10 chars total
  const match = rollNo.toLowerCase().match(/^(\d{2})([a-z]{2})(\d{6})$/);
  if (!match) return null;

  const [, yyStr, branchCode, digits] = match;
  const year = 2000 + parseInt(yyStr, 10);

  return { year, branchCode, digits };
}

/**
 * Validates that a roll number is syntactically correct AND matches
 * the student's selected branch and year.
 */
export function validateRollNumber(
  rollNo: string,
  selectedBranchCode: string,
  selectedYear: number
): { valid: boolean; error?: string } {
  const parsed = parseRollNumber(rollNo);

  if (!parsed) {
    return {
      valid: false,
      error:
        "Invalid roll number format. Expected format: 25cs003496 (YY + 2-letter branch code + 6 digits)",
    };
  }

  const { year, branchCode } = parsed;

  // Validate branch code exists in our mapping
  if (!BRANCH_MAP[branchCode]) {
    return {
      valid: false,
      error: `Unknown branch code "${branchCode.toUpperCase()}" in roll number.`,
    };
  }

  // Validate year matches
  if (year !== selectedYear) {
    return {
      valid: false,
      error: `Roll number indicates admission year ${year}, but you selected ${selectedYear}.`,
    };
  }

  // Validate branch code matches selected branch
  if (branchCode !== selectedBranchCode.toLowerCase()) {
    return {
      valid: false,
      error: `Roll number indicates branch "${BRANCH_MAP[branchCode]}", but you selected "${BRANCH_MAP[selectedBranchCode.toLowerCase()] ?? selectedBranchCode}".`,
    };
  }

  return { valid: true };
}

/**
 * Returns the current and past valid admission years for signup dropdowns.
 * Goes back 5 years from current year.
 */
export function getValidAdmissionYears(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear - i);
}
