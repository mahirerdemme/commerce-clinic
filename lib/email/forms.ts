/**
 * Site formlarının sunucu tarafı (Görüşme Planla, ücretsiz rehber, bülten kaydı)
 * - Gönderim Resend ile (RESEND_API_KEY); gönderen adresi alan adı doğrulandığı için @thecommerceclinic.com
 * - Bildirimler FORM_TO adreslerine (virgülle ayrılmış) gider; hello@ posta kutusu açılana kadar yanında bir Gmail adresi durur
 * - Kötüye kullanım: kaynak (Origin) kontrolü, alan uzunluk sınırları ve IP başına kısa pencere sınırı
 */

import crypto from "node:crypto";

const RESEND = "https://api.resend.com";

export const siteUrl = () => (process.env.SITE_BASE ?? "https://thecommerceclinic.com").replace(/\/$/, "");
const formFrom = () => process.env.FORM_FROM ?? "Commerce Clinic <hello@thecommerceclinic.com>";
const formTo = () =>
  (process.env.FORM_TO ?? "hello@thecommerceclinic.com").split(",").map((s) => s.trim()).filter(Boolean);

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** metin alanı: kırp, uzunluğu sınırla, kontrol karakterlerini at */
export const txt = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";

export const emailOk = (s: string) => s.length <= 200 && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/.test(s);

