import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { INDEXABLE, SITE_URL } from "@/lib/site";

/**
 * Yasal metinler tek kaynaktan: public/legal/<slug>.html
 * - Site içinde linke tıklanınca sağdan açılan panelde gösterilir (public/js/legal.js)
 * - Adres doğrudan açılırsa (form, e-posta, arama) bu sayfa aynı metni gösterir
 */
export const LEGAL = {
  kvkk: "KVKK Aydınlatma Metni",
  gizlilik: "Gizlilik Politikası",
  "cerez-politikasi": "Çerez Politikası",
  "ticari-ileti": "Açık Rıza ve Ticari Elektronik İleti Onayı",
} as const;
export type LegalSlug = keyof typeof LEGAL;

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf8");

/** Logo, ana sayfa header'ındaki SVG'den alınır (tek kaynak) */
export function logoSvg() {
  const m = read("content/pages/home.html").match(/<a class="logo"[^>]*>(<svg[\s\S]*?<\/svg>)<\/a>/);
  return m ? m[1] : "Commerce Clinic";
}

export function legalMetadata(slug: LegalSlug): Metadata {
  return {
    title: { absolute: `${LEGAL[slug]} | Commerce Clinic` },
    alternates: { canonical: `${SITE_URL}/${slug}` },
    robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export function LegalPage({ slug }: { slug: LegalSlug }) {
  const doc = read(`public/legal/${slug}.html`);
  const others = (Object.keys(LEGAL) as LegalSlug[]).filter((s) => s !== slug);
  return (
    <div className="legal-page">
      <header className="legal-top">
        <a className="legal-logo" href="/" aria-label="Commerce Clinic ana sayfa" dangerouslySetInnerHTML={{ __html: logoSvg() }} />
        <a className="legal-back" href="/">Ana sayfa</a>
      </header>
      <main className="legal-main" dangerouslySetInnerHTML={{ __html: doc }} />
      <footer className="legal-foot">
        <span>© {new Date().getFullYear()} Commerce Clinic</span>
        <nav aria-label="Yasal metinler">
          {others.map((s) => (
            <a key={s} href={`/${s}`}>{LEGAL[s]}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
