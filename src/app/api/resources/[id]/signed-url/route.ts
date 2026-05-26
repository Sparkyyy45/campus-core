// src/app/api/resources/[id]/signed-url/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSignedUrl } from "@/lib/cloudinary";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Fetch resource and verify access
  const { data: resource, error: resourceError } = (await supabase
    .from("resources")
    .select("cloudinary_public_id, cloudinary_url, branch_code, semester")
    .eq("id", id)
    .single()) as { data: { cloudinary_public_id: string; cloudinary_url: string; branch_code: string; semester: number } | null; error: any };

  if (resourceError || !resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  // 3. Detect download/redirect request
  const { searchParams } = new URL(request.url);
  const downloadRequested = searchParams.get("download") === "true";

  try {
    // Generate signed download URL (valid for 1 hour)
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    const signedUrl = getSignedUrl(resource.cloudinary_public_id, expiresAt, downloadRequested);

    // 5. Log download/view
    const { error: logError } = await supabase
      .from("resource_downloads")
      .insert({
        user_id: user.id,
        resource_id: id,
      } as any);

    if (logError) {
      console.warn("Failed to log download:", logError);
    }

    if (downloadRequested) {
      return NextResponse.redirect(signedUrl);
    }

    // Return the signed URL for inline browser view (application/pdf)
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Cloudinary error:", error);
    return NextResponse.json({ error: "Failed to generate access URL" }, { status: 500 });
  }
}
