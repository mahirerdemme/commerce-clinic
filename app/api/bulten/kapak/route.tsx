import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Bülten kapağı (1200×600 PNG): /api/bulten/kapak?sayi=1&tarih=7%20Ekim%202026&konular=Ölçüm,Pazaryeri,Kargo
 * Her sayı için Commerce Clinic tasarımında üretilir; haber sitelerinin görselleri telif nedeniyle kullanılmaz.
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const issue = (q.get("sayi") ?? "").slice(0, 4);
  const date = (q.get("tarih") ?? "").slice(0, 30);
  const topics = (q.get("konular") ?? "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 4);
  const root = process.cwd();
  const [font, logo] = await Promise.all([
    fs.readFile(path.join(root, "assets/fonts/Inter-600.ttf")),
    fs.readFile(path.join(root, "public/email/logo-light.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "radial-gradient(60% 90% at 100% 100%, rgba(229,131,160,.55) 0%, rgba(243,150,117,.25) 40%, rgba(10,10,10,0) 75%), radial-gradient(50% 80% at 0% 0%, rgba(139,92,246,.35) 0%, rgba(10,10,10,0) 70%)",
          color: "#FFFFFF",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={234} height={40} alt="" />
          <div style={{ display: "flex", fontSize: 26, color: "#A3A3A1" }}>
            {[issue && `Sayı ${issue}`, date].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#A3A3A1", marginBottom: 18 }}>Commerce Notes · Bülten</div>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1, letterSpacing: "-0.04em" }}>Bu hafta e-ticarette</div>
          {topics.length > 0 && (
            <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
              {topics.map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    fontSize: 26,
                    padding: "10px 22px",
                    borderRadius: 999,
                    border: "1.5px solid rgba(255,255,255,.28)",
                    backgroundColor: "rgba(255,255,255,.06)",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [{ name: "Inter", data: font, weight: 600, style: "normal" }],
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
  );
}
