# Açık işler

Yayın ve duyuru öncesi bakılacaklar. Brief v2'nin "Öncelik sırası" ile birlikte okunur; burada kodda bırakılan yer tutucular, bekleyen kararlar ve kontroller tutulur. İş kapandıkça satır silinir.

## Yer tutucular (kodda köşeli parantezle duruyor)

| Ne | Nerede | Kimden |
|---|---|---|
| Şirket unvanı, adres, vergi dairesi/no, MERSİS, KEP | `public/legal/kvkk.html`, `ticari-ileti.html` | Mahir |
| "Son güncelleme" tarihi | `public/legal/*.html` (4 metin) | Yayın günü |
| Saklama süreleri: görüşme talebi [2 yıl], rehber [1 yıl], log [2 yıl], bülten onay kayıtları [3 yıl] | `public/legal/kvkk.html` | Mahir + hukukçu |
| Bülten aracı: Brevo mu Resend mi | `kvkk.html`, `gizlilik.html`, `ticari-ileti.html` | Karar (brief: açık karar) |
| Kurumsal e-posta sağlayıcısı: Google Workspace mı Zoho mu | `kvkk.html`, `gizlilik.html` | Kadir |
| GA4 ölçüm kimliği (`_ga_[ölçüm kimliği]`) | `public/legal/cerez-politikasi.html` | GA4 kurulunca |

## Kararlar

- Yasal metinlerin hukukçu son okuması (4 metin).
- Yurt dışı aktarım için standart sözleşmeler (Vercel, Resend, Cloudflare, Google, bülten aracı) imzalanıp KVKK'ya bildirilmeli; metinler bunu taahhüt ediyor.
- Ana sayfa hero şeridindeki referans marka logoları (Myvia, Tromox, Alfemo, Gözde Grubu, Kelebek…): kullanım izni var mı? Yoksa kaldırılmalı. (Mahir)
- Rakamlar: sitede 10+ yıl / 1.000+ marka / 2.000+ proje, portfolyoda 8+ yıl / 500+ marka. (Mahir)

- Çerez bandında "Reddet" yazılı buton yok; reddetme sağ üstteki çarpıyla ve Tercihler'deki "Tümünü reddet"le. KVKK çerez rehberi reddetmenin kabul kadar görünür olmasını istiyor; hukukçu okumasında sorulmalı.

- Bülten onay kutusu: "Aydınlatma Metni kapsamında ticari ileti onayı veriyorum." Kutu yalnız ticari ileti onayı veriyor, aydınlatmaya atıf yapıyor; hukukçu okumasında teyit edilmeli.

## Teknik, bağlantı bekleyen

- Formlar hâlâ hiçbir yere göndermiyor (Resend + alan adı + hello@ gerekiyor). Onay metinleri hazır; gönderim bağlanınca onay kaydı (tarih, kaynak, metin sürümü) da saklanmalı.
- Çerez bandı Consent Mode v2 ile hazır; GTM kimliği `NEXT_PUBLIC_GTM_ID` olarak Vercel'e girilince GTM yüklenir. GA4 etiketi GTM içinde, Consent Mode **temel (basic)** ayarıyla kurulmalı: onay yoksa etiket hiç çalışmaz, Google'a veri gitmez.
- Örnek rapor sayfasında (`/ornek-rapor`) footer'da çerez tercihleri bağlantısı yok; bant orada da çıkıyor.

## Ücretsiz rehber

- Tanıtım sayfası `/rehber/e-ticaret-altyapi-gecisi` indexlenir. Form doldurana `/rehber/e-ticaret-altyapi-gecisi/kontrol-listesi` bağlantısı verilir; bu sayfa noindex ve sitemap dışı, ama şifreli değil.
- 78 kontrol maddesi var; 13'ü koşullu ve "Bizde yok" ile çıkarılabilir (`design/kontrol-listesi/altyapi-gecisi.mjs`). Mahir son okumayı yapmalı. Madde değişince script yeniden çalıştırılır; tanıtım sayfasındaki adım listesi de güncellenir.
- Her madde × ile listeden kaldırılabilir; adımın altında "N madde kaldırıldı · Göster" ile geri alınır. Kullanıcı kendi maddesini ekleyemez (karar: liste bizim uzmanlığımız, link de kısa kalsın).
- İlerleme tarayıcıda tutulur (Safari 7 gün girilmezse siler). "İlerlemeyi kaydet" durumu bağlantının `#k=` kısmına yazar: her cihazda açılır, ekiple paylaşılır, sunucuya gitmez. Madde sırası değişirse kod sürümü (`1.`) artırılmalı.
- Teşekkür metni "bir kopyasını e-postanıza da gönderdik" diyor; Resend bağlanınca bağlantı gerçekten e-postayla gitmeli.

