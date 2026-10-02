import "@fontsource-variable/inter/opsz.css";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

/** Site içi linkin üzerine gelindiğinde hedef sayfa arka planda hazırlanır; tıklayınca anında açılır. */
const speculationRules = {
  prerender: [
    {
      where: {
        and: [
          { href_matches: "/*" },
          { not: { selector_matches: "[data-page], [target=_blank]" } },
        ],
      },
      eagerness: "moderate",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" data-theme="light" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }} />
      </body>
    </html>
  );
}
