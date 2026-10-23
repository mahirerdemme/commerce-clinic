import { NextResponse } from "next/server";
import { aboneCoz, addContact, notify, rows } from "@/lib/email/forms";

/** Bülten kaydı, 2. adım: onay e-postasındaki bağlantı. Kişiyi kitleye ekler ve onay kaydını ekibe bildirir. */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const to = (d: string) => NextResponse.redirect(new URL(`/bulten/onaylandi?durum=${d}`, req.url), 303);
  const c = aboneCoz(u.searchParams.get("e") ?? "", u.searchParams.get("ts") ?? "", u.searchParams.get("t") ?? "");
  if (!c) return to("gecersiz");
  try {
    if (!(await addContact(c.email))) return to("hata");
    const fmt = (n: number) => new Date(n).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
    await notify(
      `Yeni bülten abonesi · ${c.email}`,
      rows([
        ["E-posta", c.email],
        ["Onay", "Aydınlatma Metni kapsamında ticari ileti onayı (metin sürümü 1); e-posta bağlantısıyla çift onay"],
        ["Kaynak", c.kaynak],
        ["Kayıt isteği", fmt(c.istek)],
        ["Onay zamanı", fmt(Date.now())],
      ]),
      c.email,
    ).catch(() => {});
  } catch (e) {
    console.error("onayla", e);
    return to("hata");
  }
  return to("tamam");
}
