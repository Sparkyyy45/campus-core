"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AnnouncementActionResult = { error?: string; success?: string };

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase: null, user: null };
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single() as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") return { supabase: null, user: null };
  return { supabase, user };
}

export async function createAnnouncementAction(formData: FormData): Promise<AnnouncementActionResult> {
  const { supabase, user } = await verifyAdmin();
  if (!supabase || !user) return { error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const is_pinned = formData.get("is_pinned") === "on";

  if (!title || !content) return { error: "Title and content are required." };

  const { error } = await supabase.from("announcements").insert({
    title, content, is_pinned, created_by: user.id,
  } as any);

  if (error) return { error: error.message };
  revalidatePath("/admin/announcements");
  return { success: "Announcement posted." };
}

export async function togglePinAction(id: string, is_pinned: boolean): Promise<AnnouncementActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const { error } = await (supabase.from("announcements") as any).update({ is_pinned: !is_pinned }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/announcements");
  return { success: is_pinned ? "Unpinned." : "Pinned." };
}

export async function deleteAnnouncementAction(id: string): Promise<AnnouncementActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const { error } = await (supabase.from("announcements") as any).delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/announcements");
  return { success: "Announcement deleted." };
}
