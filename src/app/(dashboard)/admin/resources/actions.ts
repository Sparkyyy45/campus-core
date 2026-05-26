"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";

export type ResourceAdminActionResult = { error?: string; success?: string };

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase: null, user: null };
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single() as { data: { role: string } | null; error: unknown };
  if (profile?.role !== "ADMIN") return { supabase: null, user: null };
  return { supabase, user };
}

export async function createResourceAction(formData: FormData): Promise<ResourceAdminActionResult> {
  const { supabase, user } = await verifyAdmin();
  if (!supabase || !user) return { error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const subject_id = formData.get("subject_id") as string;
  const resource_type_id = formData.get("resource_type_id") as string;
  const branch_code = (formData.get("branch_code") as string)?.toLowerCase();
  const semester = Number(formData.get("semester"));
  const cloudinary_public_id = formData.get("cloudinary_public_id") as string;
  const cloudinary_url = formData.get("cloudinary_url") as string;
  const file_size_bytes = formData.get("file_size_bytes") ? Number(formData.get("file_size_bytes")) : null;
  const exam_year = formData.get("exam_year") ? Number(formData.get("exam_year")) : null;
  const status = (formData.get("status") as "DRAFT" | "PUBLISHED") || "PUBLISHED";

  if (!title || !subject_id || !resource_type_id || !branch_code || !semester || !cloudinary_public_id || !cloudinary_url) {
    return { error: "All required fields must be filled." };
  }

  const { error } = await (supabase.from("resources") as any).insert({
    title, description, subject_id, resource_type_id, branch_code,
    semester, cloudinary_public_id, cloudinary_url, file_size_bytes,
    exam_year, status, uploader_id: user.id,
  });

  if (error) {
    if (error.code === "23505") return { error: "A resource with that Cloudinary ID already exists." };
    return { error: error.message };
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: "Resource uploaded and published." };
}

export async function deleteResourceAction(id: string, cloudinaryPublicId: string): Promise<ResourceAdminActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  // Delete from Cloudinary first
  try {
    await cloudinary.uploader.destroy(cloudinaryPublicId, { resource_type: "raw" });
  } catch (e) {
    console.warn("Cloudinary delete warning:", e);
    // Continue with DB deletion even if Cloudinary fails
  }

  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: "Resource deleted." };
}

export async function updateResourceStatusAction(id: string, status: "DRAFT" | "PUBLISHED"): Promise<ResourceAdminActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const { error } = await (supabase.from("resources") as any).update({ status }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: `Resource ${status === "PUBLISHED" ? "published" : "moved to draft"}.` };
}
