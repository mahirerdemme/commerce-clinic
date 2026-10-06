// Bülten · sayı JSON'unu e-posta HTML'ine çevirir (lib/email/newsletter.ts şablonu)
// Çalıştır: node scripts/bulten/olustur.mjs scripts/bulten/ornek-sayi.json [base=https://thecommerceclinic.com] > sayi.html
import fs from "node:fs";
import { renderNewsletter } from "../../lib/email/newsletter.ts";

const [dosya, base = process.env.SITE_BASE ?? "https://thecommerceclinic.com"] = process.argv.slice(2);
if (!dosya) { console.error("Kullanım: node scripts/bulten/olustur.mjs <sayi.json> [base]"); process.exit(1); }
const sayi = JSON.parse(fs.readFileSync(dosya, "utf8"));
process.stdout.write(renderNewsletter(sayi, base.replace(/\/$/, "")));
