import { describe, it, expect } from "vitest";
import {
  announcementSchema,
  resourceSchema,
  subjectSchema,
  roadmapSchema,
} from "../validations/admin";

describe("admin-validations", () => {
  describe("announcementSchema", () => {
    it("should pass with a valid announcement", () => {
      const result = announcementSchema.safeParse({
        title: "Midterm Exams Notice",
        content:
          "Please check your schedule for midterm exams starting next Monday.",
        is_pinned: true,
      });
      expect(result.success).toBe(true);
    });

    it("should fail with an empty or too short title", () => {
      const result = announcementSchema.safeParse({
        title: "a",
        content: "Please check your schedule.",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "at least 2 characters"
        );
      }
    });

    it("should fail with too short content", () => {
      const result = announcementSchema.safeParse({
        title: "Midterm Exams Notice",
        content: "fail",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "at least 5 characters"
        );
      }
    });

    it("should support custom HTML stripping logic as used in actions", () => {
      const stripHtml = (str: string) => str.replace(/<[^>]*>/g, "");
      const taintedContent =
        "<script>alert('XSS')</script>Midterm Exams Notice";
      const sanitized = stripHtml(taintedContent);
      expect(sanitized).toBe("alert('XSS')Midterm Exams Notice");

      const result = announcementSchema.safeParse({
        title: stripHtml("<p>Exams</p>"),
        content: sanitized,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("resourceSchema", () => {
    const validResource = {
      title: "Algorithms Unit 1",
      description: "Introductory notes for algorithms module.",
      subject_id: "c87b8b40-3b4e-4f7f-a60d-96df9939a1a2",
      resource_type_id: "e57c6b90-1c4b-4f7f-a60d-96df9939b2b3",
      branch_code: "cs",
      semester: 3,
      cloudinary_public_id: "campuscore/resources/algo_notes",
      cloudinary_url:
        "https://res.cloudinary.com/dax3ewhm5/raw/upload/v123456/algo.pdf",
      file_size_bytes: 1048576,
      exam_year: 2025,
      status: "PUBLISHED",
    };

    it("should pass with a valid resource", () => {
      const result = resourceSchema.safeParse(validResource);
      expect(result.success).toBe(true);
    });

    it("should reject invalid UUIDs for subjects or resource types", () => {
      const result = resourceSchema.safeParse({
        ...validResource,
        subject_id: "not-a-uuid",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Invalid subject ID");
      }
    });

    it("should accept any valid URLs (like Google Drive)", () => {
      const gdriveResult = resourceSchema.safeParse({
        ...validResource,
        cloudinary_url: "https://drive.google.com/file/d/123/view?usp=sharing",
      });
      expect(gdriveResult.success).toBe(true);

      const arbitraryUrlResult = resourceSchema.safeParse({
        ...validResource,
        cloudinary_url: "https://example.com/some-document-path",
      });
      expect(arbitraryUrlResult.success).toBe(true);
    });

    it("should reject completely invalid URL strings", () => {
      const result = resourceSchema.safeParse({
        ...validResource,
        cloudinary_url: "not-a-valid-url-string",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Document link must be a valid URL"
        );
      }
    });

    it("should reject invalid branch codes", () => {
      const result = resourceSchema.safeParse({
        ...validResource,
        branch_code: "invalid_branch",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("subjectSchema", () => {
    it("should validate subject properties", () => {
      expect(
        subjectSchema.safeParse({
          name: "Data Structures",
          branch_code: "cs",
          semester: 3,
        }).success
      ).toBe(true);

      expect(
        subjectSchema.safeParse({
          name: "DS",
          branch_code: "invalid",
          semester: 9,
        }).success
      ).toBe(false);
    });
  });

  describe("roadmapSchema", () => {
    it("should validate roadmap properties", () => {
      expect(
        roadmapSchema.safeParse({
          title: "Fullstack Web Dev",
          branch_code: "cs",
          semester: 4,
          order_idx: 1,
        }).success
      ).toBe(true);

      expect(
        roadmapSchema.safeParse({
          title: "Fullstack Web Dev",
          branch_code: "cs",
          semester: 4,
          order_idx: -1, // invalid negative index
        }).success
      ).toBe(false);
    });
  });
});
