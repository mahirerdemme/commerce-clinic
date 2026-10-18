# Master Brief v2'ye ek · Mobil revizyon (18 Ekim 2026)

Master Brief v2 PDF'i Kadir'den geliyor ve repoda değil (`~/Downloads/Commerce-Clinic-Master-Brief-v2.pdf`). Bu dosya onun yerine geçmez; brief'e eklenecek kararları ve mobilde ne yaptığımızı, nasıl yaptığımızı tek yerde tutar. Brief'le çelişirse brief'in "Değişmeyen temel" bölümü geçerli; bu ek yalnız mobil görünüm ve yayın sonrası yapılanları kapsar. Açık işler ve bekleyenler `docs/acik-isler.md`'de.

## Kapsam ve durum

| Sayfa | Durum | Not |
|---|---|---|
| Ana sayfa | Bitti (9–13 Ekim) | Kadir'in 29 ekran görüntüsünden |
| Check-up | Bitti (18 Ekim) | Kadir'le birlikte, bölüm bölüm |
| Danışmanlık | Yapıldı, Kadir'in gözle bakması bekliyor | Kadir yokken yapıldı |
| Commerce Notes (liste, blog yazısı) | Yapıldı, bakış bekliyor | "İlgili notlar" kaldırıldı, aşağıda |
| Ücretsiz rehber | Yapıldı, bakış bekliyor | |
| Hakkımızda | Yapıldı, bakış bekliyor | |
| Görüşme Planla formu | Bakıldı, değişmedi | İlk ekran mobilde düzgün |
| Kontrol listesi, Örnek rapor, yasal sayfalar | Bakılmadı | Sırada |

