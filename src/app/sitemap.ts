import type { MetadataRoute } from "next";
import { karaokeRooms } from "@/lib/content";
import { landingPages } from "@/lib/landing-pages";
import { site } from "@/lib/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.brand.url;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...landingPages.map((page) => ({
      url: `${base}/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...karaokeRooms.map((room) => ({
      url: `${base}/karaoke/${room.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
