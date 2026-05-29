// src/lib/validations/admin.ts
import { z } from "zod";
import { VALID_BRANCH_CODES } from "@/lib/roll-validation";

// Branch code check
const branchCodeSchema = z
  .string()
  .toLowerCase()
  .refine((val) => (VALID_BRANCH_CODES as readonly string[]).includes(val), {
    message: "Invalid branch code selected.",
  });

// Semester check
const semesterSchema = z
  .number()
  .int()
  .min(1, "Semester must be between 1 and 8.")
  .max(8, "Semester must be between 1 and 8.");

// Announcement schema
export const announcementSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(150, "Title cannot exceed 150 characters.")
    .trim(),
  content: z
    .string()
    .min(5, "Content must be at least 5 characters.")
    .max(5000, "Content cannot exceed 5000 characters.")
    .trim(),
  is_pinned: z.boolean().default(false),
});

// Resource schema
export const resourceSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(150, "Title cannot exceed 150 characters.")
    .trim(),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters.")
    .trim()
    .nullable()
    .optional(),
  subject_id: z.string().uuid("Invalid subject ID format."),
  resource_type_id: z.string().uuid("Invalid resource type ID format."),
  branch_code: branchCodeSchema,
  semester: semesterSchema,
  cloudinary_public_id: z.string().optional(),
  cloudinary_url: z
    .string()
    .url("Document link must be a valid URL (e.g. Google Drive link)."),
  file_size_bytes: z.number().int().nonnegative().nullable().optional(),
  exam_year: z
    .number()
    .int()
    .min(2000, "Exam year must be 2000 or later.")
    .max(new Date().getFullYear() + 1, "Invalid exam year.")
    .nullable()
    .optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
});

// Subject schema
export const subjectSchema = z.object({
  name: z
    .string()
    .min(2, "Subject name must be at least 2 characters.")
    .max(150, "Subject name cannot exceed 150 characters.")
    .trim(),
  branch_code: branchCodeSchema,
  semester: semesterSchema,
});

// Roadmap schema
export const roadmapSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(150, "Title cannot exceed 150 characters.")
    .trim(),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters.")
    .trim()
    .nullable()
    .optional(),
  branch_code: branchCodeSchema,
  semester: semesterSchema,
  order_idx: z.number().int().nonnegative("Order index cannot be negative."),
});
