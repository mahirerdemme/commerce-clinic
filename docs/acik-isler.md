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
- Home SSS: "Takvimden size uygun gün ve saati seçerek planlayabilirsiniz" diyor; Görüşme Planla takvim değil, talep formu. Metin mi değişecek, takvim aracı mı eklenecek? (Mahir)
- Ana sayfa hero şeridindeki referans marka logoları (Myvia, Tromox, Alfemo, Gözde Grubu, Kelebek…): kullanım izni var mı? Yoksa kaldırılmalı. (Mahir)
- Rakamlar: sitede 10+ yıl / 1.000+ marka / 2.000+ proje, portfolyoda 8+ yıl / 500+ marka. (Mahir)

- Çerez bandında "Reddet" yazılı buton yok; reddetme sağ üstteki çarpıyla ve Tercihler'deki "Tümünü reddet"le. KVKK çerez rehberi reddetmenin kabul kadar görünür olmasını istiyor; hukukçu okumasında sorulmalı.

- Bülten onay kutusu: "Aydınlatma Metni kapsamında ticari ileti onayı veriyorum." Kutu yalnız ticari ileti onayı veriyor, aydınlatmaya atıf yapıyor; hukukçu okumasında teyit edilmeli.

## Teknik, bağlantı bekleyen

- Formlar hâlâ hiçbir yere göndermiyor (Resend + alan adı + hello@ gerekiyor). Onay metinleri hazır; gönderim bağlanınca onay kaydı (tarih, kaynak, metin sürümü) da saklanmalı.
- Çerez bandı Consent Mode v2 ile hazır; GTM kimliği `NEXT_PUBLIC_GTM_ID` olarak Vercel'e girilince GTM yüklenir. GA4 etiketi GTM içinde, Consent Mode **temel (basic)** ayarıyla kurulmalı: onay yoksa etiket hiç çalışmaz, Google'a veri gitmez.
- Örnek rapor sayfasında (`/ornek-rapor`) footer'da çerez tercihleri bağlantısı yok; bant orada da çıkıyor.
