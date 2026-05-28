// src/app/api/admin/upload-signature/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate Limiting (10 requests per minute per admin)
  const limiterKey = `upload-sig:${user.id}`;
  const limitRes = rateLimit(limiterKey, 10, 60000);
  if (!limitRes.success) {
    logger.warn("Admin signature generation rate limited", { userId: user.id });
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

  // Verify admin
  const { data: profile } = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()) as { data: { role: string } | null; error: unknown };

  if (profile?.role !== "ADMIN") {
    logger.warn("Non-admin attempted signature generation", {
      userId: user.id,
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { folder } = await request
    .json()
    .catch(() => ({ folder: "campuscore" }));

  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    folder: folder || "campuscore/resources",
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  logger.info("Admin upload signature generated", {
    userId: user.id,
    folder: params.folder,
  });

  return NextResponse.json({
    signature,
    timestamp,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    folder: params.folder,
  });
}
