import { renderNewsletter, SAMPLE } from "@/lib/email/newsletter";

/** Bülten şablonunun örnek içerikle önizlemesi; canlıda kapalı. */
export function GET(req: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const base = new URL(req.url).origin;
  return new Response(renderNewsletter(SAMPLE, base), { headers: { "content-type": "text/html; charset=utf-8" } });
}
