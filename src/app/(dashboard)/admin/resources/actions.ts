"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { resourceSchema } from "@/lib/validations/admin";
import { verifyAdmin } from "@/lib/supabase/admin";

export type ResourceAdminActionResult = { error?: string; success?: string };

export async function createResourceAction(
  formData: FormData
): Promise<ResourceAdminActionResult> {
  const { supabase, user } = await verifyAdmin();
  if (!supabase || !user) return { error: "Unauthorized" };

  const titleInput = (formData.get("title") as string)?.trim();
  const descriptionInput =
    (formData.get("description") as string)?.trim() || null;
  const subject_id = formData.get("subject_id") as string;
  const resource_type_id = formData.get("resource_type_id") as string;
  const branch_code = (formData.get("branch_code") as string)?.toLowerCase();
  const semester = Number(formData.get("semester"));
  let cloudinary_public_id = (
    (formData.get("cloudinary_public_id") as string) || ""
  )?.trim();
  if (!cloudinary_public_id) {
    cloudinary_public_id = `gdrive-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  const cloudinary_url = (
    (formData.get("cloudinary_url") as string) || ""
  )?.trim();
  const file_size_bytes = formData.get("file_size_bytes")
    ? Number(formData.get("file_size_bytes"))
    : null;
  const exam_year = formData.get("exam_year")
    ? Number(formData.get("exam_year"))
    : null;
  const status =
    (formData.get("status") as "DRAFT" | "PUBLISHED") || "PUBLISHED";

  // HTML sanitization helper
  const stripHtml = (str: string) => str.replace(/<[^>]*>/g, "");

  // Validation
  const validated = resourceSchema.safeParse({
    title: titleInput ? stripHtml(titleInput) : "",
    description: descriptionInput ? stripHtml(descriptionInput) : null,
    subject_id,
    resource_type_id,
    branch_code,
    semester,
    cloudinary_public_id,
    cloudinary_url,
    file_size_bytes,
    exam_year,
    status,
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const data = validated.data;

  const { error } = await (supabase.from("resources") as any).insert({
    title: data.title,
    description: data.description,
    subject_id: data.subject_id,
    resource_type_id: data.resource_type_id,
    branch_code: data.branch_code,
    semester: data.semester,
    cloudinary_public_id: data.cloudinary_public_id,
    cloudinary_url: data.cloudinary_url,
    file_size_bytes: data.file_size_bytes,
    exam_year: data.exam_year,
    status: data.status,
    uploader_id: user.id,
  });

  if (error) {
    if (error.code === "23505")
      return { error: "A resource with that Cloudinary ID already exists." };
    return { error: error.message };
  }

  revalidateTag("resources", "max");
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: "Resource uploaded and published." };
}

export async function deleteResourceAction(
  id: string
): Promise<ResourceAdminActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const db = supabase as any;
  // Fetch secure cloudinary_public_id from PostgreSQL
  const { data: resource, error: fetchError } = await db
    .from("resources")
    .select("cloudinary_public_id")
    .eq("id", id)
    .single();

  if (fetchError || !resource) {
    return { error: "Resource not found or failed to fetch metadata." };
  }

  // Delete from Cloudinary using DB resolved public ID (only if not a Google Drive link)
  if (
    resource.cloudinary_public_id &&
    !resource.cloudinary_public_id.startsWith("gdrive-")
  ) {
    try {
      await cloudinary.uploader.destroy(resource.cloudinary_public_id, {
        resource_type: "raw",
      });
    } catch (e) {
      console.warn("Cloudinary delete warning:", e);
      // Continue with DB deletion even if Cloudinary fails
    }
  }

  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidateTag("resources", "max");
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: "Resource deleted." };
}

export async function updateResourceStatusAction(
  id: string,
  status: "DRAFT" | "PUBLISHED"
): Promise<ResourceAdminActionResult> {
  const { supabase } = await verifyAdmin();
  if (!supabase) return { error: "Unauthorized" };

  const { error } = await (supabase.from("resources") as any)
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidateTag("resources", "max");
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return {
    success: `Resource ${status === "PUBLISHED" ? "published" : "moved to draft"}.`,
  };
}
