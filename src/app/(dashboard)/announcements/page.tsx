// src/app/(dashboard)/announcements/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnnouncementsClient } from "./announcements-client";
import {
  getCachedUserAndProfile,
  getCachedAnnouncementsAndReads,
} from "@/lib/supabase/cached";

export default async function AnnouncementsPage() {
  // Use request-level cached user — no extra getUser() round-trip
  const { user } = await getCachedUserAndProfile();
  if (!user) redirect("/login");

  // Fetch from global cache (announcements) and request cache (reads)
  const { announcements, reads } = await getCachedAnnouncementsAndReads(
    user.id
  );

  const readIds = Array.from(reads);

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