Yalnız ≤760px (ana sayfa hero'su ≤720px) değişti; masaüstüne dokunulmadı. Dokunma, yana kaydırma ve sekme geçişi gerçek cihazda denenmedi, yalnız durağan görüntüyle doğrulandı.

## Kalıcı mobil ilkeler

1. **Önce kullanıcı ne görecek, sonra ne gizlenecek.** Mobilde ekranı dolduran ikincil açıklama, uzun liste ve ek ayrıntı gizlenir ya da kısaltılır. İçerik silinmez; masaüstünde aynen durur. Kısaltma gerekirse HTML'de iki sürüm tutulur: masaüstü metni `.dm`, mobil kısa metin `.mo` (örnek: 8. alan "Organization & Growth Readiness" → mobilde "Organization & Growth"; CTA güvence satırı).
2. **Tekrar eden alanlar yana kayan şerit.** Aynı yapıdaki 3+ kart ya da sekme (8 alan, rapor önizlemesi, Danışmanlık "Nasıl çalışır?", ilgili notlar) alt alta uzamak yerine `scroll-snap` ile yana kayar; yandaki kartın bir kısmı görünür (≈1,75 kart), böylece kaydırılabildiği anlaşılır. Sekmede aktif kart çerçeveli; sekmeye basınca şerit o karta kayar (`public/js/check-up.js`, `act()` içinde).
3. **Sekme panelleri zıplamaz.** Tüm paneller aynı grid hücresinde üst üste durur, gizli olanlar `visibility:hidden` (yer kaplar); kutu en uzun panele göre sabit kalır. Kısa panellerde içerik kutuyu doldurur/dikey ortalanır, altta boşluk farkı kalmaz.
4. **Tek ekranda başı sonu belli.** Başlık + şerit + panel birlikte tek ekrana sığmaya çalışır. Hero'da `min-height:0`, bölüm boşluğu `--space-section: 3.75rem` (masaüstü 5–10rem).
5. **Başlık satırı tek satır.** Sekme/kart başlıkları `white-space:nowrap`; numara başlığın soluna alınır (kaldırılmaz, çünkü 8 alan olduğunu gösterir).
6. **Kapanış CTA'sı her sayfada aynı.** Başlık, buton, iki satır güvence metni ("Ücretsiz · Yaklaşık 30 dakika" / "Karşılıklı uygunluk değerlendirmesi"); 3D obje butonun sağında, sağ kenardan taşar. Alttaki dev obje yok. Hakkımızda dahil, tüm sayfalarda aynı.
7. **Rakam alanı ana sayfadaki gibi.** "10+ / 1.000+ / 2.000+" mobilde alt alta, çizgiyle ayrılmış; roll (yuvarlanarak sayma) animasyonu görünür olunca çalışır, `prefers-reduced-motion`'da statik.
8. **Ana eylem erişilebilir yerde.** Uzun sayfada ana buton sayfanın çok aşağısında kalmaz: rehberde kapağın başlığı altında minimal "Ücretsiz rehberi al ↓" (indirme kutusuna iner), Hakkımızda hero'sunda "Yakından bakın ↓".
9. **Okuma ölçüsü.** Blog yazısı mobilde 17px/1,68; başlık 32px; not kutusu ve CTA kutusu daha sıkı.
10. **Metin, örnek raporla aynı.** Check-up sayfasındaki rapor önizlemesi `ornek-rapor.js` ile birebir tutulur: yol haritası dönemleri etki × efor kuralından gelir (örn. "Satın alma ölçümünü düzeltme" İlk 30 gün), bulgu 3.1 metni raporla aynı. Önizleme rapordan sapmasın.
11. **Tema dengesi (12 Ekim)** geçerli: bölümün üstüne binen header, menü ve yukarı çık butonu altındaki bölümün temasını izler.

## Teknik notlar (tekrar etmesin)

- Mobil kurallar her sayfa CSS'inin **sonunda**, tarih ve "Kadir" notuyla yorumlu bloklarda. Önce bir "masaüstünde gizle" kuralı yazılıp mobil "göster" kuralından **sonra** gelirse mobili ezer; masaüstü gizlemeyi `@media (min-width:761px)` içine koy.
- Mobil flex sütun (`flex-direction:column`) içinde `align-items:center` varsayılanı dar içeriği ortalar; sola hizalı kalması gereken kutuda `align-items:stretch` yaz.
- Hero'daki dekoratif büyük işaret (`.ab-mark`, `.co-mark`) yazının önüne geçebilir; metin kapsayıcısına `position:relative; z-index:1`.
- Bir CSS bloğunu elle keserken süslü parantez sayısı kontrol edilmeli; fazladan `}` tüm sayfayı "Build Error" yapar.
- Mobil kontrol: `npm run build && npx next start -p 3100`, sonra `node scripts/mobil-ss.mjs <url> <png>` (390px, iPhone UA). Çerez bandı ekranı kapatıyorsa `cc-consent=1|n` çerezini ver. Uzun sayfada kaydırıp dilim dilim ekran görüntüsü al; kaydırmadan çekilen görüntüde `sr` ile gelen bölümler boş görünür.

## Kaldırılanlar ve ileride yapılacaklar

- **"İlgili notlar" alanı** blog yazısı ve rehber sayfalarından kaldırıldı (18 Ekim): kartlar örnek içerikti, bağlantıları `#` idi, güncel değildi. Yeni yazılar yayınlanınca geri gelecek. Geri koyarken:
  - Mobilde çok geniş padding'li görünüyordu: kart iç boşluğu ve görsel/başlık aralığı kısılacak.
  - "İlgili notlar" başlığının boyutu küçülecek.
  - Kartlar mobilde yana kayan şerit (≈1,75 kart) olacak; alt alta iki dev kart değil.
  - Masaüstü kuralları (`.cn-rel`, `.cn-rel-g`, `.cn-rc`) `styles/commerce-notes.css`'te duruyor; mobil kurallar silindi, yeniden yazılacak.
- Sayfalar arası geçişte hero'nun takılması hâlâ çözülmedi (ayrıntı `docs/acik-isler.md`).

## Brief'e eklenecek tek satırlar (Kadir)

- Mobil ≤760px; "her ekran bir bakışta": ikincil içerik mobilde kısaltılır/gizlenir, tekrar eden alan yana kayan şerit, kapanış CTA'sı her sayfada aynı.
- Rapor önizlemesi (Check-up sayfası) ile örnek rapor metinleri birebir eşleşir.
- Sayfa başına dokunma ve kaydırma gerçek cihazda doğrulanır; durağan ekran görüntüsü yeterli sayılmaz.
