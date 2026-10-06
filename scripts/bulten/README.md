# Commerce Notes bülteni · Gündem

Salı ve cuma 08:00'de (İstanbul) Claude Code zamanlanmış görevi bu dosyadaki adımları uygular. Hiçbir sayı onaysız gönderilmez: görev yalnız taslağı hazırlar ve onaya yollar; gönderimi Kadir onay sayfasından yapar. Elle önizleme/test için `gonder.mjs` (yerelde, `.env.local` ile).

## Adımlar

1. Adayları topla: `node scripts/bulten/haberler.mjs 4 > /tmp/adaylar.json` (son 4 gün, 9 kaynak).
2. Seç ve yaz: aşağıdaki kurallarla `scripts/bulten/sayilar/<YYYY-MM-DD>.json` dosyasını oluştur (bugünün tarihi, İstanbul saatiyle). Biçim `lib/email/newsletter.ts` içindeki `Newsletter` tipi; örnek: `scripts/bulten/ornek-sayi.json` (elle hazırlanmış örnek; ton ve uzunluk için referans).
   - `issue`: `scripts/bulten/sayilar/` içindeki en büyük `issue` + 1; klasör boşsa 1.
   - `date`: "6 Ekim 2026" biçiminde.
   - `cta`: bir önceki sayıyla aynı kalabilir (şu an rehber).
3. Kontrol: `node scripts/bulten/olustur.mjs scripts/bulten/sayilar/<id>.json > /tmp/sayi.html` hatasız çalışmalı.
4. Yayınla: yalnız yeni JSON dosyasını commit'le ve `main`'e gönder. Mesaj: `Bülten: sayı <issue> (<id>)`. Başka dosyaya dokunma.
5. Onaya gönder: `node scripts/bulten/onaya-gonder.mjs <id>`. Sayı sitede yayına çıkana kadar (en çok 15 dakika) bekler, sonra site onay önizlemesini Kadir'e gönderir. Görevin hiçbir gizli bilgiye ihtiyacı yok; anahtarlar yalnız Vercel'de.

## Seçim kuralları

- 5 ana haber, 2–4 kısa haber. Ölçüt: Türkiye'deki bir e-ticaret markasının (KOBİ ölçeği) yöneticisi bunu bilmeli mi? Reklam, arama ve yapay zekâ araması, pazaryerleri, ödeme, kargo, ölçüm, platformlar, yasal düzenlemeler, tüketici davranışı.
- Alma: yatırım ve girişim haberleri (e-ticareti doğrudan etkilemiyorsa), şirket içi atamalar, genel teknoloji, "günlük özet" ve "video özet" yazıları, magazin.
- Aynı konudan tek haber; Türkçe kaynak varsa onu tercih et.
- `tag`: tek-iki kelime (Reklam, Arama, Ölçüm, Pazaryeri, Ödeme, Kargo, Sosyal ticaret, Fiyat, Sadakat, Yapay zekâ, Yasal). İlk üç haberin etiketi kapakta görünür; farklı olsunlar.

## Yazım kuralları

- Türkçe, sade, kısa. `summary` en fazla 2 cümle; `takeaway` tek cümle; `title` 70 karakteri geçmesin.
- Yalnız kaynakta yazanı özetle. Kaynakta olmayan rakam, tarih, isim, iddia ekleme. Emin değilsen haberi alma.
- Dayanaksız yüzde ve istatistik yazma ("%38 artış" gibi). Kaynak bir rakam veriyorsa ve önemliyse yazılabilir.
- `takeaway` ("Markalar için:") bir öneri ya da sonuç: markanın ne yapması / neye dikkat etmesi gerektiği. Kesin konuşma, abartma.
- Kaynak metni kopyalama; kendi cümlelerinle yaz. `url` kaynağın kendi linki (izleme parametreleri olmadan), `source` kaynağın adı.
- `subject`: en önemli iki haberden, 70 karakteri geçmeyen bir konu satırı. `preheader`: "Bu hafta 5 gelişme ve markalar için anlamı." gibi.
- Yapay zekâ, kampanya, tıklama tuzağı dili yok; emoji yok.
