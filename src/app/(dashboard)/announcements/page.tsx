// src/app/(dashboard)/announcements/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementsClient } from "./announcements-client";
import { getCachedUserAndProfile } from "@/lib/supabase/cached";

export default async function AnnouncementsPage() {
  // Use request-level cached user — no extra getUser() round-trip
  const { user } = await getCachedUserAndProfile();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const db = supabase as any;

  // Fetch announcements and per-user reads concurrently
  const [announcementsResult, readsResult] = await Promise.all([
    db
      .from("announcements")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false }) as any,
    db
      .from("announcement_reads")
      .select("announcement_id")
      .eq("user_id", user.id) as any,
  ]);

  const announcements = announcementsResult.data || [];
  const reads = readsResult.data || [];

  const readIds = reads.map(
    (r: { announcement_id: string }) => r.announcement_id
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">College Notices</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Read important college updates, exam dates, and notices here. Click
          any notice to see the full details!
        </p>
      </div>
      <AnnouncementsClient announcements={announcements} readIds={readIds} />
    </div>
  );
}
