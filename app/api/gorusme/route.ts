import { emailOk, esc, frame, json, koruma, hacimUyarisi, limitAsildi, notify, rows, sendMail, sonEpostalar, txt, yakinda } from "@/lib/email/forms";

/** formun açıldığı sayfanın okunur adı (gp.html'e sayfa anahtarı yazılır) */
const SAYFA: Record<string, string> = {
  home: "Ana sayfa",
  "check-up": "Check-up",
  danismanlik: "Danışmanlık",
  hakkimizda: "Hakkımızda",
  "commerce-notes": "Blog (Commerce Notes)",
  "blog-301-haritasi": "Blog yazısı · 301 yönlendirme haritası",
  "blog-altyapi-secimi": "Blog yazısı · E-ticaret altyapısı nasıl seçilir",
  "blog-site-analizi": "Blog yazısı · E-ticaret sitesi analizi",
  "rehber-altyapi-gecisi": "Rehber · Altyapı değişikliği",
  "kontrol-listesi": "Rehber kontrol listesi",
};

/** Görüşme Planla formu: POST /api/gorusme */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json(false, 400, "Geçersiz istek");
  }
  const red = koruma(req, b, "gorusme");
  if (red) return red;
  const name = txt(b.name, 120);
  const email = txt(b.email, 200).toLowerCase();
  const site = txt(b.site, 200);
  const interest = txt(b.interest, 60);
  const channel = txt(b.channel, 20) === "Telefon" ? "Telefon" : "E-posta";
  const phone = txt(b.phone, 40);
  const message = txt(b.message, 2000);
  const topics = Array.isArray(b.topics) ? b.topics.map((t) => txt(t, 60)).filter(Boolean).slice(0, 10) : [];
  if (!name || !emailOk(email) || !site || !interest || (channel === "Telefon" && !phone)) return json(false, 400, "Eksik alan");

  const list = await sonEpostalar();
  await hacimUyarisi(list); // uyarı, sınır dolmadan ve dolduğunda da gider
  if (limitAsildi(list)) return json(false, 429, "Yoğunluk, daha sonra deneyin");
  const teyitGider = !yakinda(list, email); // aynı adrese 10 dakikada en fazla 1 teyit

  try {
    await notify(
      `Yeni görüşme talebi · ${name} · ${site}`,
      rows([
        ["Ad soyad", name],
        ["E-posta", email],
        ["Marka / site", site],
        ["İlgi alanı", interest],
        ["Konular", topics.join(", ")],
        ["Dönüş", channel === "Telefon" ? `Telefon · ${phone}` : "E-posta"],
        ["Mesaj", message],
        ["Kaynak sayfa", SAYFA[txt(b.source_page, 60)] ?? txt(b.source_page, 60)],
        ["UTM", [txt(b.utm_source, 80), txt(b.utm_medium, 80), txt(b.utm_campaign, 80)].filter(Boolean).join(" / ")],
        ["Zaman", new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })],
      ]),
      email,
    );
    // kullanıcıya kısa teyit; bildirim gittiyse bu başarısız olsa da talep alınmıştır
    if (teyitGider) await sendMail({
      to: [email],
      subject: "Talebiniz bize ulaştı · Commerce Clinic",
      html: frame(
        "Talebiniz bize ulaştı.",
        `<p>${esc(name)}, mesajınız için teşekkürler. 1 iş günü içinde ${channel === "Telefon" ? "sizi arayarak" : "e-posta ile"} dönüş yapılacak.</p><p style="color:#666">Bu e-postayı yanıtlayarak ek bilgi paylaşabilirsiniz.</p>`,
      ),
      replyTo: "hello@thecommerceclinic.com",
    }).catch(() => {});
  } catch (e) {
    console.error("gorusme", e);
    return json(false, 502, "Gönderilemedi");
  }
  return json(true);
}
