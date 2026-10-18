# Açık işler

Yayın ve duyuru öncesi bakılacaklar. Brief v2'nin "Öncelik sırası" ile birlikte okunur; burada kodda bırakılan yer tutucular, bekleyen kararlar ve kontroller tutulur. İş kapandıkça satır silinir.

## Bağlantılar

| Ne | Adres |
|---|---|
| Canlı site (geçici alan adı) | https://commerce-clinic-ashen.vercel.app |
| Asıl alan adı (henüz bağlı değil) | https://thecommerceclinic.com |
| GitHub repo | https://github.com/mahirerdemme/commerce-clinic (`main`'e push = canlıya yayın) |
| Vercel projesi | https://vercel.com/mahirs-projects-6bc6f63f/commerce-clinic |
| Bülten zamanlanmış görevi | https://claude.ai/code/routines/trig_017yvEzHwwA8ho1kK9mEvNTm |
| Resend | https://resend.com (hesap: mahirerdemme@gmail.com) |
| Local geliştirme | `cd ~/Desktop/commerce_clinic && npm run dev` → http://localhost:3000 |
| Brief (tek kaynak) | Commerce Clinic Master Brief v2: `~/Downloads/Commerce-Clinic-Master-Brief-v2.pdf` (eski v1.0 `.md` dosyaları masaüstünde, geçersiz) |
| Marka dosyaları | `~/Desktop/Commerce-Clinic-Logo-Pack-v2.1*`, `Commerce-Clinic-Brand-Identity-Board-v1.png` |

## Yer tutucular (kodda köşeli parantezle duruyor)

| Ne | Nerede | Kimden |
|---|---|---|
| Şirket unvanı, adres, vergi dairesi/no, MERSİS, KEP | `public/legal/kvkk.html`, `ticari-ileti.html` | Mahir |
| "Son güncelleme" tarihi | `public/legal/*.html` (4 metin) | Yayın günü |
| Saklama süreleri: görüşme talebi [2 yıl], rehber [1 yıl], log [2 yıl], bülten onay kayıtları [3 yıl] | `public/legal/kvkk.html` | Mahir + hukukçu |
| Bülten aracı: Brevo mu Resend mi | `kvkk.html`, `gizlilik.html`, `ticari-ileti.html` | Karar (brief: açık karar) |
| Kurumsal e-posta sağlayıcısı: açık (Google Workspace, Zoho ya da başka). Karar: 3 adres, mahir@ (kişisel), hello@ (formlar, genel iletişim, yasal metinler), notes@ (bülten gönderen). Öneri: sağlayıcı izin veriyorsa tek ücretli hesap mahir@, hello@ ve notes@ takma ad | `kvkk.html`, `gizlilik.html` | Kadir |
| GA4 ölçüm kimliği (`_ga_[ölçüm kimliği]`) | `public/legal/cerez-politikasi.html` | GA4 kurulunca |

## Kararlar

- **Tema dengesi (Kadir, 12 Ekim 2026; kalıcı tasarım ilkesi, Master Brief v2'ye ek):** sitede beyaz ve siyah bölümler arasındaki denge her yerde korunur. Header, açılan menü, yukarı çık butonu gibi bölümün üstüne binen öğeler altındaki bölümün temasını izler: siyah bölümde (footer ve kapanış CTA'sı dahil) siyah, beyazda beyaz. Tek istisna rehber kartı: açık bölümde tam beyaz, koyu bölümde şeffaf çerçeveli. Yeni bir koyu bölüm eklenirse header'ın tema algısına (`public/js/*.js`, `.chapter,.cta-final,.footer`) eklenmeli. (Not: Master Brief PDF'i Mahir'den geliyor, burada kodlanmadı; bu satır brief'e eklenecek not olarak duruyor.)
- **Kod temizliği ve cihaz uyumu (Kadir, 12 Ekim 2026):** kullanılmayan kural bırakılmaz; geri alınan her değişiklik CSS/JS'ten de silinir. Animasyonlu her parça Android dahil kontrol edilir: `prefers-reduced-motion`, `backdrop-filter` yedeği, kısa ekran (yatay telefon), tablet (761-860px), 320px genişlik.

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
- 78 kontrol maddesi var; 13'ü koşullu etiketli, her madde × ile kaldırılabilir (`design/kontrol-listesi/altyapi-gecisi.mjs`). Mahir son okumayı yapmalı. Madde değişince script yeniden çalıştırılır; tanıtım sayfasındaki adım listesi de güncellenir.
- Her madde × ile listeden kaldırılabilir; adımın altında "N madde kaldırıldı · Göster" ile geri alınır. Kullanıcı kendi maddesini ekleyemez (karar: liste bizim uzmanlığımız, link de kısa kalsın).
- İlerleme tarayıcıda tutulur (Safari 7 gün girilmezse siler). "İlerlemeyi kaydet" durumu bağlantının `#k=` kısmına yazar: her cihazda açılır, ekiple paylaşılır, sunucuya gitmez. Madde sırası değişirse kod sürümü (`1.`) artırılmalı.
- Teşekkür metni "bir kopyasını e-postanıza da gönderdik" diyor; Resend bağlanınca bağlantı gerçekten e-postayla gitmeli.

