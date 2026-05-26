// src/app/api/admin/upload-signature/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate Limiting (10 requests per minute per admin)
  const RATE_LIMIT_DURATION = 60000; // 1 minute
  const MAX_REQUESTS = 10;
  const now = Date.now();
  const userRateLimit = rateLimitMap.get(user.id);
  
  if (userRateLimit && userRateLimit.resetTime > now) {
    if (userRateLimit.count >= MAX_REQUESTS) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }
    userRateLimit.count += 1;
  } else {
    rateLimitMap.set(user.id, { count: 1, resetTime: now + RATE_LIMIT_DURATION });
  }

  // Verify admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null; error: unknown };

  if (profile?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { folder } = await request.json().catch(() => ({ folder: "campuscore" }));

  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    folder: folder || "campuscore/resources",
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    folder: params.folder,
  });
}
