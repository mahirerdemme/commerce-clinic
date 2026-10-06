import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // bülten: kapak fontu/logoyu, onay ve gönderim sayı dosyalarını diskten okur; sunucu paketine dahil edilsin
  outputFileTracingIncludes: {
    "/api/bulten/kapak": ["./assets/fonts/**", "./public/email/**"],
    // onay sayfası ve gönderim, sayıları diskten okur
    "/bulten/onay": ["./scripts/bulten/sayilar/**"],
    "/api/bulten/gonder": ["./scripts/bulten/sayilar/**"],
  },
  async redirects() {
    // Görüşme Planla bir popup; adres doğrudan açılırsa ana sayfada popup açılır
    return [
      { source: "/gorusme-planla", destination: "/#gorusme-planla", permanent: false },
      // Commerce Notes'un eski adresi; eski #yazı bağlantıları /blog'da yazının kendi adresine yönlenir (public/js/commerce-notes.js)
      { source: "/commerce-notes", destination: "/blog", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // yasal metin parçaları yalnız panel ve sayfa için; tek başına indexlenmesin
        source: "/legal/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        // rehberler form doldurana verilen gizli bağlantılar; arama motorlarına kapalı
        source: "/rehber/:slug/kontrol-listesi",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
