import { aboneBaglanti, emailOk, esc, frame, hacimUyarisi, json, koruma, limitAsildi, sendMail, sonEpostalar, txt, yakinda } from "@/lib/email/forms";

/** Bülten kaydı, 1. adım: POST /api/bulten/abone · e-postaya onay bağlantısı gönderir (çift onay; kitleye ekleme /api/bulten/onayla'da) */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json(false, 400, "Geçersiz istek");
  }
  const red = koruma(req, b, "abone");
  if (red) return red;
  const email = txt(b.email, 200).toLowerCase();
  if (!emailOk(email) || b.consent !== true) return json(false, 400, "Eksik alan");

  const list = await sonEpostalar();
  await hacimUyarisi(list); // uyarı, sınır dolmadan ve dolduğunda da gider
  if (limitAsildi(list)) return json(false, 429, "Yoğunluk, daha sonra deneyin");
  if (yakinda(list, email)) return json(true); // aynı adrese 10 dakikada bir onay e-postası

  try {
    await sendMail({
      to: [email],
      subject: "Commerce Notes aboneliğinizi onaylayın",
      html: frame(
        "Aboneliğinizi onaylayın.",
        `<p>Commerce Notes bültenine bu adresle kayıt istendi. Onaylamak için aşağıdaki düğmeye basın.</p><p><a href="${esc(aboneBaglanti(email, txt(b.source, 40)))}" style="display:inline-block;background:#0A0A0A;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none">Aboneliği onayla</a></p><p style="color:#666">Bu isteği siz yapmadıysanız bu e-postayı yok sayın; onaylamadığınız sürece listeye eklenmezsiniz. Bağlantı 2 gün geçerlidir.</p>`,
      ),
      replyTo: "hello@thecommerceclinic.com",
    });
  } catch (e) {
    console.error("abone", e);
    return json(false, 502, "Gönderilemedi");
  }
  return json(true);
}
