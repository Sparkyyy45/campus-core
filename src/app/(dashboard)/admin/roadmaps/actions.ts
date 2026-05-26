"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type RoadmapActionResult = { error?: string; success?: string };

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { db: null };
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single() as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") return { db: null };
  // Cast to any to bypass Supabase generic inference for tables not in schema
  return { db: supabase as any };
}

export async function createRoadmapAction(formData: FormData): Promise<RoadmapActionResult> {
  const { db } = await verifyAdmin();
  if (!db) return { error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const branch_code = (formData.get("branch_code") as string)?.toLowerCase();
  const semester = Number(formData.get("semester"));
  const order_idx = Number(formData.get("order_idx")) || 0;

  if (!title || !branch_code || !semester) return { error: "Title, branch, and semester are required." };

  const { error } = await db.from("roadmaps").insert({ title, description, branch_code, semester, order_idx });
  if (error) return { error: error.message };

  revalidatePath("/admin/roadmaps");
  return { success: "Roadmap item created." };
}

export async function deleteRoadmapAction(id: string): Promise<RoadmapActionResult> {
  const { db } = await verifyAdmin();
  if (!db) return { error: "Unauthorized" };

  const { error } = await db.from("roadmaps").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/roadmaps");
  return { success: "Roadmap item deleted." };
}

export async function reorderRoadmapAction(id: string, direction: "up" | "down", currentIdx: number): Promise<RoadmapActionResult> {
  const { db } = await verifyAdmin();
  if (!db) return { error: "Unauthorized" };

  const newIdx = direction === "up" ? currentIdx - 1 : currentIdx + 1;
  const { error } = await db.from("roadmaps").update({ order_idx: newIdx }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/roadmaps");
  return { success: "Reordered." };
}
