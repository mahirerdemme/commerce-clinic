import fs from "node:fs";
import path from "node:path";
import type { Metadata, Viewport } from "next";
import { getPage, INDEXABLE, type PageSlug } from "@/lib/site";

/**
 * Prototip sayfalarını birebir yayınlar.
 * Markup: content/pages/<slug>.html (+ ortak parçalar content/partials/) · Stil: styles/<slug>.css · Davranış: public/js/<slug>.js
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
          type: p.route.startsWith("/blog/") ? "article" : "website",
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

const read = (...p: string[]) => fs.readFileSync(path.join(process.cwd(), ...p), "utf8");

/**
 * Ortak parçalar tek kaynaktan: content/partials/{header,footer,gp}.html
 * Sayfa HTML'inde <!--#header--> <!--#footer--> <!--#gp--> işaretlerinin yerine konur; sayfaya özgü farklar burada uygulanır:
 * logo linki, menüde aktif sayfa, koyu tema, blog listesinde "Tüm notları oku" linki, formun kaynak sayfası.
 */
function withShared(slug: PageSlug, html: string) {
  const p = getPage(slug);
  let header = read("content/partials/header.html").trim();
  let footer = read("content/partials/footer.html").trim();
  let gp = read("content/partials/gp.html").trim();
  if (p.route !== "/") {
    const self = slug === "commerce-notes" ? "#liste" : "#top";
    const sub = (s: string) =>
      s
        .replace('<a class="logo" href="#top"', '<a class="logo" href="/" data-go')
        .replace(`<a href="${p.route}" data-go>`, `<a href="${self}" aria-current="page">`);
    header = sub(header);
    footer = sub(footer);
  }
  if (p.colorScheme === "dark") header = header.replace('<header class="header"', '<header class="header theme-dark"');
  if (slug === "commerce-notes") {
    footer = footer.replace('<a class="f-all" href="/blog" data-go>', '<a class="f-all" href="#liste">');
  }
  gp = gp.replace('name="source_page" value="home"', `name="source_page" value="${slug}"`);
  return html.replace("<!--#header-->", header).replace("<!--#footer-->", footer).replace("<!--#gp-->", gp);
}

export function LegacyPage({ slug }: { slug: PageSlug }) {
  const p = getPage(slug);
  const html = withShared(slug, read("content/pages", `${slug}.html`));
  const early = p.early + (p.bodyClass ? `document.body.classList.add(${JSON.stringify(p.bodyClass)});` : "");
  return (
    <>
      {early && <script dangerouslySetInnerHTML={{ __html: early }} />}
      {p.jsonld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: p.jsonld }} />}
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />
      <script src={`/js/${p.js ?? slug}.js`} />
    </>
  );
}
