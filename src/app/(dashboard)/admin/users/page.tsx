// src/app/(dashboard)/admin/users/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UsersClient } from "./users-client";
import type { Profile } from "@/types/database";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single() as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") redirect("/dashboard");

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false }) as { data: Profile[] | null };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View all registered users and manage roles.
        </p>
      </div>
      <UsersClient users={users ?? []} currentUserId={user.id} />
    </div>
  );
}
