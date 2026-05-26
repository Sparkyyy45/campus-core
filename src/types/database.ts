// src/types/database.ts
// Supabase database type definitions — matches the schema exactly

export type Role = "STUDENT" | "ADMIN";
export type ConfessionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ResourceStatus = "DRAFT" | "PUBLISHED";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          roll_no: string;
          branch_code: string;
          semester: number;
          year: number;
          role: Role;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          roll_no: string;
          branch_code: string;
          semester: number;
          year: number;
          role?: Role;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          branch_code: string;
          semester: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          branch_code: string;
          semester: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subjects"]["Insert"]>;
      };
      resource_types: {
        Row: {
          id: string;
          name: string;
          is_pyq: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          is_pyq?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["resource_types"]["Insert"]
        >;
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cloudinary_public_id: string;
          cloudinary_url: string;
          file_size_bytes: number | null;
          subject_id: string;
          resource_type_id: string;
          branch_code: string;
          semester: number;
          exam_year: number | null;
          status: ResourceStatus;
          uploader_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          cloudinary_public_id: string;
          cloudinary_url: string;
          file_size_bytes?: number | null;
          subject_id: string;
          resource_type_id: string;
          branch_code: string;
          semester: number;
          exam_year?: number | null;
          status?: ResourceStatus;
          uploader_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["resources"]["Insert"]>;
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          is_pinned: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          is_pinned?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["announcements"]["Insert"]
        >;
      };
      roadmaps: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          branch_code: string;
          semester: number;
          order_idx: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          branch_code: string;
          semester: number;
          order_idx: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadmaps"]["Insert"]>;
      };
      announcement_reads: {
        Row: {
          user_id: string;
          announcement_id: string;
          read_at: string;
        };
        Insert: {
          user_id: string;
          announcement_id: string;
          read_at?: string;
        };
        Update: never;
      };
      roadmap_completions: {
        Row: {
          user_id: string;
          roadmap_id: string;
          completed_at: string;
        };
        Insert: {
          user_id: string;
          roadmap_id: string;
          completed_at?: string;
        };
        Update: never;
      };
      resource_downloads: {
        Row: {
          id: string;
          user_id: string;
          resource_id: string;
          downloaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resource_id: string;
          downloaded_at?: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      role: Role;
      resource_status: ResourceStatus;
      confession_status: ConfessionStatus;
    };
  };
}

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Subject = Database["public"]["Tables"]["subjects"]["Row"];
export type ResourceType =
  Database["public"]["Tables"]["resource_types"]["Row"];
export type Resource = Database["public"]["Tables"]["resources"]["Row"];
export type Announcement =
  Database["public"]["Tables"]["announcements"]["Row"];
export type Roadmap = Database["public"]["Tables"]["roadmaps"]["Row"];
export type ResourceDownload =
  Database["public"]["Tables"]["resource_downloads"]["Row"];

// Extended types with joined relations
export type ResourceWithRelations = Resource & {
  subjects: Pick<Subject, "id" | "name">;
  resource_types: Pick<ResourceType, "id" | "name" | "is_pyq">;
  profiles: Pick<Profile, "id" | "full_name">;
};
