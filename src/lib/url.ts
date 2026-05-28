// src/lib/url.ts

/**
 * Safely resolves the absolute application URL.
 * Automatically handles Vercel preview environments and cleans trailing slashes.
 */
export function getAppUrl(): string {
  let url =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000");

  // Clean trailing slashes
  url = url.replace(/\/+$/, "");

  return url;
}
