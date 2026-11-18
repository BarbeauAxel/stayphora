import type { MetadataRoute } from "next";
import { getContent } from "@/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const { site } = getContent();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
