// src/lib/supabase/cached.ts
import { cache } from "react";
import { createClient } from "./server";

export type CachedProfile = {
  full_name: string | null;
  branch_code: string | null;
  semester: number | null;
  role: string;
};

/**
 * Request-level cached retrieval of authenticated user and profile metadata.
 * Memoizes duplicate getUser() and profile database reads within the same Next.js request lifecycle.
 */
export const getCachedUserAndProfile = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, branch_code, semester, role")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile: profile as CachedProfile | null,
  };
});

/**
 * Request-level cached retrieval of announcements and announcement read lists.
 * Memoizes duplicate notice loads between layouts and child screens within the same request.
 */
export const getCachedAnnouncementsAndReads = cache(async (userId: string) => {
  const supabase = await createClient();
  const [announcementsRes, readsRes] = await Promise.all([
    supabase.from("announcements").select("id"),
    supabase
      .from("announcement_reads")
      .select("announcement_id")
      .eq("user_id", userId),
  ]);

  const announcements = announcementsRes.data || [];
  const reads = new Set(
    (readsRes.data || []).map((r: any) => r.announcement_id)
  );

  return { announcements, reads };
});
