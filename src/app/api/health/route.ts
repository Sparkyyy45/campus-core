// src/app/api/health/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check database connection by querying active resource types (publicly readable under RLS)
    const { error } = await supabase
      .from("resource_types")
      .select("name")
      .limit(1);

    if (error) {
      console.error("Health check DB connection error:", error);
      return NextResponse.json(
        { status: "unhealthy", error: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { status: "healthy", timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (err) {
    console.error("Health check error:", err);
    return NextResponse.json(
      { status: "unhealthy", error: (err as Error).message },
      { status: 503 }
    );
  }
}
