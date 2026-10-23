import { NextResponse } from "next/server";
import { COOKIE, anahtarDogru, ayniSite, ayarliMi, cerezDegeri, cerezOpts, parolaDogru } from "@/lib/yonetim";
import { rateOk } from "@/lib/email/forms";

export async function POST(req: Request) {
  if (!ayniSite(req) || !ayarliMi()) return new NextResponse("Not found", { status: 404 });
  const f = await req.formData();
  const k = String(f.get("k") ?? "");
  if (!anahtarDogru(k)) return new NextResponse("Not found", { status: 404 });
  const to = (q: string) => NextResponse.redirect(new URL(`/yonetim?k=${encodeURIComponent(k)}${q}`, req.url), 303);
  if (!rateOk(req, "yonetim-giris", 6)) return to("&hata=sinir");
  if (!parolaDogru(String(f.get("parola") ?? ""))) return to("&hata=1");
  const res = NextResponse.redirect(new URL("/yonetim", req.url), 303);
  res.cookies.set(COOKIE, cerezDegeri(), cerezOpts());
  return res;
}
