// Sosyal · onaylanan Instagram gönderisini paylaşım kuyruğuna ekler
// Kullanım: node scripts/sosyal/kuyruga-ekle.mjs <gönderi-klasörü> "2026-10-30 12:00"   (saat İstanbul saati)
//   Gönderi önce `python3 design/sosyal/uret.py --jpg` ile JPEG olarak üretilmiş olmalı.
//   JPEG'ler public/sosyal/<gönderi>/ altına kopyalanır (Instagram görseli bu adresten çeker),
//   altyazı ve zaman scripts/sosyal/kuyruk.json'a yazılır. Kuyruğu GitHub Actions paylaşır (paylas.mjs).
import fs from "node:fs";
import path from "node:path";

const [post, zamanMetni] = process.argv.slice(2);
if (!post || !zamanMetni) {
  console.error('Kullanım: node scripts/sosyal/kuyruga-ekle.mjs <gönderi-klasörü> "YYYY-MM-DD SS:DD"');
  process.exit(1);
}
const kaynak = path.join("design/sosyal", post);
const jpgler = fs.existsSync(kaynak) ? fs.readdirSync(kaynak).filter((f) => /^slayt-\d+\.jpg$/.test(f)).sort((a, b) => parseInt(a.slice(6)) - parseInt(b.slice(6))) : [];
if (!jpgler.length) { console.error(`${kaynak} içinde slayt-N.jpg yok; önce uret.py --jpg çalıştır`); process.exit(1); }
const m = zamanMetni.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/);
if (!m) { console.error("Zaman biçimi: YYYY-MM-DD SS:DD"); process.exit(1); }
const zaman = new Date(`${m[1]}T${m[2]}:00+03:00`);
if (zaman < new Date()) { console.error("Bu zaman geçmişte"); process.exit(1); }

const hedef = path.join("public/sosyal", post);
fs.mkdirSync(hedef, { recursive: true });
for (const f of jpgler) fs.copyFileSync(path.join(kaynak, f), path.join(hedef, f));

const dosya = "scripts/sosyal/kuyruk.json";
const kuyruk = JSON.parse(fs.readFileSync(dosya, "utf8"));
const onceki = kuyruk.find((k) => k.post === post && k.durum === "bekliyor");
const kayit = {
  post,
  zaman: zaman.toISOString(),
  durum: "bekliyor",
  gorseller: jpgler.map((f) => `/sosyal/${post}/${f}`),
  altyazi: fs.readFileSync(path.join(kaynak, "metin.txt"), "utf8").trim(),
};
if (onceki) Object.assign(onceki, kayit); else kuyruk.push(kayit);
fs.writeFileSync(dosya, JSON.stringify(kuyruk, null, 2) + "\n");
console.log(`${post}: ${jpgler.length} görsel, ${zamanMetni} (İstanbul) için kuyrukta. Yayına almak için commit + push gerekir (görseller sitede açılmalı).`);
