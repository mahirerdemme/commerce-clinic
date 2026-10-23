import "@/styles/bulten-onay.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Abonelik | Commerce Clinic", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ [k: string]: string | string[] | undefined }> };

/** Bülten onay bağlantısının sonucu */
export default async function Page({ searchParams }: Props) {
  const d = String((await searchParams).durum ?? "");
  const ok = d === "tamam";
  return (
    <main className="bo">
      <div className="bo-card">
        <p className="bo-e">Commerce Notes</p>
        <h1>{ok ? "Aboneliğiniz onaylandı" : d === "gecersiz" ? "Bağlantı geçersiz ya da süresi dolmuş" : "Şu an tamamlanamadı"}</h1>
        <p className="bo-d">
          {ok
            ? "Teşekkürler. Commerce Notes bültenini bu adrese göndereceğiz. İstediğiniz zaman e-postadaki bağlantıyla ayrılabilirsiniz."
            : d === "gecersiz"
              ? "Onay bağlantısı geçersiz ya da 2 günlük süresi dolmuş. Siteden yeniden kayıt olabilirsiniz."
              : "Lütfen biraz sonra bağlantıyı yeniden deneyin ya da hello@thecommerceclinic.com adresine yazın."}
        </p>
        <p className="bo-f"><a className="bo-btn" href="/">Siteye dön</a></p>
      </div>
    </main>
  );
}
