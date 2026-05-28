"use server";

import { revalidatePath } from "next/cache";
import { roadmapSchema } from "@/lib/validations/admin";
import { verifyAdmin as sharedVerifyAdmin } from "@/lib/supabase/admin";

export type RoadmapActionResult = { error?: string; success?: string };

async function verifyAdmin() {
  const { supabase } = await sharedVerifyAdmin();
  return { db: supabase as any };
}

export async function createRoadmapAction(
  formData: FormData
): Promise<RoadmapActionResult> {
  const { db } = await verifyAdmin();
  if (!db) return { error: "Unauthorized" };

  const titleInput = (formData.get("title") as string)?.trim();
  const descriptionInput =
    (formData.get("description") as string)?.trim() || null;
  const branch_code = (formData.get("branch_code") as string)?.toLowerCase();
  const semester = Number(formData.get("semester"));
  const order_idx = Number(formData.get("order_idx")) || 0;

  const stripHtml = (str: string) => str.replace(/<[^>]*>/g, "");

  const validated = roadmapSchema.safeParse({
    title: titleInput ? stripHtml(titleInput) : "",
    description: descriptionInput ? stripHtml(descriptionInput) : null,
    branch_code,
    semester,
    order_idx,
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const data = validated.data;

  const { error } = await db.from("roadmaps").insert({
    title: data.title,
    description: data.description,
    branch_code: data.branch_code,
    semester: data.semester,
    order_idx: data.order_idx,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/roadmaps");
  return { success: "Roadmap item created." };
}

export async function deleteRoadmapAction(
  id: string
): Promise<RoadmapActionResult> {
  const { db } = await verifyAdmin();
  if (!db) return { error: "Unauthorized" };

  const { error } = await db.from("roadmaps").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/roadmaps");
  return { success: "Roadmap item deleted." };
}

export async function reorderRoadmapAction(
  id: string,
  direction: "up" | "down",
  currentIdx: number
): Promise<RoadmapActionResult> {
  const { db } = await verifyAdmin();
  if (!db) return { error: "Unauthorized" };

  const newIdx = direction === "up" ? currentIdx - 1 : currentIdx + 1;
  const { error } = await db
    .from("roadmaps")
    .update({ order_idx: newIdx })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/roadmaps");
  return { success: "Reordered." };
}
