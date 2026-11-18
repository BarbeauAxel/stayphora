import type { MetadataRoute } from "next";
import { getContent } from "@/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { site } = getContent();
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/mentions-legales`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/confidentialite`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
