// src/app/(dashboard)/admin/resources/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResourcesAdminClient } from "./resources-admin-client";
import type { Subject, ResourceType } from "@/types/database";

type ResourceRow = {
  id: string;
  title: string;
  branch_code: string;
  semester: number;
  status: string;
  created_at: string;
  cloudinary_public_id: string;
  subjects: { name: string } | null;
  resource_types: { name: string } | null;
};

export default async function AdminResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single() as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") redirect("/dashboard");

  const client = supabase as any;
  const [{ data: resources }, { data: subjects }, { data: resourceTypes }] = await Promise.all([
    client
      .from("resources")
      .select("id, title, branch_code, semester, status, created_at, cloudinary_public_id, subjects(name), resource_types(name)")
      .order("created_at", { ascending: false }) as { data: ResourceRow[] | null },
    client.from("subjects").select("*").order("name") as { data: Subject[] | null },
    client.from("resource_types").select("*").eq("is_active", true) as { data: ResourceType[] | null },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Resources</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload, publish, and delete academic resources.
        </p>
      </div>
      <ResourcesAdminClient
        resources={resources ?? []}
        subjects={subjects ?? []}
        resourceTypes={resourceTypes ?? []}
      />
    </div>
  );
}
