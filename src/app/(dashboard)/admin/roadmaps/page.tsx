// src/app/(dashboard)/admin/roadmaps/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RoadmapsClient } from "./roadmaps-client";
import type { Roadmap } from "@/types/database";

export default async function AdminRoadmapsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single() as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") redirect("/dashboard");

  const { data: roadmaps } = await supabase
    .from("roadmaps")
    .select("*")
    .order("branch_code")
    .order("semester")
    .order("order_idx") as { data: Roadmap[] | null };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Roadmaps</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create structured learning paths per branch and semester.
        </p>
      </div>
      <RoadmapsClient roadmaps={roadmaps ?? []} />
    </div>
  );
}
