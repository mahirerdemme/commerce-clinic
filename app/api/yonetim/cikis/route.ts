import { NextResponse } from "next/server";
import { COOKIE, ayniSite, cerezOpts } from "@/lib/yonetim";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/yonetim", req.url), 303);
  if (ayniSite(req)) res.cookies.set(COOKIE, "", cerezOpts(0));
  return res;
}
