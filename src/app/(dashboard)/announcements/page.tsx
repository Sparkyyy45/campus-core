// src/app/(dashboard)/announcements/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementsClient } from "./announcements-client";
import type { Announcement } from "@/types/database";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as any;

  // Fetch all announcements and the student's reads concurrently
  const [announcementsResult, readsResult] = await Promise.all([
    db
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false }) as any,
    db
      .from("announcement_reads")
      .select("announcement_id")
      .eq("user_id", user.id) as any
  ]);

  const announcements = announcementsResult.data;
  const reads = readsResult.data;

  const readIds = (reads ?? []).map(
    (r: { announcement_id: string }) => r.announcement_id
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
        <p className="text-sm text-muted-foreground mt-1">
          College updates and important notices.
        </p>
      </div>
      <AnnouncementsClient
        announcements={announcements ?? []}
        readIds={readIds}
      />
    </div>
  );
}
