// src/app/(dashboard)/resources/[id]/view/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export default async function ResourceViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: resource } = (await supabase
    .from("resources")
    .select("cloudinary_url")
    .eq("id", id)
    .single()) as { data: { cloudinary_url: string } | null };

  if (!resource || !resource.cloudinary_url) {
    redirect("/resources");
  }

  // Track as a resource download log asynchronously to avoid blocking the redirect
  supabase
    .from("resource_downloads")
    .insert({
      user_id: user.id,
      resource_id: id,
    } as any)
    .then(({ error }) => {
      if (error) {
        logger.warn("Failed to log auto-redirect view", {
          error: error.message,
        });
      }
    });

  redirect(resource.cloudinary_url);
}
