import { addContact, emailOk, esc, frame, json, notify, originOk, rateOk, rows, sendMail, siteUrl, txt } from "@/lib/email/forms";

/** Ücretsiz rehber: POST /api/rehber · kontrol listesi bağlantısını e-postayla gönderir */
const REHBERLER: Record<string, { ad: string; yol: string }> = {
  "altyapi-kontrol-listesi": {
    ad: "E-ticaret altyapısı değiştirirken 12 adımlık rehber",
    yol: "/rehber/e-ticaret-altyapi-gecisi/kontrol-listesi",
  },
};

export async function POST(req: Request) {
  if (!originOk(req)) return json(false, 403, "Kaynak geçersiz");
  if (!rateOk(req, "rehber")) return json(false, 429, "Çok fazla deneme");
  if (!process.env.RESEND_API_KEY) return json(false, 500, "Sunucu ayarları eksik");

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json(false, 400, "Geçersiz istek");
  }
  const name = txt(b.name, 120);
  const email = txt(b.email, 200).toLowerCase();
  const site = txt(b.site, 200);
  const news = b.news === true;
  const r = REHBERLER[txt(b.resource, 60)];
  if (!name || !emailOk(email) || !r) return json(false, 400, "Eksik alan");

  const link = `${siteUrl()}${r.yol}`;
  try {
    await sendMail({
      to: [email],
      subject: `${r.ad} · bağlantınız`,
      html: frame(
        "Rehberiniz hazır.",
        `<p>${esc(name)}, ${esc(r.ad)} için bağlantınız:</p><p><a href="${esc(link)}" style="display:inline-block;background:#0A0A0A;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Rehberi aç</a></p><p style="color:#666">İşaretlediğiniz maddeler tarayıcınızda tutulur. Başka bir cihazda devam etmek için sayfadaki "İlerlemeyi kaydet" düğmesini kullanabilirsiniz.</p>`,
      ),
      replyTo: "hello@thecommerceclinic.com",
    });
    if (news) await addContact(email).catch((e) => console.error("rehber-kitle", e));
    await notify(
      `Rehber indirildi · ${name}`,
      rows([
        ["Ad soyad", name],
        ["E-posta", email],
        ["Marka / site", site],
        ["Rehber", r.ad],
        ["Bülten onayı", news ? "Evet (ticari ileti onayı verildi; metin sürümü 1)" : "Hayır"],
        ["Zaman", new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })],
      ]),
      email,
    ).catch(() => {});
  } catch (e) {
    console.error("rehber", e);
    return json(false, 502, "Gönderilemedi");
  }
  return json(true);
}
