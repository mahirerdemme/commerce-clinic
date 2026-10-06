// Bülten · sayı yayına çıkınca onay önizlemesini site üzerinden gönderir (gizli bilgi gerekmez)
// Çalıştır: node scripts/bulten/onaya-gonder.mjs <YYYY-MM-DD>
// Site (Vercel) sayıyı göremediği sürece 404 döner; yeni yayın çıkana kadar en çok 15 dakika bekler.
const id = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}(-\d+)?$/.test(id ?? "")) { console.error("Kullanım: node scripts/bulten/onaya-gonder.mjs <YYYY-MM-DD>"); process.exit(1); }
const base = (process.env.SITE_BASE ?? "https://commerce-clinic-ashen.vercel.app").replace(/\/$/, "");
const son = Date.now() + 15 * 60e3;
for (;;) {
  const r = await fetch(`${base}/api/bulten/onizleme-gonder?id=${id}`, { method: "POST" }).catch((e) => ({ ok: false, status: 0, json: async () => ({ hata: e.message }) }));
  const out = await r.json().catch(() => ({}));
  if (r.ok) { console.log("Onay önizlemesi gönderildi.", out); process.exit(0); }
  if (r.status !== 404 && r.status !== 0) { console.error("Gönderilemedi:", r.status, out); process.exit(1); }
  if (Date.now() > son) { console.error("Sayı 15 dakikada sitede görünmedi; önizleme gönderilmedi."); process.exit(1); }
  console.log("Sayı henüz yayında değil, bekleniyor…");
  await new Promise((res) => setTimeout(res, 30e3));
}
