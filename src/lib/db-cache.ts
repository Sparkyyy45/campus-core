// src/lib/db-cache.ts
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * Cached fetch for subjects belonging to a specific branch and semester.
 * Valid for 24 hours, tag-revalidated on admin updates.
 */
export const getCachedSubjects = unstable_cache(
  async (branchCode: string, semester: number) => {
    const { data, error } = await supabase
      .from("subjects")
      .select("id, name")
      .eq("branch_code", branchCode)
      .eq("semester", semester);

    if (error) {
      console.error("getCachedSubjects DB error:", error);
      throw new Error(`Failed to fetch subjects: ${error.message}`);
    }
    return data || [];
  },
  ["subjects-by-branch-sem"],
  {
    revalidate: 86400, // 24 hours
    tags: ["subjects"],
  }
);

/**
 * Cached fetch for static resource types.
 * Valid for 24 hours, tag-revalidated on admin updates.
 */
export const getCachedResourceTypes = unstable_cache(
  async () => {
    const { data, error } = await supabase
      .from("resource_types")
      .select("id, name, is_pyq");

    if (error) {
      console.error("getCachedResourceTypes DB error:", error);
      throw new Error(`Failed to fetch resource types: ${error.message}`);
    }
    return data || [];
  },
  ["static-resource-types"],
  {
    revalidate: 86400, // 24 hours
    tags: ["resource-types"],
  }
);

/**
 * Cached fetch for published resources by branch + semester.
 * 5-minute revalidation — during exam peaks, 300 students in the same
 * branch+semester serve from cache instead of hitting Supabase 300 times.
 * Keyed by branchCode + semester so different cohorts get their own cache.
 */
export const getCachedResources = unstable_cache(
  async (branchCode: string, semester: number) => {
    const { data, error } = await (supabase as any)
      .from("resources")
      .select(
        `
        id, 
        title, 
        description, 
        cloudinary_url, 
        file_size_bytes,
        resource_type_id,
        subject_id,
        subjects (name),
        resource_types (name, is_pyq)
      `
      )
      .eq("branch_code", branchCode)
      .eq("semester", semester)
      .eq("status", "PUBLISHED")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getCachedResources DB error:", error);
      throw new Error(`Failed to fetch resources: ${error.message}`);
    }
    return data || [];
  },
  ["resources-by-branch-sem"],
  {
    revalidate: 300, // 5 minutes
    tags: ["resources"],
  }
);

/**
 * Cached fetch for all announcements.
 * 10-minute revalidation — announcements are the same for every student.
 */
export const getCachedAnnouncements = unstable_cache(
  async () => {
    const { data, error } = await (supabase as any)
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getCachedAnnouncements DB error:", error);
      throw new Error(`Failed to fetch announcements: ${error.message}`);
    }
    return data || [];
  },
  ["all-announcements"],
  {
    revalidate: 600, // 10 minutes
    tags: ["announcements"],
  }
);
