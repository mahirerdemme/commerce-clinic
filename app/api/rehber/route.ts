import { aboneBaglanti, emailOk, esc, frame, json, koruma, limitAsildi, notify, rows, sendMail, siteUrl, sonEpostalar, txt, yakinda } from "@/lib/email/forms";

/** Ücretsiz rehber: POST /api/rehber · kontrol listesi bağlantısını e-postayla gönderir */
const REHBERLER: Record<string, { ad: string; yol: string }> = {
  "altyapi-kontrol-listesi": {
    ad: "E-ticaret altyapısı değiştirirken 12 adımlık rehber",
    yol: "/rehber/e-ticaret-altyapi-gecisi/kontrol-listesi",
  },
};

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json(false, 400, "Geçersiz istek");
  }
  const red = koruma(req, b, "rehber");
  if (red) return red;
  const name = txt(b.name, 120);
  const email = txt(b.email, 200).toLowerCase();
  const site = txt(b.site, 200);
  const news = b.news === true;
  const r = REHBERLER[txt(b.resource, 60)];
  if (!name || !emailOk(email) || !r) return json(false, 400, "Eksik alan");

  const list = await sonEpostalar();
  if (limitAsildi(list)) return json(false, 429, "Yoğunluk, daha sonra deneyin");
  const link = `${siteUrl()}${r.yol}`;
  try {
    // aynı adrese 10 dakikada en fazla 1 e-posta; sayfa yine de bağlantıyı gösterir
    if (!yakinda(list, email)) await sendMail({
      to: [email],
      subject: `${r.ad} · bağlantınız`,
      html: frame(
        "Rehberiniz hazır.",
        `<p>${esc(name)}, ${esc(r.ad)} için bağlantınız:</p><p><a href="${esc(link)}" style="display:inline-block;background:#0A0A0A;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Rehberi aç</a></p><p style="color:#666">İşaretlediğiniz maddeler tarayıcınızda tutulur. Başka bir cihazda devam etmek için sayfadaki "İlerlemeyi kaydet" düğmesini kullanabilirsiniz.</p>${news ? `<p style="margin-top:24px">Commerce Notes bültenini de almak istediğinizi belirttiniz. Aboneliği onaylamak için: <a href="${esc(aboneBaglanti(email, "rehber"))}">aboneliği onayla</a>. Onaylamazsanız listeye eklenmezsiniz.</p>` : ""}`,
      ),
      replyTo: "hello@thecommerceclinic.com",
    });
    await notify(
      `Rehber indirildi · ${name}`,
      rows([
        ["Ad soyad", name],
        ["E-posta", email],
        ["Marka / site", site],
        ["Rehber", r.ad],
        ["Bülten isteği", news ? "Evet (e-postadaki onay bağlantısına basarsa listeye eklenir)" : "Hayır"],
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
