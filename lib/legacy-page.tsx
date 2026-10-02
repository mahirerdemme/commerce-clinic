import fs from "node:fs";
import path from "node:path";
import type { Metadata, Viewport } from "next";
import { getPage, INDEXABLE, type PageSlug } from "@/lib/site";

/**
 * Prototip sayfalarını birebir yayınlar.
 * Markup: content/pages/<slug>.html · Stil: styles/<slug>.css · Davranış: public/js/<slug>.js
 * Sayfalar arası geçiş tam sayfa yüklemesidir; her sayfa yalnızca kendi CSS'ini yükler.
 */
export function legacyMetadata(slug: PageSlug): Metadata {
  const p = getPage(slug);
  const isReport = slug === "ornek-rapor";
  const index = INDEXABLE && !isReport && !(p.robots ?? "").includes("noindex");
  return {
    title: { absolute: p.title },
    description: p.description ?? undefined,
    alternates: p.canonical ? { canonical: p.canonical } : undefined,
    robots: index
      ? { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } }
      : { index: false, follow: false },
    authors: [{ name: "Mahir Erdem" }],
    openGraph: p.ogImage
      ? {
          type: "website",
          siteName: "Commerce Clinic",
          locale: "tr_TR",
          title: p.title,
          description: p.description ?? undefined,
          url: p.canonical ?? undefined,
          images: [{ url: p.ogImage, width: 1200, height: 630, alt: p.title }],
        }
      : undefined,
    twitter: p.ogImage
      ? { card: "summary_large_image", title: p.title, description: p.description ?? undefined, images: [p.ogImage] }
      : undefined,
  };
}

export function legacyViewport(slug: PageSlug): Viewport {
  const p = getPage(slug);
  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: "#0A0A0A",
    colorScheme: p.colorScheme === "dark" ? "dark" : "light",
  };
}

export function LegacyPage({ slug }: { slug: PageSlug }) {
  const p = getPage(slug);
  const html = fs.readFileSync(path.join(process.cwd(), "content/pages", `${slug}.html`), "utf8");
  const early = p.early + (p.bodyClass ? `document.body.classList.add(${JSON.stringify(p.bodyClass)});` : "");
  return (
    <>
      {early && <script dangerouslySetInnerHTML={{ __html: early }} />}
      {p.jsonld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: p.jsonld }} />}
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />
      <script src={`/js/${slug}.js`} />
    </>
  );
}
