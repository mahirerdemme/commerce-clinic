// Bülten · cuma sayısı: daha önce bültende kullanılmamış en eski blog yazısını seçip sayı JSON'una çevirir
// Çalıştır: node scripts/bulten/yazi-sec.mjs [--kuru]
//   Kaynak liste: scripts/bulten/yazilar.json (tarih sırası; yeni yazı yayınlanınca sona eklenir).
//   Kullanılmış sayılır: sayilar/ içinde kind "yazi" olan bir sayının düğme adresi yazının slug'ını taşıyorsa.
//   Çıktı: scripts/bulten/sayilar/<bugün>.json (İstanbul tarihi); --kuru yalnız ekrana yazar.
//   Seçilecek yazı yoksa hiçbir şey yazmaz ve "Gönderilecek yazı yok" der (çıkış kodu 0).
import fs from "node:fs";
import path from "node:path";

const kuru = process.argv.includes("--kuru");
const dir = "scripts/bulten/sayilar";
const yazilar = JSON.parse(fs.readFileSync("scripts/bulten/yazilar.json", "utf8")).sort((a, b) => a.tarih.localeCompare(b.tarih));
const sayilar = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort().map((f) => ({ f, ...JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) }));

const kullanilan = new Set(sayilar.filter((s) => s.kind === "yazi").flatMap((s) => s.items.map((i) => i.url)));
const sira = yazilar.find((y) => ![...kullanilan].some((u) => u.includes(`/blog/${y.slug}`)));
if (!sira) { console.log("Gönderilecek yazı yok: listedeki tüm yazılar bültende kullanıldı."); process.exit(0); }

const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const [yil, ay, gun] = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Istanbul" }).format(new Date()).split("-").map(Number);
let id = `${yil}-${String(ay).padStart(2, "0")}-${String(gun).padStart(2, "0")}`;
if (fs.existsSync(path.join(dir, `${id}.json`))) id += "-2"; // aynı gün ikinci sayı

const son = sayilar.at(-1);
const sayi = {
  kind: "yazi",
  subject: sira.konu,
  preheader: sira.onizleme,
  date: `${gun} ${AYLAR[ay - 1]} ${yil}`,
  issue: Math.max(0, ...sayilar.map((s) => s.issue)) + 1,
  items: [{
    tag: sira.tag,
    title: sira.title,
    summary: sira.summary,
    url: `https://thecommerceclinic.com/blog/${sira.slug}?utm_source=bulten&utm_medium=email&utm_campaign=yazi-${sira.slug}`,
    source: "Commerce Notes",
    button: "Yazının devamı",
  }],
  cta: son?.cta,
};

if (kuru) { console.log(`(kuru) ${id}.json\n` + JSON.stringify(sayi, null, 2)); process.exit(0); }
fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(sayi, null, 2) + "\n");
console.log(`Yazıldı: ${dir}/${id}.json · yazı: ${sira.slug} · sayı ${sayi.issue}`);
