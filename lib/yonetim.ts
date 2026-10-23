import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Yönetim paneli girişi (/yonetim)
 * - Parola: YONETIM_PAROLA (Vercel ortam değişkeni); oturum çerezi BULTEN_SECRET ile HMAC'lenir, parola çerezde tutulmaz
 * - Çerez: httpOnly, secure, sameSite=strict, 12 saat
 */
export const COOKIE = "cc-yonetim";
const SURE = 60 * 60 * 12;

const key = () => process.env.BULTEN_SECRET ?? "";
const token = () => crypto.createHmac("sha256", key()).update("yonetim:v1").digest("hex");

export const ayarliMi = () => !!process.env.YONETIM_PAROLA && !!key();

export function parolaDogru(girilen: string) {
  const p = process.env.YONETIM_PAROLA ?? "";
  if (!p || !girilen) return false;
  const a = crypto.createHash("sha256").update(p).digest();
  const b = crypto.createHash("sha256").update(girilen).digest();
  return crypto.timingSafeEqual(a, b);
}

/** Giriş sayfasını açan gizli anahtar (?k=): anahtarsız ziyaretçi 404 görür, giriş formu bile görünmez */
export function anahtarDogru(k: string) {
  const a = process.env.YONETIM_GIRIS ?? "";
  if (!a || !k) return false;
  const x = crypto.createHash("sha256").update(a).digest();
  const y = crypto.createHash("sha256").update(k).digest();
  return crypto.timingSafeEqual(x, y);
}

export const cerezDegeri = () => token();
export const cerezOpts = (maxAge = SURE) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
});

export async function girisliMi() {
  if (!ayarliMi()) return false;
  const v = (await cookies()).get(COOKIE)?.value ?? "";
  if (!/^[a-f0-9]{64}$/.test(v)) return false;
  return crypto.timingSafeEqual(Buffer.from(v), Buffer.from(token()));
}

/** aynı site içinden gelen istek mi (CSRF için ek koruma; sameSite=strict zaten çerezi keser) */
export function ayniSite(req: Request) {
  const o = req.headers.get("origin");
  if (!o) return false;
  try {
    return new URL(o).host === new URL(req.url).host;
  } catch {
    return false;
  }
}
