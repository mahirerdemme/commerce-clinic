# Açık işler

Yayın ve duyuru öncesi bakılacaklar. Brief v2'nin "Öncelik sırası" ile birlikte okunur; burada kodda bırakılan yer tutucular, bekleyen kararlar ve kontroller tutulur. İş kapandıkça satır silinir.

## Bağlantılar

| Ne | Adres |
|---|---|
| Canlı site | https://thecommerceclinic.com (GoDaddy DNS → Vercel; www ve eski commerce-clinic-ashen.vercel.app buraya 308 yönlenir; arama motorlarına açık, `SITE_INDEXABLE=true`) |
| GitHub repo | https://github.com/mahirerdemme/commerce-clinic (`main`'e push = canlıya yayın) |
| Vercel projesi | https://vercel.com/mahirs-projects-6bc6f63f/commerce-clinic |
| Bülten zamanlanmış görevi | https://claude.ai/code/routines/trig_017yvEzHwwA8ho1kK9mEvNTm (duraklatıldı) |
| Resend | https://resend.com (hesap: mahirerdemme@gmail.com); alan adı doğrulandı |
| Local geliştirme | `cd ~/Desktop/commerce_clinic && npm run dev` → http://localhost:3000 |
| Brief (tek kaynak) | Commerce Clinic Master Brief v2: `~/Downloads/Commerce-Clinic-Master-Brief-v2.pdf` (eski v1.0 `.md` dosyaları masaüstünde, geçersiz) |
| Marka dosyaları | `~/Desktop/Commerce-Clinic-Logo-Pack-v2.1*`, `Commerce-Clinic-Brand-Identity-Board-v1.png` |

## Yer tutucular

Kodda köşeli parantezle yer tutucu kalmadı (23 Ekim 2026). Karar ve eksikler:

| Ne | Durum |
|---|---|
| Şirket unvanı, adres, vergi dairesi/no, MERSİS, KEP | **Şimdilik yok** (Kadir kararı). Yasal metinlerde veri sorumlusu "Commerce Clinic" + hello@ olarak duruyor; bilgiler gelince `public/legal/kvkk.html` (1. madde), `ticari-ileti.html` ve e-posta alt bilgisi (`lib/email/newsletter.ts`) eklenecek. Aydınlatma metni için veri sorumlusunun tam kimliği hukuken gerekli; hukukçu okumasında açılır. |
| Saklama süreleri | Görüşme talebi 2 yıl, rehber 1 yıl, bülten onay kayıtları 3 yıl, log 2 yıl olarak yazıldı; hukukçu teyit edecek. |
| Bülten aracı | Resend (form ve rehber e-postalarıyla aynı). Brevo seçeneği kalktı. |
| Kurumsal e-posta sağlayıcısı | Henüz seçilmedi; metinlerde adı geçmiyor. Seçilince gizlilik ve KVKK metnindeki alıcı listesine eklenecek. Karar: 3 adres, mahir@ (kişisel), hello@ (formlar, genel iletişim, yasal metinler), notes@ (bülten gönderen). |
| GA4 ölçüm kimliği | Çerez tablosunda `_ga_*` olarak yazıldı. |
| "Son güncelleme" tarihi | 23 Ekim 2026. Metin değişince güncellenir. |

## Onaylanan içerik (23 Ekim 2026)

Eski "taslak" etiketlerinin işaret ettiği yerler Mahir ve Kadir tarafından onaylandı: rakamlar (10+ yıl, 1.000+ marka, 2.000+ proje), kapanış güvence metni, referans marka logoları (izin var), platform logoları. Platform logolarının altına "Logolar ilgili firmaların tescilli markalarıdır; resmî bir ortaklık anlamına gelmez." notu eklendi (ana sayfa).

## Kararlar

- **Tema dengesi (Kadir, 12 Ekim 2026; kalıcı tasarım ilkesi, Master Brief v2'ye ek):** sitede beyaz ve siyah bölümler arasındaki denge her yerde korunur. Header, açılan menü, yukarı çık butonu gibi bölümün üstüne binen öğeler altındaki bölümün temasını izler: siyah bölümde (footer ve kapanış CTA'sı dahil) siyah, beyazda beyaz. Tek istisna rehber kartı: açık bölümde tam beyaz, koyu bölümde şeffaf çerçeveli. Yeni bir koyu bölüm eklenirse header'ın tema algısına (`public/js/*.js`, `.chapter,.cta-final,.footer`) eklenmeli. (Not: Master Brief PDF'i Kadir'den geliyor, burada kodlanmadı; bu satır ve mobil ilkeler `docs/master-brief-v2-ek.md`'de brief'e eklenecek not olarak duruyor.)
- **Kod temizliği ve cihaz uyumu (Kadir, 12 Ekim 2026):** kullanılmayan kural bırakılmaz; geri alınan her değişiklik CSS/JS'ten de silinir. Animasyonlu her parça Android dahil kontrol edilir: `prefers-reduced-motion`, `backdrop-filter` yedeği, kısa ekran (yatay telefon), tablet (761-860px), 320px genişlik.

