import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site";
import { yayinda } from "@/lib/blog-takvim";

// Yayın saati gelmemiş yazılar sitemap'e girmez (lib/blog-takvim.ts)
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.filter((route) => yayinda(route)).map((route) => ({
    url: `${SITE_URL}${route === "/" ? "/" : route}`,
    changeFrequency: route === "/blog" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
