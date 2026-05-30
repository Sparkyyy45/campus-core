// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import {
  getCachedUserAndProfile,
  getCachedAnnouncementsAndReads,
} from "@/lib/supabase/cached";
import { getGlobalRoadmaps } from "@/lib/supabase/global-cache";

export default async function DashboardPage() {
  // Use request-level cached user — no extra getUser() round-trip
  const { user, profile } = await getCachedUserAndProfile();

  if (!user || !profile) redirect("/login");

  // Reuse the same Supabase client for all DB queries in this render
  const supabase = await createClient();
  const db = supabase as any;

  // UNIFIED CONCURRENT EXECUTION: Fetch global shared data and user-specific data in parallel
  const [announcementsAndReads, globalRoadmaps, rmDoneResult] =
    await Promise.all([
      getCachedAnnouncementsAndReads(user.id),
      getGlobalRoadmaps(profile.branch_code || "", profile.semester || 1),
      db
        .from("roadmap_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  const { announcements, reads } = announcementsAndReads;

  // Derive pinned announcements in memory from global cache
  const pinnedAnnouncements = announcements
    .filter((a: any) => a.is_pinned)
    .slice(0, 3);

  const unreadCount = announcements.filter((a: any) => !reads.has(a.id)).length;

  const roadmapTotal = globalRoadmaps.length;
  const roadmapDone = Math.min(rmDoneResult.count ?? 0, roadmapTotal);
  const roadmapPct =
    roadmapTotal > 0 ? Math.round((roadmapDone / roadmapTotal) * 100) : 0;

  const firstName = profile?.full_name?.split(" ")[0] ?? "Student";

  // Time of day greeting
  const hour = new Date().getHours();
  let greeting = "Welcome back";
  let greetingEmoji = "✨";
  if (hour < 12) {
    greeting = "Good morning";
    greetingEmoji = "🌅";
  } else if (hour < 17) {
    greeting = "Good afternoon";
    greetingEmoji = "☀️";
  } else {
    greeting = "Good evening";
    greetingEmoji = "🌌";
  }

  const BRANCH_NAMES: Record<string, string> = {
    cs: "Computer Science & Engineering",
    it: "Information Technology",
    ec: "Electronics & Communication",
    me: "Mechanical Engineering",
    ce: "Civil Engineering",
    ee: "Electrical Engineering",
  };

  const branchFullName =
    BRANCH_NAMES[profile?.branch_code ?? ""] || "Engineering Program";

  return (
    <DashboardClient
      firstName={firstName}
      semester={profile?.semester ?? 1}
      branchFullName={branchFullName}
      role={profile?.role ?? "STUDENT"}
      initialStreak={5}
      unreadCount={unreadCount}
      pinnedAnnouncements={pinnedAnnouncements}
      roadmapTotal={roadmapTotal}
      roadmapDone={roadmapDone}
      roadmapPct={roadmapPct}
      greeting={greeting}
      greetingEmoji={greetingEmoji}
    />
  );
}
