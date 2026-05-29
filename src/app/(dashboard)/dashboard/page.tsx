// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const db = supabase as any;

  // STAGE 1: Fetch all dashboard data concurrently
  const [profileResult, pinnedResult, announcementsResult, readsResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, branch_code, semester, role")
        .eq("id", user.id)
        .single() as any,
      db
        .from("announcements")
        .select("id, title, content")
        .eq("is_pinned", true)
        .order("created_at", { ascending: false })
        .limit(3) as any,
      supabase.from("announcements").select("id"),
      supabase
        .from("announcement_reads")
        .select("announcement_id")
        .eq("user_id", user.id),
    ]);

  const profile = profileResult.data;
  const pinnedAnnouncements = pinnedResult.data || [];
  const announcements = announcementsResult.data || [];
  const reads = new Set(
    (readsResult.data || []).map((r: any) => r.announcement_id)
  );

  const firstName = profile?.full_name?.split(" ")[0] ?? "Student";
  const unreadCount = announcements.filter((a: any) => !reads.has(a.id)).length;

  // STAGE 2: Fetch roadmap progress concurrently
  let roadmapTotal = 0;
  let roadmapDone = 0;
  if (profile) {
    const [rmTotalResult, rmDoneResult] = await Promise.all([
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
    roadmapTotal = rmTotalResult.count ?? 0;
    roadmapDone = Math.min(rmDoneResult.count ?? 0, roadmapTotal);
  }

  const roadmapPct =
    roadmapTotal > 0 ? Math.round((roadmapDone / roadmapTotal) * 100) : 0;

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
      initialStreak={5} // Mock default streak, fully incrementable dynamically on client!
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
