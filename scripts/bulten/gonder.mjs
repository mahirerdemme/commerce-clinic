// Bülten · bir sayıyı e-postayla gönderir (Resend)
// Önizleme (onaya): node --env-file=.env.local scripts/bulten/gonder.mjs scripts/bulten/sayilar/2026-10-06.json --onizleme
//   → BULTEN_ONAY_TO adresine, üstünde "Onayla ve gönder" olan önizleme gider. Onay sayfası sayıyı sitedeki
//     scripts/bulten/sayilar/<id>.json'dan okur; bu yüzden sayı önce repoya gönderilmiş (yayında) olmalı.
// Test (tek adrese, onaysız): ... gonder.mjs <sayi.json> --test adres@ornek.com
// Abonelere gönderim yalnız onay sayfasından yapılır (lib/email/bulten.ts).
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { renderNewsletter } from "../../lib/email/newsletter.ts";

const args = process.argv.slice(2);
const dosya = args[0];
const onizleme = args.includes("--onizleme");
const test = args.includes("--test") ? args[args.indexOf("--test") + 1] : null;
if (!dosya || (!onizleme && !test)) {
  console.error("Kullanım: node --env-file=.env.local scripts/bulten/gonder.mjs <sayi.json> --onizleme | --test <adres>");
  process.exit(1);
}
const { RESEND_API_KEY: key, BULTEN_SECRET: secret, BULTEN_ONAY_TO: onayTo } = process.env;
if (!key) { console.error("RESEND_API_KEY yok"); process.exit(1); }

const base = (process.env.SITE_BASE ?? "https://commerce-clinic-ashen.vercel.app").replace(/\/$/, "");
const from = process.env.BULTEN_FROM ?? "Commerce Notes <onboarding@resend.dev>";
const id = path.basename(dosya, ".json");
const sayi = JSON.parse(fs.readFileSync(dosya, "utf8"));

let to, subject, html;
if (onizleme) {
  if (!secret || !onayTo) { console.error("BULTEN_SECRET ve BULTEN_ONAY_TO gerekli"); process.exit(1); }
  // imza lib/email/bulten.ts · imza() ile aynı olmalı
  const t = crypto.createHmac("sha256", secret).update(`bulten:${id}`).digest("hex").slice(0, 32);
  const onay = `${base}/bulten/onay?id=${encodeURIComponent(id)}&t=${t}`;
  to = onayTo.split(",").map((s) => s.trim()).filter(Boolean);
  subject = `[Onay bekliyor] ${sayi.subject}`;
  html = renderNewsletter(sayi, base, { onay });
  console.log("Onay sayfası:", onay);
  // sayı repoya gönderildikten sonra sitenin yeniden yayına çıkması birkaç dakika sürer; onay sayfası sayıyı görene kadar bekle
  if (!args.includes("--beklemeden")) {
    const son = Date.now() + 15 * 60e3;
    for (;;) {
      const html = await fetch(onay, { cache: "no-store" }).then((r) => r.text()).catch(() => "");
      if (html && !html.includes("Bağlantı geçersiz")) break;
      if (Date.now() > son) { console.error("Sayı 15 dakikada sitede görünmedi; önizleme gönderilmedi."); process.exit(1); }
      console.log("Sayı henüz yayında değil, bekleniyor…");
      await new Promise((r) => setTimeout(r, 30e3));
    }
  }
} else {
  to = [test];
  subject = `[Test] ${sayi.subject}`;
  html = renderNewsletter(sayi, base);
}
html = html.replace("{{{RESEND_UNSUBSCRIBE_URL}}}", `${base}/blog`);

const r = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ from, to, subject, html }),
});
const out = await r.json();
if (!r.ok) { console.error("Gönderilemedi:", r.status, out); process.exit(1); }
console.log("Gönderildi:", out.id, "→", to.join(", "));
