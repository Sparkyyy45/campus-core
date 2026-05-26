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

  const { data: profile } = await supabase
    .from("profiles")
    .select("branch_code, semester, full_name")
    .eq("id", user.id)
    .single() as {
    data: { branch_code: string; semester: number; full_name: string } | null;
    error: unknown;
  };

  if (!profile) redirect("/login");

  const db = supabase as any;

  // Fetch roadmap items for student's branch/semester
  const { data: roadmaps } = (await db
    .from("roadmaps")
    .select("*")
    .eq("branch_code", profile.branch_code)
    .eq("semester", profile.semester)
    .order("order_idx")) as { data: Roadmap[] | null };

  // Fetch this student's completions
  const { data: completions } = (await db
    .from("roadmap_completions")
    .select("roadmap_id")
    .eq("user_id", user.id)) as {
    data: { roadmap_id: string }[] | null;
  };

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
