import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          // Machine-translated Spanish, pending medical-translator review.
          // Also noindex'd via metadata; this keeps crawl budget off it too.
          "/es/",
          // The PWA service-worker fallback shell has no standalone value.
          "/offline",
          "/es/offline"
        ]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
