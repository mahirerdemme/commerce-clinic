import { sayiOku, siteBase } from "@/lib/email/bulten";
import { renderNewsletter } from "@/lib/email/newsletter";

/** Bültenin tarayıcı sürümü: e-postadaki "Tarayıcıda aç" buraya gelir. Arama motorlarına kapalı. */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const sayi = await sayiOku(id);
  if (!sayi) return new Response("Bulunamadı", { status: 404, headers: { "x-robots-tag": "noindex" } });
  const base = siteBase();
  const html = renderNewsletter(sayi, base).replace("{{{RESEND_UNSUBSCRIBE_URL}}}", `${base}/ticari-ileti`);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex, nofollow" } });
}
