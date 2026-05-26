// src/lib/db-cache.ts
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
      return [];
    }
    return data || [];
  },
  ["subjects-by-branch-sem"],
  {
    revalidate: 86400, // 24 hours
    tags: ["subjects"]
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
      return [];
    }
    return data || [];
  },
  ["static-resource-types"],
  {
    revalidate: 86400, // 24 hours
    tags: ["resource-types"]
  }
);
