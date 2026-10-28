// Sosyal · kuyruktaki zamanı gelmiş Instagram gönderisini paylaşır (Meta, Instagram login)
// Çalıştırma: node --env-file=.env.local scripts/sosyal/paylas.mjs [--kuru]
//   Her çalışmada en fazla bir gönderi paylaşılır. --kuru: token ve görselleri denetler, paylaşmaz.
//   GitHub Actions (.github/workflows/sosyal-paylas.yml) bunu zamanlar; IG_* değerleri orada Secret.
//   Kuyruğa yalnız onaylanan gönderi girer (kuyruga-ekle.mjs); onaysız hiçbir şey paylaşılmaz.
import fs from "node:fs";

const { IG_USER_ID: kullanici, IG_ACCESS_TOKEN: token } = process.env;
const site = (process.env.SITE_BASE ?? "https://thecommerceclinic.com").replace(/\/$/, "");
const kuru = process.argv.includes("--kuru");
const GECIKME_SINIRI = 6 * 3600e3; // bundan geç kalan gönderi paylaşılmaz, kaçırıldı işaretlenir
const api = "https://graph.instagram.com/v21.0";
if (!kullanici || !token) { console.error("IG_USER_ID ve IG_ACCESS_TOKEN gerekli"); process.exit(1); }

const dosya = "scripts/sosyal/kuyruk.json";
const kuyruk = JSON.parse(fs.readFileSync(dosya, "utf8"));
const kaydet = () => fs.writeFileSync(dosya, JSON.stringify(kuyruk, null, 2) + "\n");

async function graf(yol, govde, yontem = "POST") {
  const url = new URL(`${api}/${yol}`);
  const secenek = { method: yontem };
  if (yontem === "GET") for (const [k, v] of Object.entries(govde ?? {})) url.searchParams.set(k, v);
  else secenek.body = new URLSearchParams(govde);
  const res = await fetch(url, { ...secenek, headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`${yol}: ${json.error?.message ?? res.status}`);
  return json;
}

async function hazirBekle(kapsayici) {
  for (let i = 0; i < 30; i++) {
    const { status_code: durum } = await graf(kapsayici, { fields: "status_code" }, "GET");
    if (durum === "FINISHED") return;
    if (durum === "ERROR" || durum === "EXPIRED") throw new Error(`kapsayıcı ${durum}`);
    await new Promise((r) => setTimeout(r, 4000));
  }
  throw new Error("kapsayıcı zamanında hazır olmadı");
}

const simdi = Date.now();
for (const k of kuyruk) {
  if (k.durum === "bekliyor" && simdi - new Date(k.zaman) > GECIKME_SINIRI) {
    k.durum = "kacirildi";
    console.log(`${k.post}: ${k.zaman} için ${GECIKME_SINIRI / 3600e3} saatten fazla gecikti, kaçırıldı olarak işaretlendi`);
  }
}
const sira = kuyruk.filter((k) => k.durum === "bekliyor" && new Date(k.zaman) <= simdi).sort((a, b) => new Date(a.zaman) - new Date(b.zaman));
const hedef = kuru ? kuyruk.find((k) => k.durum === "bekliyor") : sira[0];
if (!hedef) { kaydet(); console.log("Paylaşılacak gönderi yok."); process.exit(0); }

try {
  const gorseller = hedef.gorseller.map((g) => `${site}${g}`);
  for (const g of gorseller) {
    const res = await fetch(g, { method: "HEAD" });
    if (!res.ok || !res.headers.get("content-type")?.startsWith("image/jpeg")) {
      // site henüz yayına çıkmamış olabilir: gönderi bekliyor kalır, sonraki çalışmada yeniden denenir
      console.error(`${hedef.post}: görsel henüz açılmıyor ya da JPEG değil: ${g} (${res.status}); sonra yeniden denenecek`);
      kaydet();
      process.exit(kuru ? 1 : 0);
    }
  }
  const ben = await graf("me", { fields: "username" }, "GET");
  console.log(`${hedef.post}: ${gorseller.length} görsel hazır, hesap @${ben.username}${kuru ? " (kuru çalışma, paylaşılmadı)" : ""}`);
  if (kuru) process.exit(0);

  let kapsayici;
  if (gorseller.length === 1) {
    ({ id: kapsayici } = await graf(`${kullanici}/media`, { image_url: gorseller[0], caption: hedef.altyazi }));
  } else {
    const cocuklar = [];
    for (const g of gorseller) cocuklar.push((await graf(`${kullanici}/media`, { image_url: g, is_carousel_item: "true" })).id);
    for (const c of cocuklar) await hazirBekle(c);
    ({ id: kapsayici } = await graf(`${kullanici}/media`, { media_type: "CAROUSEL", children: cocuklar.join(","), caption: hedef.altyazi }));
  }
  await hazirBekle(kapsayici);
  const { id: medya } = await graf(`${kullanici}/media_publish`, { creation_id: kapsayici });
  const { permalink } = await graf(medya, { fields: "permalink" }, "GET");
  Object.assign(hedef, { durum: "paylasildi", paylasilma: new Date().toISOString(), medya, permalink });
  console.log(`Paylaşıldı: ${permalink}`);
} catch (e) {
  hedef.hata = e.message; hedef.durum = "hata";
  console.error(`HATA ${hedef.post}: ${e.message}`);
  process.exitCode = 1; // Actions çalışması kırmızı olur, GitHub e-posta atar
}
kaydet();
