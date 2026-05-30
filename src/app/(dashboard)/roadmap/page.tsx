// src/app/(dashboard)/roadmap/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoadmapClient } from "./roadmap-client";
import type { Roadmap } from "@/types/database";
import { getCachedUserAndProfile } from "@/lib/supabase/cached";
import { getGlobalRoadmaps } from "@/lib/supabase/global-cache";

export default async function RoadmapPage() {
  // Use request-level cached user — no extra getUser() round-trip
  const { user, profile } = await getCachedUserAndProfile();
  if (!user || !profile) redirect("/login");

  const supabase = await createClient();
  const db = supabase as any;

  // Fetch roadmap items from global cache and completions concurrently
  const [roadmaps, completionsResult] = await Promise.all([
    getGlobalRoadmaps(profile.branch_code || "", profile.semester || 1),
    db
      .from("roadmap_completions")
      .select("roadmap_id")
      .eq("user_id", user.id) as any,
  ]);
  const completions = completionsResult.data as { roadmap_id: string }[] | null;

  const completedIds = new Set(
    (completions ?? []).map((c: { roadmap_id: string }) => c.roadmap_id)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Your Study Roadmap
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Semester {profile.semester} · Click on subjects or chapters below to
          check them off as you study to track your progress!
        </p>
      </div>
      <RoadmapClient
        roadmaps={roadmaps ?? []}
        completedIds={Array.from(completedIds)}
      />
    </div>
  );
}
