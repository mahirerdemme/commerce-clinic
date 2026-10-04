import "@/styles/not-found.css";
import { logoSvg } from "@/lib/legal";

export const metadata = { title: { absolute: "Sayfa bulunamadı | Commerce Clinic" }, robots: { index: false } };

const LINKS = [
  ["/check-up", "Commerce Check-up", "8 alanda teşhis ve 90 günlük plan"],
  ["/danismanlik", "Danışmanlık", "İhtiyaca özel e-ticaret danışmanlığı"],
  ["/hakkimizda", "Hakkımızda", "Commerce Clinic'in yaklaşımı"],
  ["/commerce-notes", "Commerce Notes", "Notlar ve ücretsiz rehberler"],
];

export default function NotFound() {
  return (
    <div className="nf">
      <header className="nf-top">
        <a className="nf-logo" href="/" aria-label="Commerce Clinic ana sayfa" dangerouslySetInnerHTML={{ __html: logoSvg() }} />
        <a className="nf-btn nf-btn-dark nf-btn-sm" href="/#gorusme-planla">Görüşme Planla</a>
      </header>
      <main className="nf-main">
        <p className="nf-code">404</p>
        <h1>Aradığınız sayfa bulunamadı.</h1>
        <p className="nf-lead">Adres değişmiş ya da sayfa kaldırılmış olabilir. Ana sayfadan ya da aşağıdaki sayfalardan devam edebilirsiniz.</p>
        <div className="nf-ctas">
          <a className="nf-btn nf-btn-dark" href="/">Ana sayfaya dön</a>
          <a className="nf-btn nf-btn-ghost" href="/#gorusme-planla">Görüşme Planla</a>
        </div>
        <nav className="nf-links" aria-label="Sayfalar">
          {LINKS.map(([href, t, d]) => (
            <a key={href} href={href}>
              <b>{t}</b>
              <span>{d}</span>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg>
            </a>
          ))}
        </nav>
      </main>
      <footer className="nf-foot">
        <span>© {new Date().getFullYear()} Commerce Clinic</span>
        <a href="mailto:hello@thecommerceclinic.com">hello@thecommerceclinic.com</a>
      </footer>
    </div>
  );
}
