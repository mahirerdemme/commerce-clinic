import { NextResponse } from "next/server";
import { ayniSite, girisliMi } from "@/lib/yonetim";

/** Aboneyi kitleden siler (KVKK silme talebi ya da yanlış kayıt). Yalnız girişli yönetici. */
export async function POST(req: Request) {
  const to = (q: string) => NextResponse.redirect(new URL(`/yonetim${q}#aboneler`, req.url), 303);
  if (!ayniSite(req) || !(await girisliMi())) return new NextResponse("Yetkisiz", { status: 401 });
  const id = String((await req.formData()).get("id") ?? "");
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!/^[0-9a-f-]{36}$/.test(id) || !audience) return to("?mesaj=gecersiz");
  const r = await fetch(`https://api.resend.com/audiences/${audience}/contacts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    cache: "no-store",
  });
  return to(r.ok ? "?mesaj=silindi" : "?mesaj=hata");
}
