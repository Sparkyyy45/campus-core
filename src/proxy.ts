// src/proxy.ts
// Root proxy router — runs on every matched request (Next.js 16 convention)
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  apiRateLimiter,
  authRateLimiter,
  globalRateLimiter,
} from "@/lib/rate-limit";

export async function proxy(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "anonymous";
  const path = request.nextUrl.pathname;

  // Choose rate limiter based on path
  let limiter = globalRateLimiter;
  if (
    path.startsWith("/api/auth") ||
    path === "/login" ||
    path === "/signup" ||
    path === "/reset-password"
  ) {
    limiter = authRateLimiter;
  } else if (path.startsWith("/api/")) {
    limiter = apiRateLimiter;
  }

  const { success, limit, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
        "Retry-After": reset.toString(),
      },
    });
  }

  // If rate limit passed, continue to update session
  const response = await updateSession(request);

  // Attach rate limit headers to the successful response
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", reset.toString());

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
