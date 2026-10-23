import { addContact, emailOk, json, notify, originOk, rateOk, rows, txt } from "@/lib/email/forms";

/** Bülten kaydı: POST /api/bulten/abone · kitleye ekler, onay kaydını ekibe bildirir */
export async function POST(req: Request) {
  if (!originOk(req)) return json(false, 403, "Kaynak geçersiz");
  if (!rateOk(req, "abone")) return json(false, 429, "Çok fazla deneme");
  if (!process.env.RESEND_API_KEY) return json(false, 500, "Sunucu ayarları eksik");

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json(false, 400, "Geçersiz istek");
  }
  const email = txt(b.email, 200).toLowerCase();
  if (!emailOk(email) || b.consent !== true) return json(false, 400, "Eksik alan");

  try {
    if (!(await addContact(email))) return json(false, 500, "Kitle tanımlı değil");
    // onay kaydı: tarih, kaynak, metin sürümü (KVKK / ticari ileti)
    await notify(
      `Yeni bülten abonesi · ${email}`,
      rows([
        ["E-posta", email],
        ["Onay", "Aydınlatma Metni kapsamında ticari ileti onayı (metin sürümü 1)"],
        ["Kaynak", txt(b.source, 60)],
        ["Zaman", new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })],
      ]),
      email,
    ).catch(() => {});
  } catch (e) {
    console.error("abone", e);
    return json(false, 502, "Gönderilemedi");
  }
  return json(true);
}
