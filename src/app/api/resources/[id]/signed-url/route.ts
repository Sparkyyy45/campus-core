// src/app/api/resources/[id]/signed-url/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSignedUrl } from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { logger } from "@/lib/logger";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // Validate UUID to prevent DB execution syntax crashes
  const uuidSchema = z.string().uuid();
  if (!uuidSchema.safeParse(id).success) {
    logger.warn("Invalid resource UUID format requested", { resourceId: id });
    return NextResponse.json(
      { error: "Invalid resource ID format" },
      { status: 400 }
    );
  }

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate Limiting (30 requests per minute per student)
  const limiterKey = `signed-url:${user.id}`;
  const limitRes = rateLimit(limiterKey, 30, 60000);
  if (!limitRes.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limitRes.reset),
        },
      }
    );
  }

  // 2. Fetch resource and verify access
  const { data: resource, error: resourceError } = (await supabase
    .from("resources")
    .select("cloudinary_public_id, cloudinary_url, branch_code, semester")
    .eq("id", id)
    .single()) as {
    data: {
      cloudinary_public_id: string;
      cloudinary_url: string;
      branch_code: string;
      semester: number;
    } | null;
    error: any;
  };

  if (resourceError || !resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  // 3. Detect download/redirect request
  const { searchParams } = new URL(request.url);
  const downloadRequested = searchParams.get("download") === "true";

  try {
    // Generate signed download URL (valid for 1 hour)
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    const signedUrl = getSignedUrl(
      resource.cloudinary_public_id,
      expiresAt,
      downloadRequested
    );

    if (downloadRequested) {
      // Only log actual downloads, not inline preview views
      const { error: logError } = await supabase
        .from("resource_downloads")
        .insert({
          user_id: user.id,
          resource_id: id,
        } as any);

      if (logError) {
        logger.warn("Failed to log download", {
          userId: user.id,
          resourceId: id,
          error: logError.message,
        });
      }

      logger.info("Resource download redirected", {
        userId: user.id,
        resourceId: id,
      });
      return NextResponse.redirect(signedUrl);
    }

    // Return the signed URL for inline browser view (application/pdf)
    // Cache for 45 min — browser will serve from cache on back-navigation
    logger.info("Resource inline view signed URL generated", {
      userId: user.id,
      resourceId: id,
    });
    return NextResponse.json(
      { url: signedUrl },
      {
        headers: {
          "Cache-Control": "private, max-age=2700",
        },
      }
    );
  } catch (error) {
    logger.error("Cloudinary signed URL error", {
      userId: user?.id,
      resourceId: id,
      error: (error as Error).message,
    });
    return NextResponse.json(
      { error: "Failed to generate access URL" },
      { status: 500 }
    );
  }
}
