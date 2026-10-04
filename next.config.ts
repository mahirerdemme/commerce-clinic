import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    // Görüşme Planla bir popup; adres doğrudan açılırsa ana sayfada popup açılır
    return [{ source: "/gorusme-planla", destination: "/#gorusme-planla", permanent: false }];
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
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
