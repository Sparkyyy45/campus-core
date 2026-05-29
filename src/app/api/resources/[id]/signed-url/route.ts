// src/app/api/resources/[id]/signed-url/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
    const documentUrl = resource.cloudinary_url;

    if (downloadRequested) {
      // Log downloads asynchronously to avoid blocking the redirect response
      supabase
        .from("resource_downloads")
        .insert({
          user_id: user.id,
          resource_id: id,
        } as any)
        .then(({ error: logError }) => {
          if (logError) {
            logger.warn("Failed to log download", {
              userId: user.id,
              resourceId: id,
              error: logError.message,
            });
          }
        });

      logger.info("Resource download redirected to document URL", {
        userId: user.id,
        resourceId: id,
      });
      return NextResponse.redirect(documentUrl);
    }

    // Return the document URL for inline views
    logger.info("Resource document URL returned", {
      userId: user.id,
      resourceId: id,
    });
    return NextResponse.json(
      { url: documentUrl },
      {
        headers: {
          "Cache-Control": "private, max-age=2700",
        },
      }
    );
  } catch (error) {
    logger.error("Signed URL logic error", {
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
