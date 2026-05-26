import type { NextConfig } from "next";

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
};

export default nextConfig;