## Kaldığımız yer (13 Ekim 2026, gece)

**Biten (bu turda commit'lendi):** mobil footer düzeni (hello + sosyal "Tüm notları oku"nun altında, imza tek satır ve konteynere sığar, tablette de); sağ altta yukarı çık butonu; mobil menü (header'ın kendisi aşağı açılır, blur + karartma, çizgisiz linkler, rehber kartı, hello ve sosyal); footer ve kapanış CTA'sında header koyu tema; breadcrumb'lar tek tip hap ve 12px; kısa ekranda (yatay telefon) menü paneli kayar. Tema dengesi ilkesi "Kararlar"da.

**Açık, sıradaki iş: sayfalar arası geçişte hero "takılarak" geliyor, arka plan rengi değişir gibi görünüyor (Kadir).**
- Kadir iOS Simülatör'de (Safari, `localhost:3000`, `next dev`) test ediyor. Kayıt: `~/Desktop/Ekran Kaydı 2026-10-13 00.22.27.mov`.
- Bulgular: simülatörün Safari'sinde çapraz geçiş çalışıyor (`PageRevealEvent`, `startViewTransition` var); kayıtta eski ve yeni sayfa ~0.3 sn üst üste biniyor (açık menünün hayaleti yeni sayfanın üstünde). Chrome'da kare yakalamada çapraz geçiş yeni sayfayı ~0.6 sn bekletiyordu (214 ms + 347 ms donma), geçişi kapatınca tek 70 ms boşluk kalıyordu. Hero animasyonu çapraz geçişle aynı anda başlıyor.
- Üretim derlemesinde 390px, 4-6× yavaşlatılmış CPU'da scroll karelerinde takılma ve düzen kayması (CLS) yok; açılışta `setEh` (74 ms) ve `fitLap` (25 ms) senkron yerleşim hesaplıyor; hero rapor ekranı JS ile üretiliyor (tek karelik iş).
- Denendi ve geri alındı: (1) site içi geçişte giriş animasyonunu kapatmak (Kadir animasyon istiyor), (2) `@view-transition{navigation:none}`, (3) zorla yerleşim düzenlemeleri, (4) mobil hero giriş sürelerini kısaltmak. Hiçbiri kalıcı değil; hepsi baştan değerlendirilecek.
- Önerilen sıra: önce `npm run build && npx next start -p 3100` ile üretimde simülatörden test et (dev sunucusu gerçek hızı göstermez); sorun sürerse çapraz geçiş süresi/sıralama ve hero'yu geçişin bitişine bağlamak (`pagereveal` → `viewTransition.finished`) denenir.

**Kontrol bekleyenler:** menü açılış/kapanış ve logo genişleme animasyonlarının hareketi (yalnız durağan görüntüyle doğrulandı); gerçek iPhone ve Android'de elle bakış; Next dev konsolundaki hydration uyarısı (bizden önce de vardı); rozet ve kart renkleri koyu/açık geçişte son bir kez gözle.

