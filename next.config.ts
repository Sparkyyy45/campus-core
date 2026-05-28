import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

const isProduction = process.env.NODE_ENV === "production";

// Hardened script-src: strictly omit 'unsafe-eval' in production builds to prevent XSS vectors,
// while leaving it enabled in development for source maps and Hot Module Replacement (HMR) support.
const scriptSrcDirective = isProduction
  ? "script-src 'self' 'unsafe-inline';"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval';";

const nextConfig: NextConfig = {
  // Enable Brotli/gzip response compression for all server responses
  compress: true,

  // Remove X-Powered-By header (security best practice — hides framework fingerprint)
  poweredByHeader: false,

  // Whitelist Cloudinary for next/image remote optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              `${scriptSrcDirective} ` +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: blob: https://res.cloudinary.com; " +
              "connect-src 'self' https://*.supabase.co https://res.cloudinary.com; " +
              "font-src 'self' data:; " +
              "object-src 'none'; " +
              "frame-ancestors 'none'; " +
              "base-uri 'self'; " +
              "form-action 'self';",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

const nextConfigWithAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);

export default withSentryConfig(nextConfigWithAnalyzer, {
  silent: true,
  // Only upload source maps if Sentry auth token is present to prevent local/CI builds from failing
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
    deleteSourcemapsAfterUpload: true,
  },
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
});
