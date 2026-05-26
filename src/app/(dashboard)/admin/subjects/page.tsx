// src/app/(dashboard)/admin/subjects/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubjectsClient } from "./subjects-client";
import type { Subject } from "@/types/database";

export default async function SubjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") redirect("/dashboard");

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .order("branch_code")
    .order("semester")
    .order("name") as { data: Subject[] | null };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Subjects</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add or remove subjects per branch and semester.
        </p>
      </div>
      <SubjectsClient subjects={subjects ?? []} />
    </div>
  );
}
