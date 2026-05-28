// src/app/(dashboard)/announcements/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementsClient } from "./announcements-client";
import { getCachedAnnouncements } from "@/lib/db-cache";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as any;

  // Fetch cached announcements (shared across all students, 10-min cache)
  // and per-user reads concurrently
  const [announcements, readsResult] = await Promise.all([
    getCachedAnnouncements(),
    db
      .from("announcement_reads")
      .select("announcement_id")
      .eq("user_id", user.id) as any,
  ]);

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
