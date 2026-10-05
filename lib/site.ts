import pages from "@/data/pages.json";

export const SITE_URL = "https://thecommerceclinic.com";

/** Canlı alan adına geçene kadar site arama motorlarına kapalı kalır.
 *  Vercel'de SITE_INDEXABLE=true verildiğinde index'e açılır. */
export const INDEXABLE = process.env.SITE_INDEXABLE === "true";

export type PageSlug = keyof typeof pages;
export type PageData = {
  route: string;
  title: string;
  description: string | null;
  robots: string | null;
  canonical: string | null;
  ogImage: string | null;
  colorScheme: string | null;
  bodyClass: string;
  early: string;
  jsonld: string | null;
  /** sayfa başka bir sayfanın davranış dosyasını kullanıyorsa (public/js/<js>.js) */
  js?: string;
};

export function getPage(slug: PageSlug): PageData {
  return pages[slug] as PageData;
}

export const PUBLIC_ROUTES = Object.values(pages as Record<string, PageData>)
  .filter((p) => p.route !== "/ornek-rapor" && !(p.robots ?? "").includes("noindex"))
  .map((p) => p.route);
