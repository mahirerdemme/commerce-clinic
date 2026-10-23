import { NextResponse } from "next/server";
import { COOKIE, ayniSite, ayarliMi, cerezDegeri, cerezOpts, parolaDogru } from "@/lib/yonetim";
import { rateOk } from "@/lib/email/forms";

export async function POST(req: Request) {
  const to = (q: string) => NextResponse.redirect(new URL(`/yonetim${q}`, req.url), 303);
  if (!ayniSite(req) || !ayarliMi()) return to("?hata=1");
  if (!rateOk(req, "yonetim-giris", 6)) return to("?hata=sinir");
  const f = await req.formData();
  if (!parolaDogru(String(f.get("parola") ?? ""))) return to("?hata=1");
  const res = to("");
  res.cookies.set(COOKIE, cerezDegeri(), cerezOpts());
  return res;
}
