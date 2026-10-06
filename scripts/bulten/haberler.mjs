// Bülten · aday haberleri toplar (yapay zekâ yok, yalnız RSS)
// Çalıştır: node scripts/bulten/haberler.mjs [gün=4] > /tmp/adaylar.json
// Çıktı: [{ kaynak, dil, baslik, link, tarih, ozet }] · seçimi ve özeti zamanlanmış Claude görevi yapar (scripts/bulten/README.md)

const KAYNAKLAR = [
  { ad: "Webrazzi", dil: "tr", url: "https://webrazzi.com/feed" },
  { ad: "Marketing Türkiye", dil: "tr", url: "https://www.marketingturkiye.com.tr/feed/" },
  { ad: "Google Search Central", dil: "en", url: "https://developers.google.com/search/blog/feed.xml" },
  { ad: "Search Engine Roundtable", dil: "en", url: "https://www.seroundtable.com/index.xml" },
  { ad: "Shopify", dil: "en", url: "https://www.shopify.com/news/feed" },
  { ad: "Modern Retail", dil: "en", url: "https://www.modernretail.co/feed/" },
  { ad: "Practical Ecommerce", dil: "en", url: "https://www.practicalecommerce.com/feed" },
  { ad: "Retail Dive", dil: "en", url: "https://www.retaildive.com/feeds/news/" },
  { ad: "TechCrunch Commerce", dil: "en", url: "https://techcrunch.com/category/commerce/feed/" },
];

const gun = Number(process.argv[2] ?? 4);
const sinir = Date.now() - gun * 864e5;

const ent = (s) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[e])
    .replace(/\s+/g, " ")
    .trim();
const al = (blok, ...etiket) => {
  for (const e of etiket) {
    const m = blok.match(new RegExp(`<${e}(?:\\s[^>]*)?>([\\s\\S]*?)</${e}>`, "i"));
    if (m) return m[1];
  }
  return "";
};
const link = (blok) => ent(al(blok, "link")) || (blok.match(/<link[^>]*href="([^"]+)"/i) || [])[1] || "";

async function oku(k) {
  try {
    const r = await fetch(k.url, { headers: { "user-agent": "Mozilla/5.0 CommerceClinicBulten" }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const xml = await r.text();
    const bloklar = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/g) ?? [];
    return bloklar
      .map((b) => {
        const tarih = new Date(ent(al(b, "pubDate", "published", "updated", "dc:date")));
        return {
          kaynak: k.ad,
          dil: k.dil,
          baslik: ent(al(b, "title")),
          link: link(b),
          tarih: isNaN(tarih) ? null : tarih.toISOString(),
          ozet: ent(al(b, "description", "summary", "content")).slice(0, 600),
        };
      })
      .filter((h) => h.baslik && h.link && (!h.tarih || Date.parse(h.tarih) >= sinir));
  } catch (e) {
    console.error(`! ${k.ad}: ${e.message}`);
    return [];
  }
}

const hepsi = (await Promise.all(KAYNAKLAR.map(oku))).flat();
hepsi.sort((a, b) => (b.tarih ?? "").localeCompare(a.tarih ?? ""));
console.error(`${hepsi.length} aday haber (son ${gun} gün)`);
console.log(JSON.stringify(hepsi, null, 1));
