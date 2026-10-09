import "@/styles/fonts.css";
import "@/styles/legal.css";
import type { Metadata } from "next";
import { preload } from "react-dom";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

/** Google Consent Mode v2: onay gelene kadar her şey "reddedildi"; önceki tercih cc-consent çerezinden okunur (public/js/consent.js) */
const consentDefault = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var c=(document.cookie.match(/(?:^|; )cc-consent=([^;]*)/)||[])[1];c=c&&decodeURIComponent(c);
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:c==='1|a'?'granted':'denied',wait_for_update:500});`;

/** Üst duyuru şeridi: × ile kapatıldıysa (localStorage cc-topbar) sayfa boyanmadan gizlenir; tıklama dinleyicisi de burada (styles/ortak.css) */
const topbarScript = `try{if(localStorage.getItem('cc-topbar')==='1')document.documentElement.classList.add('topbar-off')}catch(e){}
addEventListener('click',function(e){var b=e.target&&e.target.closest&&e.target.closest('.topbar-x');if(!b)return;document.documentElement.classList.add('topbar-off');try{localStorage.setItem('cc-topbar','1')}catch(err){}});`;

/** GTM yalnız Vercel'de NEXT_PUBLIC_GTM_ID girilince yüklenir; etiketler Consent Mode'a uyar */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const gtm = (id: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${id}');`;

/** Site içi linkin üzerine gelindiğinde hedef sayfa arka planda hazırlanır; tıklayınca anında açılır. */
const speculationRules = {
  prerender: [
    {
      where: {
        and: [
          { href_matches: "/*" },
          { not: { selector_matches: "[data-page], [target=_blank]" } },
          // yasal metinler panelde açılır (public/js/legal.js)
          { not: { href_matches: ["/kvkk", "/gizlilik", "/cerez-politikasi", "/ticari-ileti"] } },
        ],
      },
      eagerness: "moderate",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // font CSS okunmadan indirilmeye başlasın (styles/fonts.css)
  preload("/fonts/inter-latin-opsz.woff2", { as: "font", type: "font/woff2", crossOrigin: "" });
  preload("/fonts/inter-latin-ext-opsz.woff2", { as: "font", type: "font/woff2", crossOrigin: "" });
  return (
    <html lang="tr" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: consentDefault }} />
        <script dangerouslySetInnerHTML={{ __html: topbarScript }} />
        {GTM_ID && <script dangerouslySetInnerHTML={{ __html: gtm(GTM_ID) }} />}
      </head>
      <body suppressHydrationWarning>
        {children}
        <script src="/js/legal.js" async />
        <script src="/js/consent.js" async />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }} />
      </body>
    </html>
  );
}
