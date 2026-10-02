import "@fontsource-variable/inter/opsz.css";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" data-theme="light" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
