// src/lib/supabase/global-cache.ts
import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Create a generic, non-authenticated Supabase client for global caching.
// This client bypasses RLS and cookies, so it MUST ONLY BE USED for PUBLIC/SHARED tables
// (like announcements, roadmaps, subjects, resource_types).
// Never use this client to fetch user-specific data (profiles, reads, etc).
const getGlobalSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
};

/**
 * Caches all announcements globally.
 * Revalidates every 60 seconds across all users.
 */
export const getGlobalAnnouncements = unstable_cache(
  async () => {
    const supabase = getGlobalSupabase();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    return data || [];
  },
  ["global-announcements"],
  { revalidate: 60, tags: ["announcements"] }
);

/**
 * Caches all active resource types globally.
 * Revalidates every 1 hour across all users.
 */
export const getGlobalResourceTypes = unstable_cache(
  async () => {
    const supabase = getGlobalSupabase();
    const { data } = await supabase
      .from("resource_types")
      .select("id, name, is_pyq")
      .eq("is_active", true);
    return data || [];
  },
  ["global-resource-types"],
  { revalidate: 3600, tags: ["resource-types"] }
);

/**
 * Caches subjects for a specific branch and semester.
 * Revalidates every 1 hour across all users.
 */
export const getGlobalSubjects = unstable_cache(
  async (branchCode: string, semester: number) => {
    const supabase = getGlobalSupabase();
    const { data } = await supabase
      .from("subjects")
      .select("id, name")
      .eq("branch_code", branchCode)
      .eq("semester", semester);
    return data || [];
  },
  ["global-subjects"],
  { revalidate: 3600, tags: ["subjects"] }
);

/**
 * Caches roadmaps for a specific branch and semester.
 * Revalidates every 1 hour across all users.
 */
export const getGlobalRoadmaps = unstable_cache(
  async (branchCode: string, semester: number) => {
    const supabase = getGlobalSupabase();
    const { data } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("branch_code", branchCode)
      .eq("semester", semester)
      .order("order_idx");
    return data || [];
  },
  ["global-roadmaps"],
  { revalidate: 3600, tags: ["roadmaps"] }
);

/**
 * Caches resources (not signed URLs, just metadata) globally.
 * Revalidates every 60 seconds.
 */
export const getGlobalResources = unstable_cache(
  async (branchCode: string, semester: number) => {
    const supabase = getGlobalSupabase();
    const { data } = await supabase
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
    return data || [];
  },
  ["global-resources"],
  { revalidate: 60, tags: ["resources"] }
);
