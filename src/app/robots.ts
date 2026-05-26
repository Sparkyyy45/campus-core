import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/signup", "/forgot-password", "/reset-password"],
      disallow: [
        "/dashboard/",
        "/admin/",
        "/profile/",
        "/notes/",
        "/pyqs/",
        "/resources/",
        "/roadmap/",
        "/announcements/",
        "/api/",
        "/_next/",
        "/static/",
      ],
    },
    sitemap: "https://campuscore.systems/sitemap.xml",
  };
}
