// src/app/(dashboard)/roadmap/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoadmapClient } from "./roadmap-client";
import type { Roadmap } from "@/types/database";

export default async function RoadmapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as any;

  // STAGE 1: Fetch student profile and roadmap completions concurrently
  const [profileResult, completionsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("branch_code, semester, full_name")
      .eq("id", user.id)
      .single() as any,
    db
      .from("roadmap_completions")
      .select("roadmap_id")
      .eq("user_id", user.id) as any
  ]);

  const profile = profileResult.data;
  if (!profile) redirect("/login");

  const completions = completionsResult.data as { roadmap_id: string }[] | null;

  // STAGE 2: Fetch roadmap items based on student's branch/semester
  const { data: roadmaps } = (await db
    .from("roadmaps")
    .select("*")
    .eq("branch_code", profile.branch_code)
    .eq("semester", profile.semester)
    .order("order_idx")) as { data: Roadmap[] | null };

  const completedIds = new Set(
    (completions ?? []).map((c: { roadmap_id: string }) => c.roadmap_id)
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Roadmap</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {profile.branch_code.toUpperCase()} · Semester {profile.semester} —
          track your progress through the semester.
        </p>
      </div>
      <RoadmapClient
        roadmaps={roadmaps ?? []}
        completedIds={Array.from(completedIds)}
      />
    </div>
  );
}
