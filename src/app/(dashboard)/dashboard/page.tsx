// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import {
  getCachedUserAndProfile,
  getCachedAnnouncementsAndReads,
} from "@/lib/supabase/cached";

export default async function DashboardPage() {
  // Use request-level cached user — no extra getUser() round-trip
  const { user, profile } = await getCachedUserAndProfile();

  if (!user || !profile) redirect("/login");

  // Reuse the same Supabase client for all DB queries in this render
  const supabase = await createClient();
  const db = supabase as any;

  // UNIFIED CONCURRENT EXECUTION: Fetch pinned notices, cached reads, and roadmap status in parallel
  const [pinnedResult, announcementsAndReads, rmTotalResult, rmDoneResult] =
    await Promise.all([
      db
        .from("announcements")
        .select("id, title, content")
        .eq("is_pinned", true)
        .order("created_at", { ascending: false })
        .limit(3) as any,
      getCachedAnnouncementsAndReads(user.id),
      db
        .from("roadmaps")
        .select("*", { count: "exact", head: true })
        .eq("branch_code", profile.branch_code)
        .eq("semester", profile.semester),
      db
        .from("roadmap_completions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  const pinnedAnnouncements = pinnedResult.data || [];
  const { announcements, reads } = announcementsAndReads;
  const unreadCount = announcements.filter((a: any) => !reads.has(a.id)).length;

  const roadmapTotal = rmTotalResult.count ?? 0;
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
