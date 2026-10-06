import { imza, sayiOku, siteBase } from "@/lib/email/bulten";
import { renderNewsletter } from "@/lib/email/newsletter";

/**
 * Zamanlanmış görev yeni sayıyı repoya gönderip site yayına çıkınca bunu çağırır: POST /api/bulten/onizleme-gonder?id=<YYYY-MM-DD>
 * Görev hiçbir gizli bilgi taşımaz; onay önizlemesini, anahtarları bilen site gönderir ve yalnız BULTEN_ONAY_TO'ya gider.
 * Kötüye kullanım sınırı: yalnız son 2 günün sayısı için çalışır; en kötü ihtimalle onay adresine tekrar önizleme düşer.
 */
export async function POST(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const sayi = await sayiOku(id);
  if (!sayi) return Response.json({ ok: false, hata: "Sayı bulunamadı (henüz yayında olmayabilir)" }, { status: 404 });
  if (Date.now() - Date.parse(`${id.slice(0, 10)}T00:00:00+03:00`) > 2 * 864e5)
    return Response.json({ ok: false, hata: "Yalnız son 2 günün sayısı için önizleme gönderilir" }, { status: 400 });

  const to = (process.env.BULTEN_ONAY_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!to.length || !process.env.RESEND_API_KEY) return Response.json({ ok: false, hata: "Sunucu ayarları eksik" }, { status: 500 });

  const base = siteBase();
  const onay = `${base}/bulten/onay?id=${encodeURIComponent(id)}&t=${imza(id)}`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BULTEN_FROM ?? "Commerce Notes <onboarding@resend.dev>",
      to,
      subject: `[Onay bekliyor] ${sayi.subject}`,
      html: renderNewsletter(sayi, base, { onay }).replace("{{{RESEND_UNSUBSCRIBE_URL}}}", `${base}/blog`),
    }),
  });
  if (!r.ok) return Response.json({ ok: false, hata: `Resend ${r.status}` }, { status: 502 });
  return Response.json({ ok: true, alici: to.length });
}
