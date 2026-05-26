"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type RoadmapToggleResult = { error?: string; success?: string };

export async function toggleRoadmapCompletionAction(
  roadmapId: string,
  isCompleted: boolean
): Promise<RoadmapToggleResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const db = supabase as any;

  if (isCompleted) {
    // Remove completion
    const { error } = await db
      .from("roadmap_completions")
      .delete()
      .eq("user_id", user.id)
      .eq("roadmap_id", roadmapId);
    if (error) return { error: error.message };
  } else {
    // Add completion
    const { error } = await db
      .from("roadmap_completions")
      .insert({ user_id: user.id, roadmap_id: roadmapId });
    if (error) {
      // Ignore duplicate key (already completed)
      if (error.code !== "23505") return { error: error.message };
    }
  }

  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
  return { success: isCompleted ? "Unmarked." : "Marked as complete!" };
}