## Mobil revizyon

- Kadir'in 29 ekran görüntüsü (iPhone Safari): `~/Downloads/mobil-ss/IMG_1882–1910.PNG`. Görüntü görüntü gidiliyor; Kadir revize vermeden hiçbir şey değişmez. Sıra: ana sayfa → Check-up → Danışmanlık → Hakkımızda → rehber/blog → Görüşme Planla formu.
- Yapıldı (9 Ekim): ana sayfa hero mobilde rapor ekranı en üstte, laptop çerçevesiz, altı beyaza solar, başlık hafif üstüne biner; sonrası masaüstüyle aynı sıra (açıklama → butonlar → marka şeridi); ekran ölçeklenerek sığıyor, "Örnek raporu inceleyin" butonu mobilde gizli (`styles/home.css` @720, `public/js/home.js` fitLap). Mobil yazı ölçeği tek yerden, bir kademe küçük (`styles/ortak.css`, sayfa CSS'lerinden sonra import).
- Yapıldı (9 Ekim): hero'da çerçeve Check-up'taki gibi, ekran kısa, altında küçük "Örnek raporu gör"; mobilde tek buton (Check-up). Üst şerit yeniden: × ile kapanır (localStorage `cc-topbar`, head script `app/layout.tsx`), "ÜCRETSİZ" rozet, mobilde iki satır ve koyu köşeler; kurallar `styles/ortak.css`. Marka logoları mobilde bir ton koyu.
- Yapıldı (9-10 Ekim): ana sayfa mobil bölümleri sırayla elden geçti: çalışma modelleri kartı (obje küçüldü, siyah çizgi kalktı), danışmanlık maddeleri üst üste biner, problem haritası (alan isimleri noktaların yerinde), ekosistem kartları (ekran boyunda, üst üste biner, görsel başlığın altında, "Daha fazla" şeridi logoların üstüne biner, mobilde hover kapalı), Check-up bölümü (başlık, buton, yana kayan 1-2-3, sadeleşmiş rapor ve sekmeler), son çağrı bölümü (obje butonun sağında). Sıradaki: görüntü 1884 sonrası kalanlar ve diğer sayfalar (Check-up, Danışmanlık, Hakkımızda, rehber/blog, Görüşme Planla formu).
- Tartışılacak (Kadir): ana sayfa hero görseli Check-up hero'suyla çok benzer; ileride ana sayfa için farklı bir görsel düşünülebilir.
- Kadir'in genel notları: hero alanları masaüstünde ve mobilde "takılıyor" hissi veriyor (giriş animasyonları / arka plan katmanı; incelenecek). Tekrar eden tablı bölümler (8 alan, 3'lü tablar) mobilde elden geçecek.
- Yapıldı (12 Ekim): footer mobil düzeni (hello + sosyal "Tüm notları oku"nun altında, imza tek satır ve konteynere sığar, alttan kesik), sağ altta "yukarı çık" butonu (`public/js/to-top.js`, `styles/ortak.css`; çerez bandı ve menü açıkken gizli, koyu bölümde koyu), mobil menü: header'ın kendisi aşağı açılır (kapsül/şerit), blur + karartma, çizgisiz linkler, rehber kartı, hello ve sosyal ikonlar (`content/partials/header.html`, `styles/*.css` "v0.23" bloğu). Footer ve kapanış CTA'sında header koyu temaya geçer. Kapsam: yalnız ≤860px; masaüstü davranışı aynı.
- Cihaz kontrolü (12 Ekim): 320, 360, 390, 412, 768 ve yatay 740×360 ölçüldü: yatay taşma yok; imza her genişlikte sığar (eski 13vw kuralı 768px'te taşıyordu, düzeltildi); kısa ekranda menü paneli içinde kayar. Bilinen sınır: `@property` ile dönen şerit eski tarayıcılarda (Safari <16.4, Firefox <128) sabit durur, işlev aynı.
- Yapıldı (13 Ekim): breadcrumb'lar tek tip hap ve daha küçük (12px): Check-up de diğer sayfalarla aynı (`.h4-pill` ↔ `.ab-pill`). Yukarı çık halkası yalnız görünürken döner.
- Açık (13 Ekim): sayfalar arası geçişte hero'nun "takılarak" gelmesi ve geçişte arka plan renginin değişir gibi görünmesi. Kadir'in iOS Simülatör kaydında (`Ekran Kaydı 2026-10-13 00.22.27.mov`) eski ve yeni sayfa üst üste binen çapraz geçiş görülüyor (~0.3 sn). Denenenler geri alındı; baştan ele alınacak.
- Yerel mobil kontrol: `node scripts/mobil-ss.mjs <url> <png> [y] [yükseklik]` (Chrome DevTools Protocol, 390×844, DPR 2, iPhone UA; sayfayı kaydırıp animasyonları tetikler). Önce `npm run build && npx next start -p 3100`.
- Yapıldı (18 Ekim): Check-up sayfası mobilde baştan sona elden geçti (hero rapor çerçevesi, yaklaşım cümleleri, 8 alan ve "elinizde ne olacak" yana kayan sekmeler, kimler için, süreç, erişimler, gizlilik, kapanış CTA'sı). Sekmelerde tüm paneller aynı hücrede üst üste durur, kutu sabit yükseklikte; dokunma ve kaydırma gerçek cihazda henüz denenmedi.
- Yapıldı (18 Ekim, Kadir yokken, gözden geçirme bekliyor): Danışmanlık, Commerce Notes listesi, blog yazısı, ücretsiz rehber ve Hakkımızda mobilde elden geçti: bölüm boşlukları azaldı (`--space-section` 3,75rem), hero'daki boş alan kapandı, istatistikler sığdı, kapanış CTA'sı ana sayfadaki gibi (obje butonun sağında), blog yazısı okuma ölçüsü, "ilgili notlar" yana kayan şerit, rehberde "Ücretsiz rehberi al" başlığın altında. Yalnız ≤760px; masaüstü değişmedi. Kadir gözle bakıp revize verecek.
- Bakılmadı: Görüşme Planla formu (ilk ekran düzgün), Kontrol listesi sayfası (`/rehber/.../kontrol-listesi`), Örnek rapor, yasal sayfalar.
- Sıradaki görüntü: IMG_1884 (ana sayfa, E-ticaret Altyapıları kartı).

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

## Bülten (Commerce Notes)

Kurgu: Gündem haftada iki kez (salı, cuma 08:00) otomatik hazırlanır, Kadir onaylayınca gider; ekip ve aboneler alır, sitede yayınlanmaz (SEO'ya etkisi yok). Pratik yazılar blogda yayınlanır, abonelere de gider. Sitede ayrıca anlatılmıyor; LinkedIn ve sosyal medyada duyurulacak.

- Hazır: şablon (`lib/email/newsletter.ts`), kapak (`/api/bulten/kapak`), haber toplama (`scripts/bulten/haberler.mjs`, 9 kaynak), sayıdan HTML (`olustur.mjs`), test gönderimi (`gonder.mjs --test`). İlk sayı `scripts/bulten/sayilar/2026-10-06.json`; Gmail testi tamam.
- Hazır: onay sistemi. Site önizlemeyi gönderir (`/api/bulten/onizleme-gonder`), "Onayla ve gönder" → `/bulten/onay` → gönderim. Onaysız hiçbir şey gitmez. Alan adına kadar test modu, yalnız `BULTEN_TEST_TO`.
- Hazır: Claude Code zamanlanmış görevi "Commerce Notes · Gündem bülteni" (salı ve cuma 08:00, Opus 5.5, `bulten` ortamı, ağ: Full). https://claude.ai/code/routines/trig_017yvEzHwwA8ho1kK9mEvNTm. Görev gizli bilgi taşımaz.
- Tamam: görev GitHub'a yazabiliyor. kadirec collaborator oldu, 6 Ekim'de elle çalıştırılan görev `scripts/bulten/sayilar/2026-10-06.json` dosyasını commit'leyip push etti (5 haber + 4 kısa). Bundan sonra salı ve cuma 08:00'de kendiliğinden çalışır.
- Yapılacak: footer ve blogdaki bülten formlarını Resend'deki kitleye bağlamak; kayıtta iki seçenek (Gündem / Pratik yazılar), her biri için ayrı çıkış.
- Yapılacak: ekip adresleri (Kadir'den). Alan adı doğrulanınca onay/test alıcılarına mahir@agesoft.com.tr eklenecek (`BULTEN_ONAY_TO`, `BULTEN_TEST_TO`, virgülle).
- Bekliyor: alan adı doğrulanana kadar Resend yalnız mahirerdemme@gmail.com'a gönderebiliyor; gönderen `onboarding@resend.dev` (bu yüzden önizleme Gmail'de spam'e düşüyor). Durum 6 Ekim: Resend'de alan adı henüz eklenmedi; thecommerceclinic.com GoDaddy'de, park sayfasında, MX/TXT kaydı yok. Sıra: Resend'e alan adı ekle (Europe) → GoDaddy'ye Resend DKIM/MX/SPF kayıtları + Vercel A/CNAME → "Verified" olunca Claude `BULTEN_FROM`, `BULTEN_TEST_TO`, `BULTEN_ONAY_TO` günceller. İlk abone/test alıcısı: mahir@agesoft.com.tr (Kadir). Alan adı sonrası gönderen `Commerce Notes <notes@thecommerceclinic.com>` olacak (`BULTEN_FROM`).
- Bekliyor: e-posta alt bilgisindeki şirket unvanı / adres / MERSİS yer tutucu (yasal metinlerle aynı anda).
- Güvenlik: Resend anahtarı sohbette paylaşıldı; her şey çalışınca Resend'de yenisi oluşturulup eskisi silinmeli (`vercel env add RESEND_API_KEY` + `.env.local`).
- Not: Search Engine Land ve Digital Commerce 360 RSS'i dışarıdan engelliyor; kaynak listesi `haberler.mjs` içinde.

## Örnek rapor (/ornek-rapor)

- **Dil ve sayılar elden geçecek (Kadir):** rapor yapay zekâ yazmış gibi duruyor. "%38 etkisi" gibi hesaplanmış görünen ama dayanağı olmayan sayılar çıkarılacak; bugün `public/js/ornek-rapor.js` içinde 14 yüzde ifadesi var. Gerçek raporda inceleme ve yorumlar danışmanın kendisinin; yapay zekâ yalnız cümleyi toparlar. Ton insan ve danışman sesi olacak.
- **Yapay zekâ işareti yalnız Overview'da:** "burası yapay zekâ ile özetlendi" notu yalnız Health Overview kısmında olacak, raporun geri kalanında olmayacak. (Not: önceki turda Health notu "AI'sız" yazılmıştı; bu karar onun yerine geçiyor, uygularken teyit edilecek.)
- **Puanlar:** 0–100 puan kalıyor (Kadir). Puan bulgulardan gelir: kritik bulgusu çok olan alan düşük, bulgusu az ve güçlü yönü çok olan yüksek puan alır. Etiketler (Sağlıklı / Gelişmeli / Öncelikli; Kritik / Yüksek / Orta / Düşük) yanında kalır. Puanın nasıl anlatılacağı ve iç puan tablosu en sonda konuşulacak. Bulgulardaki sayılar yalnız markanın kendi verisinden ve kaynağıyla (GA4, Search Console vb.).
- **Check-up bölümü** (sayfa ve süreç) ayrıca ele alınacak (Kadir).
- Görseller kurgusal "Loma Ev" mağazası için tasarlandı (`design/rapor-gorselleri/`). Brief'teki "sahte arayüz yok" kuralına örnek rapor için bilinçli istisna; gerçek raporda ekranlar müşterinin kendi sitesinden alınır.
- Giriş (e-posta + tek kullanımlık kod), davet e-postaları, aksiyon durumu ve sorumlu kaydı şu an tarayıcıda simüle ediliyor. Sunucu tarafı ilk gerçek Check-up gelince kurulacak (brief: sonraki faz).
- Final görüşmesi notları: `R.finalNotes` doldurulunca rapor kendiliğinden Sürüm 1.1 olur.

