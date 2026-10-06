import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { renderNewsletter, type Newsletter } from "@/lib/email/newsletter";

/**
 * Bülten onayı ve gönderimi (sunucu tarafı)
 * - Sayılar: scripts/bulten/sayilar/<id>.json (zamanlanmış görev yazar, repoya gönderir)
 * - Onay linki: /bulten/onay?id=<id>&t=<imza> · imza BULTEN_SECRET ile HMAC
 * - BULTEN_MODE=canli değilse "test": yalnız BULTEN_TEST_TO adreslerine gider (alan adı doğrulanana kadar)
 * - Canlı: Resend Broadcast, RESEND_AUDIENCE_ID kitlesine; aynı sayı iki kez gönderilmez
 */

const RESEND = "https://api.resend.com";
const ID = /^\d{4}-\d{2}-\d{2}(-\d+)?$/;

export const siteBase = () =>
  (process.env.SITE_BASE ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")).replace(/\/$/, "");

const secret = () => {
  const s = process.env.BULTEN_SECRET;
  if (!s) throw new Error("BULTEN_SECRET tanımlı değil");
  return s;
};

export const imza = (id: string) => crypto.createHmac("sha256", secret()).update(`bulten:${id}`).digest("hex").slice(0, 32);

export function imzaGecerli(id: string, t: string) {
  if (!ID.test(id) || !/^[a-f0-9]{32}$/.test(t) || !process.env.BULTEN_SECRET) return false;
  return crypto.timingSafeEqual(Buffer.from(imza(id)), Buffer.from(t));
}

export async function sayiOku(id: string): Promise<Newsletter | null> {
  if (!ID.test(id)) return null;
  try {
    return JSON.parse(await fs.readFile(path.join(process.cwd(), "scripts/bulten/sayilar", `${id}.json`), "utf8"));
  } catch {
    return null;
  }
}

export const mod = () => (process.env.BULTEN_MODE === "canli" ? "canli" : "test");
export const testAlicilar = () => (process.env.BULTEN_TEST_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const from = () => process.env.BULTEN_FROM ?? "Commerce Notes <onboarding@resend.dev>";

async function resend(p: string, init?: RequestInit) {
  const r = await fetch(`${RESEND}${p}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Resend ${r.status}: ${body?.message ?? JSON.stringify(body)}`);
  return body;
}

/** canlı modda bu sayı daha önce gönderildi mi (Resend'de aynı adlı yayın) */
export async function gonderildiMi(id: string) {
  if (mod() !== "canli") return false;
  const list = await resend("/broadcasts");
  return (list.data ?? []).some((b: { name?: string; status?: string }) => b.name === `sayi-${id}` && b.status !== "draft");
}

export async function gonder(id: string, sayi: Newsletter) {
  const base = siteBase();
  if (mod() === "canli") {
    const audience = process.env.RESEND_AUDIENCE_ID;
    if (!audience) throw new Error("RESEND_AUDIENCE_ID tanımlı değil");
    if (await gonderildiMi(id)) throw new Error("Bu sayı daha önce gönderildi");
    const b = await resend("/broadcasts", {
      method: "POST",
      body: JSON.stringify({ audience_id: audience, from: from(), subject: sayi.subject, html: renderNewsletter(sayi, base), name: `sayi-${id}` }),
    });
    await resend(`/broadcasts/${b.id}/send`, { method: "POST", body: "{}" });
    return { mod: "canli" as const, alici: "aboneler" };
  }
  const to = testAlicilar();
  if (!to.length) throw new Error("BULTEN_TEST_TO tanımlı değil");
  await resend("/emails", {
    method: "POST",
    body: JSON.stringify({
      from: from(),
      to,
      subject: sayi.subject,
      html: renderNewsletter(sayi, base).replace("{{{RESEND_UNSUBSCRIBE_URL}}}", `${base}/blog`),
    }),
  });
  return { mod: "test" as const, alici: to.join(", ") };
}