- Yasal metinlerin hukukçu son okuması (4 metin).
- Yurt dışı aktarım için standart sözleşmeler (Vercel, Resend, Cloudflare, Google, bülten aracı) imzalanıp KVKK'ya bildirilmeli; metinler bunu taahhüt ediyor.

- Çerez bandında "Kabul et" ve "Reddet" eşit görünürlükte (23 Ekim 2026); "Tercihler" metin bağlantısı olarak durur.

- Bülten onay kutusu: "Aydınlatma Metni kapsamında ticari ileti onayı veriyorum." Kutu yalnız ticari ileti onayı veriyor, aydınlatmaya atıf yapıyor; hukukçu okumasında teyit edilmeli.

## Teknik, bağlantı bekleyen

- Formlar bağlandı (23 Ekim 2026): `/api/gorusme`, `/api/rehber`, `/api/bulten/abone` (`lib/email/forms.ts`). Bildirimler `FORM_TO` adresine (hello@) gider; hello@ ImprovMX ile Gmail'e yönlenir (alias: hello, notes, mahir ve * → Gmail; MX/SPF GoDaddy'de; 23 Ekim 2026'da dış gönderimle doğrulandı). Bülten onay kaydı (tarih, kaynak, metin sürümü) her kayıtta ekibe e-postayla düşer. Bot koruması (24 Ekim 2026): imzalı zaman damgası (`/api/form-token`, form 2 sn'den hızlı gönderilirse reddedilir), gizli tuzak alanı (`cc_nick`), IP sınırı, aynı adrese 10 dakikada en fazla 1 e-posta ve günlük toplam e-posta üst sınırı (Resend kaydından sayılır; `FORM_GUNLUK_SINIR`, varsayılan 80). Bülten kaydı çift onaylı: `/api/bulten/abone` onay e-postası gönderir, `/api/bulten/onayla` kitleye ekler. Hâlâ yok: gerçek CAPTCHA (Cloudflare Turnstile; hesap gerekir, eklenirse yasal metinlere geri yazılır). Bilinen sınır: günlük üst sınır dolarsa meşru talepler de geçici olarak reddedilir. 
- Çerez bandı Consent Mode v2 ile çalışıyor; GTM (`NEXT_PUBLIC_GTM_ID`) canlıda, GA4 etiketi GTM içinde Consent Mode **temel (basic)** ayarıyla: onay yoksa etiket hiç çalışmaz, Google'a veri gitmez. GA4 akış URL'si www'suz yapılacak (Kadir).
- Örnek rapor sayfasında (`/ornek-rapor`) footer'da çerez tercihleri bağlantısı yok; bant orada da çıkıyor.

## Ücretsiz rehber

- Tanıtım sayfası `/rehber/e-ticaret-altyapi-gecisi` indexlenir. Form doldurana `/rehber/e-ticaret-altyapi-gecisi/kontrol-listesi` bağlantısı verilir; bu sayfa noindex ve sitemap dışı, ama şifreli değil.
- 78 kontrol maddesi var; 13'ü koşullu etiketli, her madde × ile kaldırılabilir (`design/kontrol-listesi/altyapi-gecisi.mjs`). Mahir son okumayı yapmalı. Madde değişince script yeniden çalıştırılır; tanıtım sayfasındaki adım listesi de güncellenir.
- Her madde × ile listeden kaldırılabilir; adımın altında "N madde kaldırıldı · Göster" ile geri alınır. Kullanıcı kendi maddesini ekleyemez (karar: liste bizim uzmanlığımız, link de kısa kalsın).
- İlerleme tarayıcıda tutulur (Safari 7 gün girilmezse siler). "İlerlemeyi kaydet" durumu bağlantının `#k=` kısmına yazar: her cihazda açılır, ekiple paylaşılır, sunucuya gitmez. Madde sırası değişirse kod sürümü (`1.`) artırılmalı.

## Yönetim paneli (/yonetim)

