/**
 * Commerce Notes bülteni · e-posta şablonu
 * E-posta programları (Gmail, Outlook, Apple Mail) için: tablo düzeni, satır içi stil, sistem fontları, 600px genişlik.
 * Resend Broadcast'te gönderilir; {{{RESEND_UNSUBSCRIBE_URL}}} Resend tarafından kişiye özel abonelikten çıkma linkiyle değiştirilir.
 * Önizleme: /api/bulten/onizleme (yalnız geliştirmede)
 */

export type NewsItem = {
  /** kısa etiket: "Pazaryeri", "Ödeme", "Arama" … */
  tag: string;
  title: string;
  /** en fazla 2 kısa cümle; kaynağın metni değil, özet */
  summary: string;
  /** "Markalar için anlamı" satırı */
  takeaway?: string;
  url: string;
  /** görünen kaynak adı: "Webrazzi", "Google Search Central" … */
  source: string;
  /** doluysa özetin altında düğme çıkar ("Yazının devamı"); cuma yazı sayısında kullanılır */
  button?: string;
  /** isteğe bağlı küçük görsel (kendi görselimiz ya da kullanım izni olan); yoksa yalnız metin */
  image?: string;
};

export type Newsletter = {
  /** e-posta konu satırı */
  subject: string;
  /** gelen kutusunda konunun yanında görünen kısa metin */
  preheader: string;
  /** "7 Ekim 2026" */
  date: string;
  issue: number;
  /** gündem: salı haber derlemesi (varsayılan); yazı: cuma blog yazısı önizlemesi (items[0] yazıdır) */
  kind?: "gundem" | "yazi";
  items: NewsItem[];
  /** "Kısa kısa": tek satırlık haberler */
  briefs?: { title: string; url: string; source: string }[];
  cta?: { eyebrow: string; title: string; text: string; label: string; url: string };
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const C = { ink: "#111111", text2: "#5F5F5D", line: "#E5E5E3", bg: "#F5F5F3", white: "#FFFFFF", dark: "#0A0A0A", muted: "#A3A3A1", tint: "#F6F3FC", accent: "#7C5CE0" };

/** hafif rozet: kategori ve kaynak etiketleri */
const badge = (inner: string, extra = "") =>
  `<span style="display:inline-block;padding:5px 10px;border-radius:999px;background:#F0F0EE;font:600 11px/1 ${FONT};letter-spacing:.06em;text-transform:uppercase;color:${C.text2};${extra}">${inner}</span>`;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** kaynağa giden linklere bülten etiketi eklenir; analitikte "bülten" kanalı olarak görünür */
const utm = (url: string, issue: number) => {
  try {
    const u = new URL(url);
    if (!/thecommerceclinic\.com$/.test(u.hostname)) return url;
    u.searchParams.set("utm_source", "bulten");
    u.searchParams.set("utm_medium", "email");
    u.searchParams.set("utm_campaign", `sayi-${issue}`);
    return u.toString();
  } catch {
    return url;
  }
};

function item(n: NewsItem, i: number, issue: number) {
  const href = esc(utm(n.url, issue));
  const text = `
    <p style="margin:0 0 10px">${badge(esc(n.tag))}</p>
    <h2 style="margin:0;font:600 ${n.button ? 22 : 18}px/1.35 ${FONT};letter-spacing:-.01em;color:${C.ink}"><a href="${href}" style="color:${C.ink};text-decoration:none">${esc(n.title)}</a></h2>
    <p style="margin:8px 0 0;font:400 15px/1.55 ${FONT};color:#3A3A39">${esc(n.summary)}</p>
    ${n.takeaway ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 0"><tr><td style="background:${C.tint};border-left:3px solid ${C.accent};border-radius:0 10px 10px 0;padding:12px 16px">
      <p style="margin:0 0 5px;font:600 11px/1 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${C.accent}">Markalar için</p>
      <p style="margin:0;font:400 14px/1.5 ${FONT};color:${C.ink}">${esc(n.takeaway)}</p>
    </td></tr></table>` : ""}
    ${n.button
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0"><tr><td style="background:${C.dark};border-radius:10px"><a href="${href}" style="display:inline-block;padding:13px 20px;font:600 14px/1 ${FONT};color:${C.white};text-decoration:none">${esc(n.button)} &rarr;</a></td></tr></table>`
      : `<p style="margin:14px 0 0"><a href="${href}" style="text-decoration:none">${badge(`${esc(n.source)} &#8599;`, "border:1px solid " + C.line + ";background:" + C.white)}</a></p>`}`;
  return `
<tr><td style="padding:${i ? "24px" : "0"} 0 0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"${i ? ` style="border-top:1px solid ${C.line}"` : ""}><tr>
    <td valign="top" style="padding-top:${i ? "24px" : "0"}">${text}</td>
    ${n.image ? `<td valign="top" width="112" style="padding:${i ? "24px" : "0"} 0 0 20px"><a href="${href}"><img src="${esc(n.image)}" width="112" height="84" alt="" style="display:block;border:0;border-radius:10px;width:112px;height:84px;object-fit:cover"></a></td>` : ""}
  </tr></table>
</td></tr>`;
}

/** sayının kapak görseli: app/api/bulten/kapak */
export const coverUrl = (d: Newsletter, base: string) =>
  `${base}/api/bulten/kapak?${new URLSearchParams({ sayi: String(d.issue), tarih: d.date, konular: [...new Set(d.items.map((n) => n.tag))].slice(0, 3).join(","), ...(d.kind === "yazi" ? { tur: "yazi" } : {}) })}`;

/** onay: yalnız onaya giden önizlemede; üstte "Onayla ve gönder" çubuğu çıkar */
export function renderNewsletter(d: Newsletter, base: string, opts: { onay?: string; web?: string } = {}) {
  const site = (path: string) => utm(`${base}${path}`, d.issue);
  return `<!doctype html>
<html lang="tr" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(d.subject)}</title>
<style>
  @media (max-width:620px){ .px{padding-left:20px!important;padding-right:20px!important} .h1{font-size:26px!important} }
  a{color:${C.ink}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${esc(d.preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg}"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">

  ${opts.onay ? `
  <!-- onay çubuğu: yalnız önizleme -->
  <tr><td style="padding:0 0 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFF8E6;border:1px solid #F0DDA8;border-radius:12px"><tr>
      <td class="px" style="padding:16px 20px;font:400 14px/1.5 ${FONT};color:${C.ink}"><b style="font-weight:600">Önizleme.</b> Bu sayı henüz kimseye gönderilmedi. Uygunsa onaylayın; onaylamazsanız gönderilmez.</td>
      <td align="right" style="padding:12px 16px 12px 0;white-space:nowrap"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${C.dark};border-radius:10px"><a href="${esc(opts.onay)}" style="display:inline-block;padding:11px 16px;font:600 14px/1 ${FONT};color:${C.white};text-decoration:none">Onayla ve gönder</a></td></tr></table></td>
    </tr></table>
  </td></tr>` : ""}

  ${opts.web ? `<!-- tarayıcı sürümü bağlantısı -->
  <tr><td class="px" style="padding:0 8px 12px;font:500 12px/1 ${FONT};color:${C.text2};text-align:right"><a href="${esc(opts.web)}" style="color:${C.text2};text-decoration:underline">Tarayıcıda aç</a></td></tr>` : ""}

  <!-- kart -->
  <tr><td style="background:${C.white};border:1px solid ${C.line};border-radius:16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:0;line-height:0;font-size:0">
        <img src="${esc(coverUrl(d, base))}" width="600" alt="Commerce Notes · Sayı ${d.issue} · Bu hafta e-ticarette" style="display:block;border:0;width:100%;height:auto;border-radius:15px 15px 0 0">
      </td></tr>
      <tr><td class="px" style="padding:32px 40px 36px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${d.items.map((n, i) => item(n, i, d.issue)).join("")}
        </table>
      </td></tr>
      ${d.briefs?.length ? `
      <tr><td class="px" style="padding:0 40px 36px">
        <p style="margin:0 0 4px;padding-top:28px;border-top:1px solid ${C.line}">${badge("Kısa kısa")}</p>
        ${d.briefs.map((b) => `<p style="margin:14px 0 0;font:400 14px/1.5 ${FONT};color:${C.ink}"><a href="${esc(b.url)}" style="color:${C.ink};text-decoration:none">${esc(b.title)}</a> <a href="${esc(b.url)}" style="text-decoration:none">${badge(`${esc(b.source)} &#8599;`, "padding:3px 8px;font-size:10px;border:1px solid " + C.line + ";background:" + C.white + ";white-space:nowrap")}</a></p>`).join("")}
      </td></tr>` : ""}
    </table>
  </td></tr>

  ${d.cta ? `
  <!-- CTA -->
  <tr><td style="padding-top:16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.dark}" style="background-color:${C.dark};background-image:radial-gradient(60% 90% at 100% 100%,rgba(229,131,160,.55) 0%,rgba(243,150,117,.25) 40%,rgba(10,10,10,0) 75%),radial-gradient(50% 80% at 0% 0%,rgba(139,92,246,.35) 0%,rgba(10,10,10,0) 70%);border-radius:16px"><tr><td class="px" style="padding:32px 40px">
      <p style="margin:0 0 10px;font:500 12px/1 ${FONT};color:${C.muted}">${esc(d.cta.eyebrow)}</p>
      <p style="margin:0;font:600 21px/1.3 ${FONT};letter-spacing:-.015em;color:${C.white}">${esc(d.cta.title)}</p>
      <p style="margin:10px 0 22px;font:400 14px/1.6 ${FONT};color:${C.muted}">${esc(d.cta.text)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:${C.white};border-radius:10px"><a href="${esc(site(d.cta.url))}" style="display:inline-block;padding:13px 20px;font:600 14px/1 ${FONT};color:${C.dark};text-decoration:none">${esc(d.cta.label)}</a></td>
        <td width="10"></td>
        <td style="background:${C.white};border-radius:10px"><a href="${esc(site("/"))}" style="display:inline-block;padding:13px 20px;font:600 14px/1 ${FONT};color:${C.dark};text-decoration:none">Siteyi ziyaret et &#8599;</a></td>
      </tr></table>
    </td></tr></table>
  </td></tr>` : ""}

  <!-- alt bilgi: gönderen ve ret bağlantısı (6563 sayılı Kanun · ticari ileti) -->
  <tr><td class="px" style="padding:28px 8px 0;font:400 12px/1.6 ${FONT};color:${C.text2}">
    <p style="margin:0">Bu e-postayı Commerce Notes bültenine abone olduğunuz için alıyorsunuz. E-ticarette markaları ilgilendiren gelişmeler ve yazılar.</p>
    <p style="margin:10px 0 0"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:${C.text2};text-decoration:underline">Abonelikten çık</a> · <a href="${site("/blog")}" style="color:${C.text2};text-decoration:underline">Commerce Notes</a> · <a href="${base}/ticari-ileti" style="color:${C.text2};text-decoration:underline">Ticari ileti bilgilendirmesi</a></p>
    <p style="margin:10px 0 0">Commerce Clinic</p>
  </td></tr>

</table>
</td></tr></table>
</body>
</html>`;
}

/** Önizleme için örnek sayı. Haberler kurgusal, yalnız şablonun görünümü için. */
export const SAMPLE: Newsletter = {
  subject: "Bu hafta e-ticarette: kargo eşikleri, GA4 değişikliği ve pazaryeri komisyonları",
  preheader: "5 gelişme ve markalar için anlamı. Okuma süresi 4 dakika.",
  date: "7 Ekim 2026",
  issue: 1,
  items: [
    {
      tag: "Ölçüm",
      title: "[Örnek] GA4'te satın alma olaylarının raporlanmasında değişiklik",
      summary: "Örnek özet: Satın alma olaylarının raporlarda gruplanması değişiyor; bazı özel raporlar yeniden düzenlenmeli.",
      takeaway: "Kasımdan önce panel ve GA4 sipariş sayılarını karşılaştırın.",
      url: "https://example.com/haber-1",
      source: "Örnek kaynak",
    },
    {
      tag: "Pazaryeri",
      title: "[Örnek] Bir pazaryeri kategori bazlı komisyon oranlarını güncelledi",
      summary: "Örnek özet: Bazı kategorilerde komisyon oranları ay başından itibaren değişiyor.",
      takeaway: "Kanal bazlı kârlılığı yeniden hesaplayın.",
      url: "https://example.com/haber-2",
      source: "Örnek kaynak",
    },
    {
      tag: "Kargo",
      title: "[Örnek] Kargo firmalarından yoğun dönem için ek teslim süresi duyurusu",
      summary: "Örnek özet: Kasım kampanyalarında teslim süreleri uzayabilir.",
      takeaway: "Ürün sayfasındaki tahmini teslim tarihini güncelleyin.",
      url: "https://example.com/haber-3",
      source: "Örnek kaynak",
    },
  ],
  briefs: [
    { title: "[Örnek] Arama sonuçlarında ürün yorumlarının görünümü değişiyor", url: "https://example.com/k1", source: "Örnek kaynak" },
    { title: "[Örnek] Bir ödeme kuruluşu yeni taksit kampanyasını açıkladı", url: "https://example.com/k2", source: "Örnek kaynak" },
  ],
  cta: {
    eyebrow: "Ücretsiz rehber",
    title: "E-ticaret altyapısı değiştirirken 12 adımlık rehber",
    text: "78 maddelik kontrol listesi, ekibinizle birlikte.",
    label: "Rehberi al",
    url: "/rehber/e-ticaret-altyapi-gecisi",
  },
};
