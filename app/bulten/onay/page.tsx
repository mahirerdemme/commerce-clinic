import "@/styles/bulten-onay.css";
import type { Metadata } from "next";
import { imzaGecerli, mod, sayiOku, siteBase, testAlicilar, gonderildiMi } from "@/lib/email/bulten";
import { renderNewsletter } from "@/lib/email/newsletter";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bülten onayı | Commerce Clinic", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ [k: string]: string | string[] | undefined }> };

/** Bülten onay sayfası: önizleme e-postasındaki "Onayla ve gönder" buraya gelir. Sayfayı açmak göndermez; gönderim formdaki butonla olur. */
export default async function Page({ searchParams }: Props) {
  const q = await searchParams;
  const id = String(q.id ?? ""), t = String(q.t ?? ""), durum = String(q.durum ?? ""), hata = String(q.hata ?? "");
  const ok = imzaGecerli(id, t);
  const sayi = ok ? await sayiOku(id) : null;

  if (!ok || !sayi) {
    return (
      <main className="bo">
        <div className="bo-card">
          <p className="bo-e">Commerce Notes · Bülten</p>
          <h1>Bağlantı geçersiz</h1>
          <p className="bo-d">Bu onay bağlantısı geçersiz ya da sayı bulunamadı. Önizleme e-postasındaki bağlantıyı kullanın.</p>
        </div>
      </main>
    );
  }

  const canli = mod() === "canli";
  const gitti = durum === "gonderildi" || (canli && (await gonderildiMi(id).catch(() => false)));
  const alici = canli ? "tüm abonelere" : `yalnız test adreslerine (${testAlicilar().join(", ") || "tanımlı değil"})`;

  return (
    <main className="bo">
      <div className="bo-card">
        <p className="bo-e">Commerce Notes · Sayı {sayi.issue} · {sayi.date}</p>
        <h1>{sayi.subject}</h1>
        {gitti ? (
          <p className="bo-ok" role="status">Gönderildi. Bu sayı {canli ? "abonelere" : "test adreslerine"} iletildi.</p>
        ) : (
          <>
            <p className="bo-d">
              Bu sayı henüz gönderilmedi. Onaylarsanız {alici} gönderilir.
              {!canli && " Alan adı doğrulanınca abonelere gönderim açılacak."}
            </p>
            {hata && <p className="bo-err" role="alert">Gönderilemedi: {hata}</p>}
            <form method="post" action="/api/bulten/gonder" className="bo-f">
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="t" value={t} />
              <button type="submit" className="bo-btn">{canli ? "Abonelere gönder" : "Test adreslerine gönder"}</button>
            </form>
          </>
        )}
      </div>
      <iframe className="bo-prev" title="Bülten önizlemesi" srcDoc={renderNewsletter(sayi, siteBase())} sandbox="" />
    </main>
  );
}
