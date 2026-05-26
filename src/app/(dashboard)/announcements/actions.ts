"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAnnouncementReadAction(
  announcementId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const db = supabase as any;
  const { error } = await db
    .from("announcement_reads")
    .insert({ user_id: user.id, announcement_id: announcementId });

  // Ignore duplicate (already read)
  if (error && error.code !== "23505") return { error: error.message };

  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return {};
}

export async function markAllAnnouncementsReadAction(): Promise<{
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const db = supabase as any;

  // Fetch all announcements
  const { data: announcements } = await db
    .from("announcements")
    .select("id");
  if (!announcements?.length) return {};

  // Fetch already-read
  const { data: existingReads } = await db
    .from("announcement_reads")
    .select("announcement_id")
    .eq("user_id", user.id);

  const readSet = new Set(
    (existingReads ?? []).map((r: { announcement_id: string }) => r.announcement_id)
  );

  const toInsert = announcements
    .filter((a: { id: string }) => !readSet.has(a.id))
    .map((a: { id: string }) => ({
      user_id: user.id,
      announcement_id: a.id,
    }));

  if (toInsert.length > 0) {
    await db.from("announcement_reads").insert(toInsert);
  }

  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return {};
}
