/**
 * Zamanlı blog yayını: yazı kendi saatine kadar sitede görünmez (404), listede, sitemap'te ve diğer yazıların
 * bağlantılarında yer almaz. Saat gelince ek bir yayın gerekmeden açılır. Takvimde olmayan yazı hep yayındadır.
 * Yerelde tüm yazıları görmek için BLOG_TAKVIM_ONIZLE=true (.env.local).
 */
export const BLOG_YAYIN: Record<string, string> = {
  "/blog/sepet-terki-nedenleri": "2026-11-03T07:00:00+03:00",
  "/blog/e-ticaret-onceliklendirme": "2026-11-04T07:00:00+03:00",
  "/blog/sepet-kurtarma-nasil-kurulur": "2026-11-05T07:00:00+03:00",
  "/blog/pazaryerinde-satarken-kendi-e-ticaret-siteniz": "2026-11-06T07:00:00+03:00",
};

export function yayinda(route: string, simdi = Date.now()): boolean {
  if (process.env.BLOG_TAKVIM_ONIZLE === "true") return true;
  const t = BLOG_YAYIN[route];
  return !t || simdi >= Date.parse(t);
}