## Mobil revizyon

- Kadir tüm sayfaları mobilde gezip belirli alanlar için revize listesi verecek; gelince sayfa sayfa ele alınacak.

## Blog (Commerce Notes) ve rehberler · SEO

Hedef: blog yazılarından SEO'da olabildiğince verim almak. Yazılar Kadir'le birlikte yazılacak.

- Adres yapısı kuruldu:
  - Liste: `/blog` (`/commerce-notes` 308 ile buraya yönlenir).
  - Yazı: `/blog/<yazi>`.
  - Rehber tanıtımı: `/rehber/<rehber>`.
  - Form sonrası kontrol listesi: `/rehber/<rehber>/kontrol-listesi` (noindex).
  - Eski `#yazı` bağlantıları JS ile yeni adreslere gider.
  - Yazı ve rehber sayfalarında Article/BlogPosting + BreadcrumbList var, rehberde FAQPage de var.
  - Yeni yazı eklerken: `content/pages/<slug>.html`, `data/pages.json`, `app/blog/<yazi>/page.tsx`; davranış `commerce-notes.js`'ten (`"js": "commerce-notes"`).
- Slug'da yıl yok. Yıl gerekiyorsa başlıkta durur ("… (2026)") ve yazı güncellenince değişir; adres kalıcı kalır.
- Her yazı için:
  - kendi adresi, benzersiz title ve description, canonical;
  - kendi OG görseli;
  - Article + BreadcrumbList yapısal verisi, SSS varsa FAQPage;
  - yazar Mahir Erdem ve yazar sayfası;
  - datePublished/dateModified, sitemap'te lastmod;
  - Check-up, Danışmanlık ve rehberlere iç linkler.
- Google'ın yapay zekâ içerik rehberi (güncelleme: 1 Ekim 2026, developers.google.com/search/docs/fundamentals/using-gen-ai-content) ile yazı kuralları:
  - Az ama derin yazı; değer katmayan seri üretim spam sayılır.
  - Fark yaratan şey sahadan deneyim: Kadir ve Mahir anlatır, metin birlikte toparlanır.
  - Yayın öncesi elle doğrulanır: isim, tarih, fiyat, rakam, alıntı/kaynak, linkler, title/description, yapısal veri, görsel alt metinleri.
  - Yapay zekâ ile üretilen görsel kullanılırsa IPTC DigitalSourceType (TrainedAlgorithmicMedia) eklenir.
  - Üretim şeklini belirtmek önerilen ama zorunlu değil; yazar ve gerçek tarih her yazıda var.
- Yayın tarihleri gerçek olmalı; şu anki Ağustos–Eylül tarihleri yer tutucu.
- Şu an 1 gerçek yazı + 4 "yakında" başlık var.

## Örnek rapor (/ornek-rapor)

- Görseller kurgusal "Loma Ev" mağazası için tasarlandı (`design/rapor-gorselleri/`). Brief'teki "sahte arayüz yok" kuralına örnek rapor için bilinçli istisna; gerçek raporda ekranlar müşterinin kendi sitesinden alınır.
- Giriş (e-posta + tek kullanımlık kod), davet e-postaları, aksiyon durumu ve sorumlu kaydı şu an tarayıcıda simüle ediliyor. Sunucu tarafı ilk gerçek Check-up gelince kurulacak (brief: sonraki faz).
- Final görüşmesi notları: `R.finalNotes` doldurulunca rapor kendiliğinden Sürüm 1.1 olur.

