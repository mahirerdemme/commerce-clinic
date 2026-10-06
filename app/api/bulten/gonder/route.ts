import { gonder, imzaGecerli, sayiOku } from "@/lib/email/bulten";

/** Onay sayfasındaki form buraya gelir; imza doğruysa sayıyı gönderir ve onay sayfasına döner. */
export async function POST(req: Request) {
  const f = await req.formData();
  const id = String(f.get("id") ?? ""), t = String(f.get("t") ?? "");
  const back = (extra: string) => Response.redirect(new URL(`/bulten/onay?id=${encodeURIComponent(id)}&t=${encodeURIComponent(t)}&${extra}`, req.url), 303);
  if (!imzaGecerli(id, t)) return new Response("Geçersiz bağlantı", { status: 403 });
  const sayi = await sayiOku(id);
  if (!sayi) return new Response("Sayı bulunamadı", { status: 404 });
  try {
    await gonder(id, sayi);
    return back("durum=gonderildi");
  } catch (e) {
    return back(`hata=${encodeURIComponent(e instanceof Error ? e.message : "bilinmeyen hata")}`);
  }
}
