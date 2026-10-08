import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

// Crawling is allowed everywhere except the assistant API. The sitemap line
// appears only once SITE_URL is set.
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
