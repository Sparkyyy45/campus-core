"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { announcementSchema } from "@/lib/validations/admin";
import { verifyAdmin } from "@/lib/supabase/admin";

export type AnnouncementActionResult = { error?: string; success?: string };

export async function createAnnouncementAction(
  formData: FormData
): Promise<AnnouncementActionResult> {
  const { supabase, user } = await verifyAdmin();
  if (!supabase || !user) return { error: "Unauthorized" };

  const titleInput = (formData.get("title") as string)?.trim();
  const contentInput = (formData.get("content") as string)?.trim();
  const is_pinned = formData.get("is_pinned") === "on";

  const stripHtml = (str: string) => str.replace(/<[^>]*>/g, "");

  const validated = announcementSchema.safeParse({
    title: titleInput ? stripHtml(titleInput) : "",
    content: contentInput ? stripHtml(contentInput) : "",
    is_pinned,
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const data = validated.data;

  const { error } = await supabase.from("announcements").insert({
    title: data.title,
    content: data.content,
    is_pinned: data.is_pinned,
    created_by: user.id,
  } as any);

  if (error) return { error: error.message };

  revalidateTag("announcements", "max");
  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return { success: "Announcement posted." };
}

export async function togglePinAction(
  id: string,
  is_pinned: boolean
): Promise<AnnouncementActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const { error } = await (supabase.from("announcements") as any)
    .update({ is_pinned: !is_pinned })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidateTag("announcements", "max");
  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return { success: is_pinned ? "Unpinned." : "Pinned." };
}

export async function deleteAnnouncementAction(
  id: string
): Promise<AnnouncementActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const { error } = await (supabase.from("announcements") as any)
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };

  revalidateTag("announcements", "max");
  revalidatePath("/admin/announcements");
  revalidatePath("/announcements");
  revalidatePath("/dashboard");
  return { success: "Announcement deleted." };
}
