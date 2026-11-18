import type { MetadataRoute } from "next";
import { getContent } from "@/content";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const { site } = getContent();
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F5",
    theme_color: "#FAF8F5",
    lang: "fr",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
