import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * The page and its research note are the public surface. The API is not
 * crawlable anyway, and `/lab` is an engine testbed rather than content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/lab"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