/** istek bu sitenin sayfasından mı geliyor (tarayıcı Origin başlığı gönderir) */
export function originOk(req: Request) {
  const o = req.headers.get("origin");
  if (!o) return false;
  try {
    const h = new URL(o).hostname;
    return h === "thecommerceclinic.com" || h === "www.thecommerceclinic.com" || h === "localhost" || h.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

const hits = new Map<string, number[]>();
/** IP başına 10 dakikada en fazla `max` istek (sunucusuz ortamda en iyi çaba) */
export function rateOk(req: Request, key: string, max = 6) {
  const ip = (req.headers.get("x-forwarded-for") ?? "?").split(",")[0].trim();
  const k = `${key}:${ip}`;
  const now = Date.now();
  const list = (hits.get(k) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(k, list);
  if (hits.size > 5000) hits.clear();
  return list.length <= max;
}

async function resend(p: string, body: unknown) {
  const r = await fetch(`${RESEND}${p}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
}

export const sendMail = (m: { to: string[]; subject: string; html: string; replyTo?: string; from?: string }) =>
  resend("/emails", { from: m.from ?? formFrom(), to: m.to, subject: m.subject, html: m.html, reply_to: m.replyTo });

/** ekibe giden bildirim (hello@ + yedek adres) */
export const notify = (subject: string, html: string, replyTo?: string) =>
  sendMail({ to: formTo(), subject, html, replyTo });

/** bülten kitlesine kişi ekle (RESEND_AUDIENCE_ID); kitle tanımlı değilse atlanır */
export async function addContact(email: string) {
  const id = process.env.RESEND_AUDIENCE_ID;
  if (!id) return false;
  await resend(`/audiences/${id}/contacts`, { email, unsubscribed: false });
  return true;
}

/** bildirim e-postası için etiket-değer tablosu */
export function rows(pairs: [string, string][]) {
  const tr = pairs
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;color:#111">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  return `<table style="font:15px/1.5 -apple-system,Segoe UI,Arial,sans-serif;border-collapse:collapse">${tr}</table>`;
}

/** kullanıcıya giden sade e-posta çerçevesi */
export function frame(title: string, body: string) {
  return `<div style="font:16px/1.6 -apple-system,Segoe UI,Arial,sans-serif;color:#111;max-width:520px;margin:0 auto;padding:24px"><p style="margin:0 0 4px;font-size:20px;font-weight:600">${esc(title)}</p>${body}<p style="margin:28px 0 0;color:#666;font-size:13px">Commerce Clinic · thecommerceclinic.com</p></div>`;
}

export const json = (ok: boolean, status = 200, hata?: string) => Response.json({ ok, ...(hata ? { hata } : {}) }, { status });

/* ---------- bot koruması ---------- */

const hmac = (s: string) => crypto.createHmac("sha256", process.env.BULTEN_SECRET ?? "").update(s).digest("hex").slice(0, 32);
const same = (a: string, b: string) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** Sayfa yüklenince alınan imzalı zaman damgası: form çok hızlı gönderilirse (insan değil) reddedilir */
export const formToken = () => {
  const ts = Date.now();
  return `${ts}.${hmac(`form:${ts}`)}`;
};

function tokenKontrol(t: string): "ok" | "yok" | "hizli" | "eski" {
  const [ts, sig] = t.split(".");
  const n = Number(ts);
  if (!n || !sig || !same(sig, hmac(`form:${n}`))) return "yok";
  const yas = Date.now() - n;
  if (yas < 2000) return "hizli";
  if (yas > 6 * 3600 * 1000) return "eski";
  return "ok";
}

/** Her form ucunun ilk kontrolü: kaynak, sınır, tuzak alanı (botlar doldurur), zaman damgası. null = devam. */
export function koruma(req: Request, b: Record<string, unknown>, tur: string): Response | null {
  if (!originOk(req)) return json(false, 403, "Kaynak geçersiz");
  if (!rateOk(req, tur)) return json(false, 429, "Çok fazla deneme");
  if (!process.env.RESEND_API_KEY) return json(false, 500, "Sunucu ayarları eksik");
  if (txt(b.cc_nick, 100)) return json(true); // tuzak alanı dolu: bota "başarılı" deriz, hiçbir şey gönderilmez
  if (tokenKontrol(txt(b._t, 120)) !== "ok") return json(false, 429, "Lütfen tekrar deneyin");
  return null;
}

type Giden = { to?: string[]; created_at?: string };
const zaman = (s?: string) => Date.parse((s ?? "").replace(" ", "T").replace(/\+00$/, "Z"));

/** Son gönderilen e-postalar (kalıcı sayaç: Resend kaydı; sunucu belleğine bağlı değil) */
export async function sonEpostalar(): Promise<Giden[] | null> {
  try {
    const r = await fetch(`${RESEND}/emails?limit=100`, {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      cache: "no-store",
    });
    if (!r.ok) return null;
    return ((await r.json()).data ?? []) as Giden[];
  } catch {
    return null;
  }
}

/** Günlük toplam e-posta üst sınırı (FORM_GUNLUK_SINIR, varsayılan 80; Resend ücretsiz plan: 100/gün) */
export function limitAsildi(list: Giden[] | null) {
  if (!list) return false; // sayaç okunamazsa engelleme (formlar çalışmaya devam eder)
  const sinir = Number(process.env.FORM_GUNLUK_SINIR) || 80;
  const gun = Date.now() - 24 * 3600 * 1000;
  return list.filter((m) => zaman(m.created_at) > gun).length >= sinir;
}

/** Bu adrese son 10 dakikada e-posta gitti mi (aynı adrese tekrar tekrar posta gitmesini engeller) */
export function yakinda(list: Giden[] | null, email: string) {
  if (!list) return false;
  const e = email.toLowerCase();
  const t = Date.now() - 10 * 60 * 1000;
  return list.some((m) => zaman(m.created_at) > t && (m.to ?? []).some((x) => x.toLowerCase() === e));
}

/* ---------- bülten çift onay ---------- */

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const unb64 = (s: string) => Buffer.from(s, "base64url").toString();

/** E-postadaki onay bağlantısı: imzalı, 2 gün geçerli */
export function aboneBaglanti(email: string, kaynak: string) {
  const ts = Date.now();
  const e = b64(`${email}|${kaynak}`);
  return `${siteUrl()}/api/bulten/onayla?e=${e}&ts=${ts}&t=${hmac(`abone:${e}:${ts}`)}`;
}

export function aboneCoz(e: string, ts: string, t: string): { email: string; kaynak: string; istek: number } | null {
  const n = Number(ts);
  if (!e || !n || !same(t, hmac(`abone:${e}:${n}`))) return null;
  if (Date.now() - n > 2 * 24 * 3600 * 1000) return null;
  const [email, kaynak] = unb64(e).split("|");
  return emailOk(email ?? "") ? { email, kaynak: kaynak ?? "", istek: n } : null;
}
