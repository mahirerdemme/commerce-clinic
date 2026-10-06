// Bülten · bir sayıyı e-postayla gönderir (Resend)
// Test (tek adrese): node --env-file=.env.local scripts/bulten/gonder.mjs scripts/bulten/sayilar/2026-10-06.json --test adres@ornek.com
// Alan adı Resend'de doğrulanana kadar gönderen onboarding@resend.dev olur ve yalnız Resend hesabının sahibine gidebilir.
import fs from "node:fs";
import { renderNewsletter } from "../../lib/email/newsletter.ts";

const args = process.argv.slice(2);
const dosya = args[0];
const test = args[args.indexOf("--test") + 1];
if (!dosya || !args.includes("--test") || !test) {
  console.error("Kullanım: node --env-file=.env.local scripts/bulten/gonder.mjs <sayi.json> --test <adres>");
  process.exit(1);
}
const key = process.env.RESEND_API_KEY;
if (!key) { console.error("RESEND_API_KEY yok"); process.exit(1); }

const base = (process.env.SITE_BASE ?? "https://commerce-clinic-ashen.vercel.app").replace(/\/$/, "");
const from = process.env.BULTEN_FROM ?? "Commerce Notes <onboarding@resend.dev>";
const sayi = JSON.parse(fs.readFileSync(dosya, "utf8"));

const r = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    from,
    to: [test],
    subject: `[Test] ${sayi.subject}`,
    html: renderNewsletter(sayi, base).replace("{{{RESEND_UNSUBSCRIBE_URL}}}", `${base}/blog`),
  }),
});
const out = await r.json();
if (!r.ok) { console.error("Gönderilemedi:", r.status, out); process.exit(1); }
console.log("Gönderildi:", out.id, "→", test);