Gizli iç panel (23-24 Ekim 2026): adres herkese 404 döner; yalnızca gizli anahtarlı bağlantı (`/yonetim?k=<YONETIM_GIRIS>`) giriş formunu açar, sonra parola (`YONETIM_PAROLA`) istenir. Anahtar ve parola Vercel ortam değişkenlerinde. Parola Vercel'de `YONETIM_PAROLA` (değiştirmek için ortam değişkenini güncelleyip yeniden yayınla); oturum çerezi `BULTEN_SECRET` ile imzalanır. İçerik: gönderim modu ve adresler (salt okunur), e-posta alan adı durumu, bülten sayıları (önizle ve onayla bağlantısı, gönderildi mi), aboneler (silme). Kod: `app/yonetim`, `lib/yonetim.ts`, `app/api/yonetim/*`. Ayarlar panelden değiştirilemez; bunun için Vercel API anahtarı gerekir (yapılmadı).

## Örnek rapor (/ornek-rapor)

- **Dil ve sayılar elden geçecek (Kadir):** rapor yapay zekâ yazmış gibi duruyor. "%38 etkisi" gibi hesaplanmış görünen ama dayanağı olmayan sayılar çıkarılacak; bugün `public/js/ornek-rapor.js` içinde 14 yüzde ifadesi var. Gerçek raporda inceleme ve yorumlar danışmanın kendisinin; yapay zekâ yalnız cümleyi toparlar. Ton insan ve danışman sesi olacak.
- **Yapay zekâ işareti yalnız Overview'da:** "burası yapay zekâ ile özetlendi" notu yalnız Health Overview kısmında olacak, raporun geri kalanında olmayacak. (Not: önceki turda Health notu "AI'sız" yazılmıştı; bu karar onun yerine geçiyor, uygularken teyit edilecek.)
- **Puanlar:** 0–100 puan kalıyor (Kadir). Puan bulgulardan gelir: kritik bulgusu çok olan alan düşük, bulgusu az ve güçlü yönü çok olan yüksek puan alır. Etiketler (Sağlıklı / Gelişmeli / Öncelikli; Kritik / Yüksek / Orta / Düşük) yanında kalır. Puanın nasıl anlatılacağı ve iç puan tablosu en sonda konuşulacak. Bulgulardaki sayılar yalnız markanın kendi verisinden ve kaynağıyla (GA4, Search Console vb.).
- Görseller kurgusal "Loma Ev" mağazası için tasarlandı (`design/rapor-gorselleri/`). Brief'teki "sahte arayüz yok" kuralına örnek rapor için bilinçli istisna; gerçek raporda ekranlar müşterinin kendi sitesinden alınır.
- Giriş (e-posta + tek kullanımlık kod), davet e-postaları, aksiyon durumu ve sorumlu kaydı şu an tarayıcıda simüle ediliyor. Sunucu tarafı ilk gerçek Check-up gelince kurulacak (brief: sonraki faz).
- Final görüşmesi notları: `R.finalNotes` doldurulunca rapor kendiliğinden Sürüm 1.1 olur.

## İçerik, SEO, bülten ve sosyal medya

Blog yazma, yazım dili, SEO, bülten ve sosyal medya üretimi ayrı dosyada: [icerik-ve-sosyal.md](icerik-ve-sosyal.md).

## Mobil ve sayfa geçişi (özet)

- Mobil revizyon tamamlandı (Ekim 2026): ana sayfa, Check-up, Danışmanlık, Hakkımızda, Commerce Notes, blog, rehber ve footer/menü ≤860px'te elden geçti; Kadir ekran görüntüleriyle revize verdi. Mobil kararlar ve ilkeler: `docs/master-brief-v2-ek.md`. Yerel kontrol: `node scripts/mobil-ss.mjs <url> <png> [y] [yükseklik]` (önce `npm run build && npx next start -p 3100`).
- Kalan küçük takılma: Danışmanlık ve rehber açılışında sayfa geçişinde 100-200 ms kare düşmesi (sayfanın ağırlığından; gerçek çözüm sayfa CSS'ini küçültmek, ayrı ve büyük iş; karar: şimdilik böyle).
- Bakılmadı: Kontrol listesi sayfası, Örnek rapor ve yasal sayfaların mobil görünümü; gerçek iPhone/Android'de dokunma ve kaydırma elle doğrulanmadı.
- Ana sayfa hero görseli Check-up hero'suyla çok benzer; ileride farklı bir görsel düşünülebilir (Kadir).
