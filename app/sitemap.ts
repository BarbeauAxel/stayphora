import type { MetadataRoute } from "next";
import { getContent } from "@/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { site, tours } = getContent();
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/guide-tournage`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    ...tours.map((tour) => ({
      url: `${site.url}/demo/${tour.slug}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { url: `${site.url}/mentions-legales`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/confidentialite`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
