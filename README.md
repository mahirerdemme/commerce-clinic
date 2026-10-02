# Commerce Clinic — thecommerceclinic.com

Next.js 16 (App Router, statik üretim) · Vercel. Backend yok.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # canlı derleme kontrolü
```

## Yapı

| Sayfa | Route | Markup | Stil | Davranış |
|---|---|---|---|---|
| Ana sayfa | `/` | `content/pages/home.html` | `styles/home.css` | `public/js/home.js` |
| Commerce Check-up | `/check-up` | `content/pages/check-up.html` | `styles/check-up.css` | `public/js/check-up.js` |
| Danışmanlık | `/danismanlik` | `content/pages/danismanlik.html` | `styles/danismanlik.css` | `public/js/danismanlik.js` |
| Hakkımızda | `/hakkimizda` | `content/pages/hakkimizda.html` | `styles/hakkimizda.css` | `public/js/hakkimizda.js` |
| Commerce Notes | `/commerce-notes` | `content/pages/commerce-notes.html` | `styles/commerce-notes.css` | `public/js/commerce-notes.js` |
| Örnek rapor (noindex) | `/ornek-rapor` | `content/pages/ornek-rapor.html` | `styles/ornek-rapor.css` | `public/js/ornek-rapor.js` |

- Sayfalar onaylı HTML prototiplerinden birebir taşındı (`lib/legacy-page.tsx`). Metin/görsel revizesi ilgili `content/pages/*.html` dosyasında yapılır.
- Sayfa başlığı, açıklama, canonical, OG ve JSON-LD: `data/pages.json`.
- Görseller `public/media/`, font Inter (self-host, `@fontsource-variable/inter`).
- Sayfalar arası geçiş tam sayfa yüklemesi; her sayfa yalnızca kendi CSS'ini yükler.
- Ortak parçalar (header, footer, Görüşme Planla popup'ı) şimdilik her sayfanın HTML'inde ayrı ayrı duruyor. Bir sonraki adım bunları React bileşenlerine ayırmak.

## Arama motoru görünürlüğü

Site varsayılan olarak **noindex** yayınlanır (robots.txt: `Disallow: /`). Canlı alan adına geçince Vercel → Settings → Environment Variables:

```
SITE_INDEXABLE=true
```

## Yayın

- Vercel Git entegrasyonu: `main`'e her push canlıya, her PR önizleme linkine gider.
- GitHub Actions (`.github/workflows/ci.yml`): her push/PR'da tip kontrolü + build.

## Açık işler

- Formlar (Görüşme Planla, PDF rehber, bülten) arayüzde çalışıyor, gönderim yok. Bağlanacak servis: Resend / Formspree vb.
- Yasal metinler (KVKK, Gizlilik, Çerez) ve çerez bandı + Consent Mode v2.
- Commerce Notes yazı detay sayfaları ve gerçek içerik.
- OG görselleri (`/og/*.png`) ve `logo.png` henüz yok.
