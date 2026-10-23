import "./yonetim.css";
import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { girisliMi, ayarliMi } from "@/lib/yonetim";
import { imza, mod, siteBase, testAlicilar } from "@/lib/email/bulten";
import { gunlukSinir, sonEpostalar, sonGunSayisi } from "@/lib/email/forms";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Yönetim | Commerce Clinic", robots: { index: false, follow: false } };

type Q = { searchParams: Promise<{ [k: string]: string | string[] | undefined }> };
type Kisi = { id: string; email: string; created_at: string; unsubscribed: boolean };

const R = "https://api.resend.com";
const rj = async (p: string) => {
  const r = await fetch(R + p, { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` }, cache: "no-store" });
  if (!r.ok) throw new Error(`Resend ${r.status}`);
  return r.json();
};
const maske = (s: string) => s.replace(/^(.{2}).*(@.*)$/, "$1…$2");
const liste = (v?: string) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const tarih = (s: string) => {
  const d = new Date(s.includes("T") ? s : s.replace(" ", "T") + "Z");
  return isNaN(+d) ? s : d.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "medium", timeStyle: "short" });
};

export default async function Page({ searchParams }: Q) {
  const q = await searchParams;
  const mesaj = String(q.mesaj ?? ""), hata = String(q.hata ?? "");

  if (!(await girisliMi())) {
    return (
      <main className="yn">
        <form className="yn-card yn-login" method="post" action="/api/yonetim/giris">
          <h1 style={{ margin: "0 0 4px", fontSize: "1.25rem" }}>Yönetim</h1>
          <p className="yn-sub">Commerce Clinic iç kullanım paneli.</p>
          {!ayarliMi() && <p className="yn-msg err">Panel henüz yapılandırılmadı (YONETIM_PAROLA).</p>}
          {hata && <p className="yn-msg err" role="alert">{hata === "sinir" ? "Çok fazla deneme. Biraz sonra tekrar deneyin." : "Parola hatalı."}</p>}
          <p style={{ margin: "12px 0" }}>
            <input className="yn-in" type="password" name="parola" placeholder="Parola" autoComplete="current-password" required autoFocus />
          </p>
          <button className="yn-btn dark" type="submit">Giriş</button>
        </form>
      </main>
    );
  }

  const audience = process.env.RESEND_AUDIENCE_ID;
  const gonderilen = await sonEpostalar();
  const [alan, kisiler, yayinlar] = await Promise.all([
    rj("/domains").then((d) => (d.data ?? []).find((x: { name: string }) => x.name === "thecommerceclinic.com")).catch(() => null),
    audience ? rj(`/audiences/${audience}/contacts`).then((d) => (d.data ?? []) as Kisi[]).catch(() => null) : Promise.resolve(null),
    rj("/broadcasts").then((d) => (d.data ?? []) as { name?: string; status?: string }[]).catch(() => []),
  ]);

  const dir = path.join(process.cwd(), "scripts/bulten/sayilar");
  const sayilar = (await fs.readdir(dir).catch(() => [] as string[]))
    .filter((f) => f.endsWith(".json")).sort().reverse()
    .slice(0, 12);
  const sayiVeri = await Promise.all(
    sayilar.map(async (f) => {
      const id = f.replace(".json", "");
      const j = JSON.parse(await fs.readFile(path.join(dir, f), "utf8"));
      const gitti = yayinlar.some((b) => b.name === `sayi-${id}` && b.status !== "draft");
      return { id, issue: j.issue as number, date: j.date as string, subject: j.subject as string, gitti };
    }),
  );

  const canli = mod() === "canli";
  const aktif = (kisiler ?? []).filter((k) => !k.unsubscribed);
  const base = siteBase();

  return (
    <main className="yn">
      <div className="yn-w">
        <div className="yn-top">
          <div><h1>Yönetim</h1><p>Commerce Clinic · bülten ve formlar</p></div>
          <form method="post" action="/api/yonetim/cikis"><button className="yn-btn" type="submit">Çıkış</button></form>
        </div>

        {mesaj === "silindi" && <p className="yn-msg">Abone kitleden silindi.</p>}
        {(mesaj === "hata" || mesaj === "gecersiz") && <p className="yn-msg err">İşlem yapılamadı.</p>}

        <section className="yn-card" aria-labelledby="y-durum">
          <h2 id="y-durum">Durum ve ayarlar</h2>
          <p className="yn-sub">Bu değerler Vercel ortam değişkenlerinden gelir; değiştirmek için Vercel → Settings → Environment Variables.</p>
          <dl className="yn-dl">
            <dt>Bülten gönderim modu</dt>
            <dd><span className={`yn-tag ${canli ? "ok" : "warn"}`}>{canli ? "Canlı: tüm abonelere" : "Test: yalnız test adreslerine"}</span> <small>(BULTEN_MODE)</small></dd>
            <dt>Gönderen (bülten)</dt><dd>{process.env.BULTEN_FROM ?? "Commerce Notes <onboarding@resend.dev>"}</dd>
            <dt>Gönderen (formlar)</dt><dd>{process.env.FORM_FROM ?? "Commerce Clinic <hello@thecommerceclinic.com>"}</dd>
            <dt>Form bildirimleri</dt><dd>{liste(process.env.FORM_TO).join(", ") || "hello@thecommerceclinic.com"}</dd>
            <dt>Bülten onay alıcıları</dt><dd>{liste(process.env.BULTEN_ONAY_TO).map(maske).join(", ") || "tanımlı değil"}</dd>
            <dt>Bülten test alıcıları</dt><dd>{testAlicilar().map(maske).join(", ") || "tanımlı değil"}</dd>
            <dt>E-posta alan adı</dt>
            <dd>{alan ? <span className={`yn-tag ${alan.status === "verified" ? "ok" : "warn"}`}>{alan.status === "verified" ? "Doğrulandı" : alan.status}</span> : <span className="yn-tag bad">Okunamadı</span>} thecommerceclinic.com · Resend</dd>
            <dt>Abone listesi</dt><dd>{audience ? (kisiler ? <span className="yn-tag ok">Bağlı</span> : <span className="yn-tag bad">Okunamadı</span>) : <span className="yn-tag bad">Tanımlı değil</span>}</dd>
          </dl>
        </section>

        <section className="yn-card" aria-labelledby="y-hacim">
          <h2 id="y-hacim">Hacim ve koruma</h2>
          <p className="yn-sub">Bot saldırısı ya da olağandışı yoğunluk belirtisi: sitenin son 24 saatte gönderdiği e-posta sayısı.</p>
          {gonderilen ? (() => {
            const n = sonGunSayisi(gonderilen), sinir = gunlukSinir();
            const son = gonderilen.filter((m) => Date.parse((m.created_at ?? "").replace(" ", "T").replace(/\+00$/, "Z")) > Date.now() - 24 * 3600 * 1000);
            const talep = son.filter((m) => (m.subject ?? "").startsWith("Yeni görüşme talebi")).length;
            const bulten = son.filter((m) => (m.subject ?? "").includes("aboneliğinizi onaylayın")).length;
            const uyari = son.filter((m) => (m.subject ?? "").startsWith("[Uyarı]")).length;
            const dur = n >= sinir ? "bad" : n >= sinir * 0.75 ? "warn" : "ok";
            return (
              <dl className="yn-dl">
                <dt>Son 24 saat, toplam e-posta</dt>
                <dd><span className={`yn-tag ${dur}`}>{n} / {sinir}</span> {dur === "ok" ? "normal" : dur === "warn" ? "yüksek: uyarı e-postası gönderildi" : "günlük sınıra ulaşıldı, yeni formlar geçici reddediliyor"}</dd>
                <dt>Görüşme talebi</dt><dd>{talep}</dd>
                <dt>Bülten onay isteği</dt><dd>{bulten}</dd>
                <dt>Uyarı e-postası</dt><dd>{uyari ? "gönderildi" : "yok"}</dd>
              </dl>
            );
          })() : <p className="yn-msg err">Sayaç okunamadı.</p>}
          <p className="yn-note">Engellenen denemeler (tuzak alanı, jetonsuz ya da çok hızlı istek, IP sınırı) kişisel veri tutulmadan Vercel kayıtlarına yazılır: Vercel → proje → Logs → "[koruma]" ara. Saldırı sürerse Vercel → Firewall → Attack Challenge Mode açılabilir; kalıcı çözüm Cloudflare Turnstile.</p>
        </section>

        <section className="yn-card" aria-labelledby="y-sayilar">
          <h2 id="y-sayilar">Bülten sayıları</h2>
          <p className="yn-sub">Son 12 sayı. "Önizle ve onayla" sayfası gönderimi buradan da yapabilirsiniz.</p>
          <table className="yn-t">
            <thead><tr><th>Sayı</th><th>Konu</th><th>Tarih</th><th>Durum</th><th></th></tr></thead>
            <tbody>
              {sayiVeri.map((s) => (
                <tr key={s.id}>
                  <td>{s.issue}</td>
                  <td>{s.subject}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{s.date}</td>
                  <td>{s.gitti ? <span className="yn-tag ok">Gönderildi</span> : <span className="yn-tag">Beklemede</span>}</td>
                  <td><a className="yn-btn mini" href={`${base}/bulten/onay?id=${s.id}&t=${imza(s.id)}`} target="_blank" rel="noopener">Önizle ve onayla</a></td>
                </tr>
              ))}
              {!sayiVeri.length && <tr><td colSpan={5}>Henüz sayı yok.</td></tr>}
            </tbody>
          </table>
          <p className="yn-note">Zamanlanmış görev şu an duraklatılmış durumda; yeni sayılar kendiliğinden gelmez.</p>
        </section>

        <section className="yn-card" id="aboneler" aria-labelledby="y-abone">
          <h2 id="y-abone">Aboneler ({aktif.length})</h2>
          <p className="yn-sub">Bülten ve rehber formundan ticari ileti onayı verenler. Silme talebi gelirse buradan çıkarın.</p>
          <table className="yn-t">
            <thead><tr><th>E-posta</th><th>Kayıt</th><th></th></tr></thead>
            <tbody>
              {aktif.map((k) => (
                <tr key={k.id}>
                  <td>{k.email}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{tarih(k.created_at)}</td>
                  <td>
                    <form method="post" action="/api/yonetim/abone-cikar">
                      <input type="hidden" name="id" value={k.id} />
                      <button className="yn-btn mini" type="submit">Çıkar</button>
                    </form>
                  </td>
                </tr>
              ))}
              {!aktif.length && <tr><td colSpan={3}>Henüz abone yok.</td></tr>}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
