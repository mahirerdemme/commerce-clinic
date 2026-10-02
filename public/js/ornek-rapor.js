
(function(){
'use strict';

/* =========================================================
   VERİ — Next.js'te rapor JSON'u. Panelden doldurulur.
   Alan → incelenen başlıklar → bulgular → görseller → öneri → aksiyon
   ========================================================= */
const R={client:'Loma Ev',site:'loma.com.tr',sector:'Ev tekstili',period:'1–18 Eylül 2026',date:'24 Eylül 2026',
  consultant:'Mahir Erdem',role:'Lead Consultant',initials:'CC',final:'8 Ekim 2026, 14:00',finalShort:'8 Ekim',overall:57,bench:64};

const TERMS={
  business:['Business & Positioning','İş Modeli ve Konumlandırma'],
  market:['Market & Competition','Pazar ve Rekabet'],
  ux:['UX & Conversion','Kullanıcı Deneyimi ve Dönüşüm'],
  merch:['Merchandising & Content','Ürün Sunumu ve İçerik'],
  tech:['Technology & Data','Teknoloji ve Veri'],
  retention:['Post-Purchase & Retention','Satış Sonrası ve Sadakat'],
  acquisition:['Acquisition & Marketing','Müşteri Kazanımı ve Pazarlama'],
  org:['Organization & Growth Readiness','Organizasyon ve Büyümeye Hazırlık'],
  health:['Commerce Health Overview','E-ticaret Sağlık Görünümü'],
  findings:['Findings & Diagnosis','Bulgular ve Teşhis'],
  plan:['Priority Action Plan','Öncelikli Aksiyon Planı'],
  roadmap:['90-Day Growth Roadmap','90 Günlük Büyüme Planı'],
  score:['Commerce Health Score','E-ticaret sağlık skoru']
};

/* s: incelenen başlıklar [ad, durum]  durum: ok | warn | bad */
const AREAS=[
 {id:'business',score:61,scope:'İş modeli, ürün ve fiyat yapısı, marj, kampanya bağımlılığı ve önümüzdeki 6–12 ayın hedefleri.',
  s:[['İş modeli ve satış kanalları','ok'],['Ürün ve fiyat yapısı','ok'],['Marj ve ortalama sepet','warn'],['Kampanya bağımlılığı','bad'],['Müşteri yapısı','ok'],['Değer önerisi','ok'],['Performans trendi ve hedefler','warn']],
  assess:['Loma Ev\'in değer önerisi net ve rakiplerden ayrışıyor: organik pamuk ve yerli üretim, ürün sayfalarından reklam metinlerine kadar tutarlı anlatılıyor.','Sorun cironun ritminde. Son altı ayın cirosunun yaklaşık yarısı indirim haftalarından geliyor; kampanya dışındaki haftalarda satış belirgin şekilde düşüyor.'],
  by:'Kaynak: Discovery görüşmesi (3 Eylül) ve ikas sipariş raporu, Mart–Ağustos 2026'},
 {id:'market',score:72,scope:'Seçilen rakiplerle fiyat, ürün gamı, kargo, iade, ödeme ve deneyim karşılaştırması.',
  s:[['Rakip seti','ok'],['Fiyat ve ürün gamı','ok'],['Kampanyalar','ok'],['Kargo, iade ve ödeme koşulları','warn'],['Deneyim ve ürün sunumu','ok'],['Değer önerisi karşılaştırması','ok']],
  assess:['Fiyat konumu segmentle uyumlu; Loma Ev ne en ucuz ne en pahalı marka. Ürün gamı ve görsel kalite rakiplerin üzerinde.','Belirgin tek dezavantaj ücretsiz kargo eşiği. İncelenen rakiplerin çoğu daha düşük bir eşik kullanıyor.'],
  by:'İnceleme: 10–11 Eylül 2026 · Rakip A–E, mobil ve masaüstü satın alma akışı'},
 {id:'ux',score:38,scope:'Keşiften ödemeye kadar satın alma kararını kolaylaştıran ve zorlaştıran noktalar.',
  s:[['Keşif ve navigasyon','warn'],['Ana sayfa ve açılış sayfaları','ok'],['Kategori ve listeleme','warn'],['Ürün detay','bad'],['Sepet ve ödeme','warn'],['Mobil deneyim','bad'],['Güven unsurları','warn']],
  assess:['Trafiğin %78\'i mobilden geliyor ama mobil dönüşüm oranı %0,9; masaüstünde bu oran %2,1. Aradaki farkın büyük kısmı ürün sayfasında oluşuyor.','Ziyaretçi ürünü beğeniyor; görseller ve açıklamalar iyi. Ancak teslimat tarihi, iade koşulu ve kargo ücreti gibi karar bilgileri mobilde ilk ekranın altında kalıyor. Kargo ücreti ilk kez ödeme adımında görünüyor ve en büyük kayıp o adımda yaşanıyor.'],
  by:'İnceleme: 9–12 Eylül 2026 · iPhone 13 (Safari) ve Chrome masaüstü · Clarity kayıtları, 14 gün'},
 {id:'merch',score:58,scope:'Ürün bilgisi, görseller, fiyat ve kampanya sunumu, arama ve filtre, kategori mimarisi, çapraz satış.',
  s:[['Ürün bilgileri','ok'],['Görseller','ok'],['Fiyat ve kampanya sunumu','ok'],['Arama ve filtre','warn'],['Kategori mimarisi','warn'],['Çapraz satış, üst satış, setler','warn'],['İçerik kalitesi','ok']],
  assess:['Ürün fotoğrafları ve malzeme anlatımı güçlü. Kategori sayfalarında ise kullanıcı aradığı ürüne ulaşmak için fazla kaydırıyor.','Set ve tamamlayıcı ürün önerileri yok. Ortalama sepet 1.140 ₺ ve siparişlerin %71\'i tek ürün içeriyor.'],
  by:'İnceleme: 11 Eylül 2026 · 6 kategori, 38 ürün sayfası'},
 {id:'tech',score:42,scope:'Altyapı, performans, entegrasyonlar, ölçümleme ve veri yapısı.',
  s:[['Altyapı','ok'],['Performans','warn'],['Entegrasyonlar','ok'],['Ölçümleme','bad'],['Veri yapısı','warn'],['Büyümeye uygunluk','ok']],
  assess:['Altyapı ve ERP entegrasyonu işini yapıyor; stok ve fatura aktarımı düzenli çalışıyor.','Asıl risk ölçümlemede. Ağustos ayında panelde 1.284 sipariş görünürken GA4\'e 861 satın alma olayı ulaşmış. Reklam bütçesi kararları bu eksik tabloya dayanıyor.'],
  by:'İnceleme: 12–15 Eylül 2026 · GA4 okuma erişimi, ikas paneli (salt okunur), PageSpeed Insights'},
 {id:'retention',score:49,scope:'Teslimat, iade, destek, sipariş sonrası iletişim, CRM ve tekrar satın alma.',
  s:[['Kargo ve teslimat','ok'],['İade ve değişim','warn'],['Müşteri desteği','warn'],['Sipariş sonrası iletişim','bad'],['E-posta, SMS ve CRM','warn'],['Sepet terk','ok'],['Tekrar satın alma ve sadakat','bad']],
  assess:['Teslimat hızlı ve güvenilir; ortalama teslim süresi 2,6 gün.','İlk siparişten sonra ise müşteriyle planlı bir iletişim yok. 90 gün içinde ikinci siparişi veren müşteri oranı %14.'],
  by:'İnceleme: 15 Eylül 2026 · Klaviyo akış raporları, 20 destek talebi örneklemi'},
 {id:'acquisition',score:70,scope:'Trafik kaynakları, paid ve organik dengesi, reklam vaadi ile açılış sayfası tutarlılığı.',
  s:[['Trafik kaynakları','ok'],['Paid ve organik dengesi','warn'],['Trafik kalitesi','ok'],['Reklam ve kreatif örnekleri','ok'],['Reklam vaadi ve açılış sayfası tutarlılığı','ok'],['Kanal dönüşüm sinyalleri','warn']],
  assess:['Reklamlar doğru kitleye ulaşıyor ve kreatiflerdeki vaat açılış sayfasında karşılığını buluyor.','Tek önemli bulgu bütçe verimliliğiyle ilgili: marka adıyla yapılan aramalarda reklam veriliyor.'],
  by:'İnceleme: 16 Eylül 2026 · Meta Ads ve Google Ads, son 6 ay'},
 {id:'org',score:56,scope:'Ekip rolleri, karar hızı, ajans ve iç ekip sorumlulukları, aksiyonları hayata geçirme kapasitesi.',
  s:[['Ekip rolleri','ok'],['Karar hızı','warn'],['Operasyonel darboğazlar','warn'],['Ajans ve iç ekip sorumlulukları','bad'],['Uygulama kapasitesi','warn']],
  assess:['Ekip küçük ama deneyimli. Site, reklam ve CRM üç ayrı iş ortağında; her biri kendi raporunu kendi metriğiyle sunuyor.','Kimse toplam tabloyu sahiplenmiyor. Aksiyonları hayata geçirmenin ön koşulu tek bir KPI seti ve düzenli bir karar ritmi.'],
  by:'Kaynak: Discovery görüşmesi (3 Eylül) ve iş ortaklarının Ağustos raporları'}
];

/* p: bad Kritik · warn Yüksek · mid Orta · ok Güçlü yan
   img: [[görselin kısa açıklaması]]  ex: iyi örnek görseli  act: aksiyon anahtarı */

/* Başlık şablonu: "Neye baktık?" — bir kez yazılır, her raporda aynı gelir */
const TOPIC_TPL={
 'İş modeli ve satış kanalları':'Hangi kanallardan, hangi iş modeliyle satış yapıldığı ve kanalların ciroya katkısı.',
 'Ürün ve fiyat yapısı':'Ürün gamının genişliği, fiyat aralıkları ve fiyatlama mantığı.',
 'Marj ve ortalama sepet':'Ürün ve kanal bazında marj, ortalama sepet tutarı ve sepet başına ürün sayısı.',
 'Kampanya bağımlılığı':'Cironun indirim dönemlerine dağılımı ve kampanyaların marja etkisi.',
 'Müşteri yapısı':'Yeni ve tekrar eden müşteri oranı, müşteri segmentleri.',
 'Değer önerisi':'Markanın neden tercih edilmesi gerektiğinin sitede ve iletişimde nasıl anlatıldığı.',
 'Performans trendi ve hedefler':'Son 6–12 ayın satış trendi ve önümüzdeki dönemin hedefleri.',
 'Rakip seti':'Karşılaştırma için seçilen rakipler ve seçim gerekçesi.',
 'Fiyat ve ürün gamı':'Benzer ürünlerde fiyat konumu ve ürün çeşitliliği.',
 'Kampanyalar':'Rakiplerin kampanya sıklığı, indirim seviyeleri ve sunumu.',
 'Kargo, iade ve ödeme koşulları':'Kargo eşiği ve ücreti, iade süresi ve yöntemi, ödeme seçenekleri.',
 'Deneyim ve ürün sunumu':'Rakip sitelerde ürün sunumu, görsel kalite ve satın alma akışı.',
 'Değer önerisi karşılaştırması':'Rakiplerin öne çıkardığı vaatler ve markanın bunlara göre konumu.',
 'Keşif ve navigasyon':'Menü yapısı, arama ve kullanıcının aradığı ürüne ulaşma yolu.',
 'Ana sayfa ve açılış sayfaları':'Ana sayfa ve kampanya sayfalarının mesajı, yönlendirmesi ve reklamla tutarlılığı.',
 'Kategori ve listeleme':'Kategori sayfalarında sıralama, filtreleme ve ürün kartlarındaki bilgi.',
 'Ürün detay':'Ürün sayfasında karar için gereken bilgi, görsel, fiyat ve güven unsurları.',
 'Sepet ve ödeme':'Sepetten ödemeye kadar adımlar, maliyet şeffaflığı ve ödeme seçenekleri.',
 'Mobil deneyim':'Tüm akışın mobilde okunabilirliği, hızı ve ilk ekran düzeni.',
 'Güven unsurları':'Yorumlar, iade ve teslimat güvenceleri, iletişim ve güvenlik işaretleri.',
 'Ürün bilgileri':'Ürün açıklamaları, ölçü ve malzeme bilgisi, kullanım bilgileri.',
 'Görseller':'Ürün görsellerinin sayısı, kalitesi ve çeşitliliği.',
 'Fiyat ve kampanya sunumu':'İndirim, taksit ve kampanya bilgilerinin ürün sayfası ve listelerde sunumu.',
 'Arama ve filtre':'Arama sonuçlarının isabeti ve filtre seçenekleri.',
 'Kategori mimarisi':'Kategorilerin mantığı, derinliği ve ürün dağılımı.',
 'Çapraz satış, üst satış, setler':'Tamamlayıcı ürün, set ve üst segment önerileri.',
 'İçerik kalitesi':'Metinlerin dili, tutarlılığı ve marka anlatımı.',
 'Altyapı':'E-ticaret platformu, eklentiler ve mevcut hacmi taşıma kapasitesi.',
 'Performans':'Sayfa yüklenme süreleri ve mobil hız.',
 'Entegrasyonlar':'ERP, muhasebe, kargo ve pazaryeri entegrasyonlarının çalışması.',
 'Ölçümleme':'Analytics kurulumu, satın alma ve dönüşüm olaylarının doğruluğu.',
 'Veri yapısı':'Ürün, müşteri ve sipariş verisinin düzeni ve kullanılabilirliği.',
 'Büyümeye uygunluk':'Altyapının önümüzdeki dönemin hedeflerini taşıyıp taşıyamayacağı.',
 'Kargo ve teslimat':'Teslim süresi, kargo firması, takip ve teslimat iletişimi.',
 'İade ve değişim':'İade koşulları, süreç ve müşterinin süreci takip edebilmesi.',
 'Müşteri desteği':'Destek kanalları, yanıt süreleri ve tekrar eden sorular.',
 'Sipariş sonrası iletişim':'Sipariş ve teslimat sonrası müşteriye giden mesajlar.',
 'E-posta, SMS ve CRM':'Kullanılan araçlar, listeler, segmentler ve otomasyonlar.',
 'Sepet terk':'Sepet terk hatırlatmaları ve geri kazanım oranı.',
 'Tekrar satın alma ve sadakat':'İkinci sipariş oranı, sıklığı ve sadakat kurguları.',
 'Trafik kaynakları':'Trafiğin kanallara dağılımı ve kanalların satışa katkısı.',
 'Paid ve organik dengesi':'Ücretli ve organik trafiğin payı, bütçe dağılımı.',
 'Trafik kalitesi':'Kanal bazında etkileşim ve dönüşüm.',
 'Reklam ve kreatif örnekleri':'Seçili reklamların mesajı, görseli ve hedef kitleye uygunluğu.',
 'Reklam vaadi ve açılış sayfası tutarlılığı':'Reklamdaki vaadin açılış sayfasında karşılanıp karşılanmadığı.',
 'Kanal dönüşüm sinyalleri':'Kanalların dönüşüm oranları ve ölçüm güvenilirliği.',
 'Ekip rolleri':'Ekipteki roller, sorumluluklar ve kapasite.',
 'Karar hızı':'Kararların kim tarafından, ne sürede alındığı.',
 'Operasyonel darboğazlar':'Siparişten teslimata ve içerikten yayına tıkanan noktalar.',
 'Ajans ve iç ekip sorumlulukları':'İş ortaklarının kapsamı, raporlaması ve ortak hedefler.',
 'Uygulama kapasitesi':'Önerilen aksiyonları hayata geçirecek zaman ve kaynak.'
};
/* Başlık sonucu: rapor başına tek cümle (r), başka alandaki ilgili bulgu (ref), isteğe bağlı görsel (img) */
const TOPIC_NOTE={
 'ux|Keşif ve navigasyon':{r:'Arama iyi çalışıyor; menüde en çok satan kategori derinde kalıyor.'},
 'ux|Ana sayfa ve açılış sayfaları':{r:'Sorun görülmedi. Kampanya sayfaları reklam vaadiyle tutarlı, mobil ana sayfa 2,1 saniyede yükleniyor.',img:'Mobil ana sayfa performans ölçümü; tüm metrikler hedef aralıkta.'},
 'ux|Kategori ve listeleme':{r:'Filtre eksikliği ürün bulmayı zorlaştırıyor; ayrıntısı Merchandising alanında.',ref:['mr1']},
 'ux|Ürün detay':{r:'Görseller güçlü, karar bilgisi zayıf.'},
 'ux|Sepet ve ödeme':{r:'Adım sayısı makul; kargo ücreti geç görünüyor.'},
 'ux|Mobil deneyim':{r:'Mobil dönüşüm masaüstünün yarısından az; kaynağı ürün sayfası ve yüklenme süresi.',ref:['td2']},
 'ux|Güven unsurları':{r:'Yorumlar ve iade güvencesi var ama karar anında görünmüyor.'},
 'tech|Altyapı':{r:'Sorun görülmedi. Platform mevcut sipariş hacmini rahat taşıyor.'},
 'tech|Performans':{r:'Masaüstü iyi; mobil ürün sayfası yavaş.'},
 'tech|Entegrasyonlar':{r:'ERP ve fatura aktarımı düzenli çalışıyor.'},
 'tech|Ölçümleme':{r:'Satın alma olaylarının yaklaşık üçte biri kayıp.'},
 'tech|Veri yapısı':{r:'Beden alanı serbest metin; filtre bulgusuyla birlikte ele alındı.',ref:['mr1']},
 'tech|Büyümeye uygunluk':{r:'Sorun görülmedi. Önümüzdeki 12 ayın hedefleri için altyapı değişikliği gerekmiyor.'},
 'merch|Çapraz satış, üst satış, setler':{r:'Set ve tamamlayıcı ürün önerisi yok; kampanya takvimi bulgusuyla birlikte ele alındı.',ref:['bp1']},
 'acquisition|Kanal dönüşüm sinyalleri':{r:'Kanal verisi ölçüm hatası nedeniyle eksik; ayrıntısı Technology & Data alanında.',ref:['td1']}
};
const IMG={td1:'/media/ce3756830b42.jpg',td2:'/media/7a4a6fde487f.jpg',re1:'/media/81b47ec5847d.jpg',bp1:'/media/0d4a279fea82.jpg',mc1:'/media/80ab5c18343f.jpg',am1:'/media/733448aefc3e.jpg',og1:'/media/c00f40266935.jpg'};
const F=[
 {k:'ux1',m:'Mobil dönüşüm oranı',area:'ux',s:['Ürün detay','Mobil deneyim','Güven unsurları'],p:'bad',act:'pdp',
  t:'Mobil ürün sayfası, karar vermek için gereken bilgiyi ilk ekranda göstermiyor.',
  img:[['Karar bilgileri ilk ekranın altında, kapalı akordeonlarda kalıyor.'],['Mobil ziyaretçilerin çoğu işaretli çizginin altına inmiyor.']],
  obs:'Teslimat tarihi, iade koşulu ve kargo ücreti "Sepete ekle" butonunun altında, üç kapalı akordeonun içinde duruyor. Mobil ziyaretçilerin %71\'i ilk ekranın altına inmiyor.',
  why:'Karar bilgisini bulamayan ziyaretçi ya sayfadan çıkıyor ya da kararı ödeme adımına erteliyor. Mobil dönüşümün masaüstünün yarısından az olmasının en büyük nedeni bu.',
  rec:'"Sepete ekle" butonunun hemen altına üç satırlık bir karar bloğu ekleyin: tahmini teslim tarihi, 14 gün ücretsiz iade ve ücretsiz kargo eşiği. Akordeonlar detay için kalabilir.',
  ex:'Rakip B, mobil ürün sayfası'},
 {k:'ux2',m:'Sepetten ödemeye geçiş',area:'ux',s:'Sepet ve ödeme',p:'warn',act:'ship',
  t:'Kargo ücreti ilk kez ödeme adımında ortaya çıkıyor.',
  img:[['Sepette kargo ücretine dair bilgi yok.'],['Kargo ücreti ilk kez ödeme adımında toplama ekleniyor.']],
  obs:'Ürün ve sepet sayfasında kargo ücreti yazmıyor. 750 ₺ altındaki siparişlerde 49,90 ₺ kargo ücreti ödeme adımında toplama ekleniyor.',
  why:'Sepetten ödemeye geçen kullanıcıların %41\'i kargo bilgisinin göründüğü adımda ayrılıyor.',
  rec:'Kargo ücretini ve ücretsiz kargo eşiğine kalan tutarı ürün ve sepet sayfasında gösterin. Eşiğin kendisini Pazar ve Rekabet alanındaki bulguyla birlikte değerlendirin.'},
 {k:'ux3',m:'Kategoriye ulaşım',area:'ux',s:'Keşif ve navigasyon',p:'mid',act:'menu',
  t:'Mobil menüde en çok satan kategori üçüncü seviyede.',
  img:[['Nevresim kategorisine ulaşmak için menüde üç seviye iniliyor.']],
  obs:'Nevresim takımları cironun %38\'ini getiriyor ama mobil menüde Ev Tekstili › Yatak Odası › Nevresim yolunun sonunda.',
  why:'Kategoriye menüden ulaşan kullanıcı az; çoğu aramayı kullanıyor, arama da eşanlamlıları tanımıyor.',
  rec:'En çok satan üç kategoriyi mobil menünün ilk seviyesine taşıyın.'},
 {k:'ux5',area:'ux',s:'Ürün detay',p:'ok',t:'Ürün görselleri ve malzeme anlatımı rakiplerin üzerinde.',g:'Her üründe doku yakın çekimi, ölçü görseli ve yıkama talimatı var. İncelenen rakiplerden yalnızca biri benzer bir standartta.'},

 {k:'td1',m:'Kanal raporlarının doğruluğu',area:'tech',s:'Ölçümleme',p:'bad',act:'track',
  t:'Satın alma olaylarının yaklaşık üçte biri GA4\'e ulaşmıyor.',
  img:[['3D Secure ile ödenen siparişlerde fark %44\'e çıkıyor.']],
  obs:'Ağustos ayında ikas panelinde 1.284 sipariş, GA4\'te 861 satın alma olayı var. Fark en çok 3D Secure ile ödenen siparişlerde oluşuyor; kullanıcı bankadan dönerken olay tetiklenmiyor.',
  why:'Reklam kanallarının getirisi olduğundan düşük görünüyor. Bütçe bu eksik veriye göre dağıtıldığı için iyi çalışan kanallar kısılabiliyor.',
  rec:'Önce 3D Secure dönüşündeki olay kaybını düzeltin. Ardından satın alma olayını sunucu tarafında da gönderen bir ölçüm yapısına geçin.'},
 {k:'td2',m:'Mobil dönüşüm oranı',area:'tech',s:'Performans',p:'warn',act:'speed',
  t:'Mobil ürün sayfası geç yükleniyor.',
  img:[['Ana ürün görseli sıkıştırılmadan yükleniyor; LCP 3,1 saniye.']],
  obs:'Mobil ürün sayfasında ana görselin yüklenme süresi 3,1 saniye. Görsel sıkıştırılmadan, 2400 piksel genişliğinde yükleniyor.',
  why:'Yavaş yükleme, kısa süren mobil ziyaretlerde ürün sayfasının görülme oranını düşürüyor.',
  rec:'Ürün görsellerini cihaz boyutuna göre sunun ve ilk ekrandaki ana görseli öncelikli yükleyin. Hedef 2,5 saniyenin altı.'},
 {k:'td4',area:'tech',s:'Entegrasyonlar',p:'ok',t:'ERP ve site arasındaki stok senkronu sağlıklı.',g:'Son 90 günde stok farkı kaynaklı iptal yalnızca 3 siparişte görüldü.'},

 {k:'re1',m:'Tekrar satın alma oranı',area:'retention',s:['Sipariş sonrası iletişim','E-posta, SMS ve CRM','Tekrar satın alma ve sadakat'],p:'warn',act:'flows',
  t:'İlk siparişten sonra planlı bir iletişim yok.',
  img:[['Sepet terk dışındaki akışlar kurulmamış.']],
  obs:'Klaviyo\'da yalnızca sepet terk akışı aktif. Sipariş sonrası, yorum isteği ve yeniden satın alma hatırlatması yok. 90 gün içinde ikinci sipariş oranı %14.',
  why:'Nevresim ve havlu belirli aralıklarla yeniden alınan ürünler. İletişim olmadığında müşteri ikinci alışverişini kampanyaya ya da rakibe bırakıyor.',
  rec:'Sipariş sonrası üç e-postalık bir akış kurun: teslimattan 3 gün sonra kullanım ve yorum, 21 gün sonra tamamlayıcı ürün, 75 gün sonra yeniden satın alma hatırlatması.'},
 {k:'re2',m:'Destek yükü, tekrar satın alma',area:'retention',s:['İade ve değişim','Müşteri desteği'],p:'mid',act:'returns',
  t:'İade talepleri e-postayla yürüyor; müşteri süreci takip edemiyor.',
  img:[['İade durumunu soran destek talepleri.']],
  obs:'İade için müşteri destek adresine e-posta atıyor. İncelediğimiz 20 destek talebinin 7\'si "iadem ne durumda" sorusu.',
  why:'Destek ekibinin zamanı tekrar eden sorulara gidiyor; iade deneyimi ikinci siparişe olan güveni zayıflatıyor.',
  rec:'İade talebini sipariş sayfasından bir formla alın ve durum değiştikçe otomatik e-posta gönderin.'},
 {k:'re4',area:'retention',s:'Kargo ve teslimat',p:'ok',t:'Teslimat hızlı ve güvenilir.',g:'Ortalama teslim süresi 2,6 gün. Müşteri yorumlarında en sık olumlu konu teslimat hızı.'},

 {k:'bp1',m:'Marj',area:'business',s:['Kampanya bağımlılığı','Marj ve ortalama sepet'],p:'warn',act:'calendar',
  t:'Ciro kampanya dönemlerine bağımlı.',
  img:[['Siyah çubuklar indirim haftalarını gösteriyor.']],
  obs:'Mart–Ağustos arasında cironun %46\'sı 9 indirim haftasından geldi. Kampanya dışı haftalarda günlük sipariş ortalaması yarıya iniyor.',
  why:'Her kampanya marjı biraz daha aşağı çekiyor ve müşteri indirimi beklemeyi öğreniyor.',
  rec:'Kampanya takvimini marj hedefiyle birlikte yeniden kurun. İndirim yerine set ve tamamlayıcı ürün kurgularıyla sepet değerini artıran dönemler planlayın.'},
 {k:'bp2',area:'business',s:'Değer önerisi',p:'ok',t:'Değer önerisi net ve tutarlı anlatılıyor.',g:'Organik pamuk ve yerli üretim vurgusu ürün sayfalarında, reklam metinlerinde ve paketlemede aynı dille yer alıyor.'},

 {k:'mc1',m:'Sepetten ödemeye geçiş',area:'market',s:'Kargo, iade ve ödeme koşulları',p:'mid',act:'ship',
  t:'Ücretsiz kargo eşiği rakiplerin üzerinde.',
  img:[['Loma Ev\'in eşiği rakiplerin çoğundan yüksek ve ürün sayfasında yazmıyor.']],
  obs:'Loma Ev 750 ₺ üzerinde ücretsiz kargo sunuyor. İncelenen rakiplerin çoğu 400–600 ₺ arasında bir eşik kullanıyor ve bunu ürün sayfasında gösteriyor.',
  why:'Tek ürünlü siparişlerin çoğu eşiğin altında kalıyor.',
  rec:'Eşiği 500 ₺ bandında dört haftalık bir testle deneyin; marj etkisini final görüşmesinde birlikte hesaplayalım.'},
 {k:'mc2',area:'market',s:'Fiyat ve ürün gamı',p:'ok',t:'Fiyat konumu segmentle uyumlu.',g:'Karşılaştırılan 12 üründe fiyatlar rakip ortalamasının %4 üzerinde; malzeme farkı ürün sayfalarında gerekçelendiriliyor.'},

 {k:'mr1',m:'Kategoriden ürüne geçiş',area:'merch',s:'Arama ve filtre',p:'mid',act:'filters',
  t:'Kategori filtreleri beden, malzeme ve renk seçeneği sunmuyor.',
  img:[['Kategoride yalnızca fiyat filtresi var.']],
  obs:'Nevresim kategorisinde 140 ürün var ve yalnızca fiyat filtresi çalışıyor. Kullanıcı çift kişilik bir takıma ulaşmak için ortalama 6 kez kaydırıyor.',
  why:'Aradığını bulamayan kullanıcı aramaya ya da siteden çıkışa yöneliyor.',
  rec:'Beden, malzeme ve renk filtrelerini ekleyin; ürün verisindeki beden alanını standartlaştırın.'},

 {k:'am1',m:'Reklam verimliliği',area:'acquisition',s:'Paid ve organik dengesi',p:'mid',act:'brand',
  t:'Marka aramalarında reklam harcaması yapılıyor.',
  img:[['Marka kampanyası bütçenin %18\'ini alıyor.']],
  obs:'Google Ads bütçesinin %18\'i "loma ev" ve türevi aramalara gidiyor. Bu aramalarda site organik olarak ilk sırada.',
  why:'Bütçenin bir kısmı zaten gelecek olan ziyaretçiye harcanıyor.',
  rec:'Marka kampanyasını iki haftalık bir testle kısın ve organik tıklamalardaki değişimi izleyin.'},
 {k:'am2',area:'acquisition',s:'Reklam vaadi ve açılış sayfası tutarlılığı',p:'ok',t:'Reklam vaadi ile açılış sayfası tutarlı.',g:'İncelenen 14 Meta kreatifinin tamamı ilgili ürün veya koleksiyon sayfasına gidiyor.'},

 {k:'og1',m:'Aksiyonların uygulanma hızı',area:'org',s:['Ajans ve iç ekip sorumlulukları','Karar hızı','Uygulama kapasitesi'],p:'bad',act:'ritual',
  t:'Aksiyonları sahiplenecek ortak bir karar yapısı yok.',
  img:[['Her iş ortağı farklı bir metrikle raporluyor.']],
  obs:'Site, reklam ve CRM üç ayrı iş ortağında. Her biri aylık raporunu kendi metriğiyle sunuyor; ortak bir hedef ya da düzenli bir toplantı yok.',
  why:'Bu rapordaki aksiyonların çoğu birden fazla iş ortağını ilgilendiriyor. Sahibi belli olmayan aksiyon uygulanmıyor.',
  rec:'Tek bir KPI seti belirleyin ve iş ortaklarının katıldığı aylık bir karar toplantısı kurun. İlk toplantıyı planın ilk haftasında yapın.'}
];

/* Aksiyonlar. Danışman yalnızca: başlık, açıklama, efor (1–3), işin türü, beklenen sonuç, gösterge.
   sig: nasıl anlaşılır (yorum). Etki bağlı bulgunun önceliğinden, dönem etki × efor kuralından otomatik gelir. ph + why: elle öne alma. */
const ACTIONS=[
 {k:'pdp',sig:'Mobil dönüşüm oranında artış görülmeli.',t:'Mobil ürün sayfasına karar bloğu ekleyin',d:'Tahmini teslim tarihi, ücretsiz iade ve kargo eşiği "Sepete ekle" butonunun altında.',eff:1,type:'Tasarım ve geliştirme',exp:'Mobil ürün sayfasında teslim tarihi, iade ve kargo bilgisi ilk ekranda görünür.'},
 {k:'ship',sig:'Ödeme adımına geçen kullanıcı oranı artmalı.',t:'Kargo ücretini ürün ve sepet sayfasında gösterin',d:'Ücretsiz kargo eşiğini 500 ₺ bandında dört hafta test edin.',eff:1,type:'Tasarım ve geliştirme',exp:'Kargo ücreti ödeme adımından önce görünür; ödeme adımındaki terk azalır.'},
 {k:'track',sig:'Panel ve GA4 sipariş sayıları arasındaki fark kapanmalı.',t:'Satın alma ölçümünü düzeltin',d:'Önce 3D Secure dönüşündeki kaybı giderin, ardından sunucu taraflı ölçüme geçin.',eff:2,type:'Veri ve teknik',exp:'Panel ve GA4 sipariş sayıları birbirini tutar; kanal raporları güvenilir hale gelir.'},
 {k:'ritual',sig:'Aksiyonların durumu her ay tek bir tabloda görülebilmeli.',t:'Aylık karar toplantısı ve tek KPI seti kurun',d:'Tüm iş ortaklarının katıldığı, aynı göstergelerin konuşulduğu toplantı.',eff:1,type:'Yönetim kararı',exp:'Tüm iş ortakları aynı göstergelerle raporlar; aksiyonların durumu ayda bir gözden geçirilir.'},
 {k:'menu',sig:'Kategori sayfalarına menüden gelen ziyaret artmalı.',t:'En çok satan kategorileri mobil menünün ilk seviyesine taşıyın',d:'Nevresim, havlu ve pike.',eff:1,type:'Tasarım ve geliştirme',exp:'En çok satan kategorilere mobil menüden tek dokunuşla ulaşılır.'},
 {k:'brand',sig:'Organik marka tıklamaları düşmeden reklam harcaması azalmalı.',t:'Marka aramalarındaki reklam harcamasını test ederek azaltın',d:'İki haftalık test; organik tıklamalar izlenerek.',eff:1,type:'Pazarlama ve CRM',exp:'Marka aramalarına giden bütçe, getiri sağlayan kampanyalara kayar.'},
 {k:'calendar',sig:'Kampanya dışı haftalarda ciro daha dengeli olmalı.',t:'Kampanya takvimini marj hedefiyle yeniden kurun',d:'İndirim dışı dönemlerde set ve tamamlayıcı ürün kurguları.',eff:3,type:'Yönetim kararı',exp:'Kampanya dışı haftalarda ciro dengelenir; indirim haftalarına bağımlılık azalır.'},
 {k:'filters',sig:'Kategori sayfasından ürüne geçiş artmalı.',t:'Kategori filtrelerini genişletin',d:'Beden, malzeme ve renk; ürün verisinde beden alanını standartlaştırın.',eff:2,type:'İçerik ve ürün',exp:'Kullanıcı aradığı ürüne daha az kaydırarak ulaşır.'},
 {k:'speed',sig:'Mobil ürün sayfası 2,5 saniyenin altında yüklenmeli.',t:'Mobil ürün sayfasının yüklenme süresini düşürün',d:'Görselleri cihaz boyutuna göre sunun.',eff:2,type:'Veri ve teknik',exp:'Ürün görselleri cihaza uygun boyutta ve öncelikli yüklenir.'},
 {k:'flows',sig:'İkinci sipariş oranı artmalı.',t:'Sipariş sonrası e-posta akışını kurun',d:'Kullanım ve yorum, tamamlayıcı ürün, yeniden satın alma hatırlatması.',eff:3,type:'Pazarlama ve CRM',exp:'Her müşteri ilk siparişinden sonra planlı üç e-posta alır.'},
 {k:'returns',sig:'Destek kutusundaki iade soruları azalmalı.',t:'İade talebini formla alın ve durumu otomatik bildirin',d:'Sipariş sayfasından form, durum değişiminde e-posta.',eff:1,type:'Tasarım ve geliştirme',exp:'İade durumu müşteriye otomatik bildirilir; destek kutusundaki iade soruları azalır.'}
];

const PHASES=[
 {n:1,w:'İlk 30 gün',t:'Hızlı kazanımlar',d:'En hızlı sonuç verecek işler: etkisi yüksek, eforu düşük.',chk:['Hedef','30. gün']},
 {n:2,w:'31–60 gün',t:'Temel düzeltmeler',d:'Emek isteyen yüksek etkili işler ve hızlıca yapılabilecek küçük düzeltmeler.',chk:['Hedef','60. gün']},
 {n:3,w:'61–90 gün',t:'Büyüme zemini',d:'Kapsamlı düzenlemeler ve kalıcı alışkanlıklar.',chk:['Hedef','90. gün']}
];
/* dönem kuralı: etki × efor */
const PHASE_RULE=(imp,eff)=>((imp===3&&eff<=2)||(imp===2&&eff===1))?1:((imp===3&&eff===3)||(imp===2&&eff===2)||(imp===1&&eff===1))?2:3;
const impW=['','Düşük etki','Orta etki','Yüksek etki'],effW=['','düşük efor','orta efor','yüksek efor'];
/* kaynak: [ad, ayrıntı, monogram | 'talk'] — gerçek logo panelden görsel olarak eklenebilir */
const SOURCES=[['Google Analytics 4','1 Haziran–31 Ağustos 2026','GA4'],['ikas yönetim paneli','Salt okunur erişim','ik'],['Meta Ads','Son 6 ay','M'],['Google Ads','Son 6 ay','G'],['Klaviyo','Akış ve kampanya raporları','K'],['Microsoft Clarity','14 günlük oturum kaydı','C'],['Discovery görüşmesi','3 Eylül 2026, 60 dk','talk']];
/* incelenen rakipler: ad, neden seçildi, neye baktık */
const COMP=[['Rakip A','Aynı segment, benzer fiyat','Ana sayfa · kampanyalar · kargo ve iade'],['Rakip B','Mobil deneyimi güçlü','Ürün sayfası · sepet ve ödeme'],['Rakip C','Pazaryerinde en çok görülen','Fiyat · ürün gamı · kargo'],['Rakip D','Yeni ve hızlı büyüyen','Kampanyalar · reklam kreatifleri'],['Rakip E','Segmentin premium ucu','Ürün sunumu · değer önerisi · iade']];
SOURCES.push(['Rakip incelemesi',COMP.length+' marka · 10–11 Eylül 2026','R']);
const srcIc=s=>s[2]==='talk'?`<span class="sic" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 3.5h10a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H7l-3 2.5V11H3a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></span>`:`<span class="sic" aria-hidden="true">${esc(s[2])}</span>`;
const THREE=[
 {t:'Mobil ürün sayfası karar vermeye yetmiyor.',d:'Teslimat, iade ve kargo bilgisi ilk ekranın altında kalıyor. Trafiğin %78\'i mobil; mobil dönüşüm %0,9, masaüstünde %2,1.',f:['ux1','ux2']},
 {t:'Kararlar eksik veriyle alınıyor.',d:'Ağustos\'taki 1.284 siparişin 861\'i GA4\'e ulaştı. Kanal ve bütçe kararları bu eksik tablo üzerinden veriliyor; sonuçları sahiplenen ortak bir yapı da yok.',f:['td1','og1']},
 {t:'İlk sipariş çoğu zaman son sipariş oluyor.',d:'90 gün içinde ikinci siparişi veren müşteri oranı %14. Sepet terk akışı dışında otomatik iletişim yok.',f:['re1']}
];

/* ========================================================= */
const FAV='<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="54" fill="#0A0A0A"/><path fill="#FFFFFF" d="M206 128A78 78 0 0 1 72.52 182.83L100.97 154.71A38 38 0 0 0 166 128ZM50 128.02A78 78 0 0 1 183.47 73.16L155.02 101.28A38 38 0 0 0 90 128.01ZM206 127.97A78 78 0 0 1 206 128L166 128A38 38 0 0 0 166 127.98Z"/></svg>';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let LANG='orig';try{const v=localStorage.getItem('cc-report-lang');if(v==='tr'||v==='orig')LANG=v}catch(e){}
const T=k=>TERMS[k]?TERMS[k][LANG==='tr'?1:0]:k;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st=v=>v<45?'bad':v<65?'warn':'ok';
const areaWord={bad:'Öncelikli',warn:'Gelişmeli',ok:'Sağlıklı'};
const topicWord={bad:'Sorunlu',warn:'Gelişmeli',ok:'İyi'};
const PR={bad:'Kritik',warn:'Yüksek',mid:'Orta',ok:'Güçlü yan'};
const lvW=['','Düşük','Orta','Yüksek'];
const lv=n=>`<span class="lv l${n}" aria-hidden="true"><i></i><i></i><i></i></span>`;
const rank={bad:0,warn:1,mid:2,low:3,ok:4};

/* numaralar: Bulgu <alan sırası>.<alan içindeki sıra> · Aksiyon <plan sırası> */
F.forEach(f=>{f.ss=Array.isArray(f.s)?f.s:[f.s]});
AREAS.forEach((a,i)=>{a.n=i+1;a.f=F.filter(f=>f.area===a.id&&f.p!=='ok'&&f.p!=='low').sort((x,y)=>rank[x.p]-rank[y.p]);a.f.forEach((f,j)=>f.no=a.n+'.'+(j+1));a.good=F.filter(f=>f.area===a.id&&f.p==='ok');a.low=F.filter(f=>f.area===a.id&&f.p==='low')});
const IMP={bad:3,warn:2,mid:1};
ACTIONS.forEach(a=>{a.src=F.filter(f=>f.act===a.k);a.imp=Math.max(...a.src.map(f=>IMP[f.p]||1));a.ph=a.ph||PHASE_RULE(a.imp,a.eff);a.why=a.why||(impW[a.imp]+', '+effW[a.eff])});
ACTIONS.sort((x,y)=>x.ph-y.ph||y.imp-x.imp||x.eff-y.eff);ACTIONS.forEach((a,i)=>a.n=i+1);
const fk=k=>F.find(f=>f.k===k),ak=k=>ACTIONS.find(a=>a.k===k),A=id=>AREAS.find(a=>a.id===id);
const fHref=f=>`#alan/${f.area}/${f.no}`;
const counts=()=>{const c={bad:0,warn:0,mid:0,ok:0,low:0};F.forEach(f=>c[f.p]++);return c};

/* ---------- gauge (180°) ---------- */
function gauge(score,{w=240,stroke=22,big=64,sub=true,bench=null}={}){
  const r=(w-stroke)/2,cx=w/2,cy=r+stroke/2,h=cy+stroke/2+(sub?4:2);
  const pt=t=>{const a=Math.PI*(1-t);return [cx+r*Math.cos(a),cy-r*Math.sin(a)]};
  const [x0,y0]=pt(0),[x1,y1]=pt(1),[xs,ys]=pt(score/100);const pad=bench!=null?14:4;
  const ro=r+stroke/2+5,ri=r-stroke/2-5,ba=Math.PI*(1-(bench||0)/100);
  const c=st(score);
  return `<svg class="gauge" viewBox="${-pad} ${-pad} ${w+pad*2} ${h+pad}" role="img" aria-label="Skor ${score} / 100">
    <path class="trk" stroke-width="${stroke}" d="M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}"/>
    <path class="val ${c}" stroke-width="${stroke}" d="M${x0} ${y0}A${r} ${r} 0 0 1 ${xs.toFixed(2)} ${ys.toFixed(2)}"/>
    ${bench!=null?(()=>{const r1=r+stroke/2+3,r2=r1+9,hw=0.045,P=(rr,a)=>`${(cx+rr*Math.cos(a)).toFixed(2)} ${(cy-rr*Math.sin(a)).toFixed(2)}`;return `<line class="bm" x1="${(cx+r1*Math.cos(ba)).toFixed(2)}" y1="${(cy-r1*Math.sin(ba)).toFixed(2)}" x2="${(cx+r2*Math.cos(ba)).toFixed(2)}" y2="${(cy-r2*Math.sin(ba)).toFixed(2)}" stroke-width="2.5" stroke-linecap="round"/>`})():''}
    <text class="gnum ${c}" x="${cx}" y="${cy-2}" font-size="${big}">${score}</text>
  </svg>`;
}

/* ---------- rail ---------- */
function rail(cur){
  const li=(h,inner,on)=>`<li><a href="#${h}"${on?' aria-current="page"':''}>${inner}</a></li>`;
  const grp=(n,title,sub,on,body)=>`<div class="grp${on?' on':''}"><p class="gh"><span class="gnm">${n}</span><b>${title}</b><small>${sub}</small></p><ul>${body}</ul></div>`;
  return grp(1,'Durum','genel tablo',cur==='genel-bakis',li('genel-bakis','<span class="t">Genel bakış</span>',cur==='genel-bakis'))
  +grp(2,'Teşhis','8 alan',cur.startsWith('alan/'),AREAS.map(a=>li('alan/'+a.id,`<span class="dot ${st(a.score)}"></span><span class="t">${esc(T(a.id))}</span><span class="s">${a.score}</span>`,cur==='alan/'+a.id)).join(''))
  +grp(3,'Plan','ne yapmalı, hangi sırayla',cur==='aksiyon-plani',li('aksiyon-plani',`<span class="t">${esc(T('roadmap'))}</span>`,cur==='aksiyon-plani')+li('aksiyon-plani/liste',`<span class="t">${esc(T('plan'))}</span>`,false)+li('aksiyon-plani/ilerleme','<span class="t">İlerleme takibi</span>',false))
  +`<div class="rail-foot"><button type="button" class="tour-btn" data-tour><span class="ic">?</span><span><b>Bu raporu nasıl okumalıyım?</b><small>Adım adım kısa tur</small></span></button>
    <div class="rail-lang"><span id="tlL">Terim dili</span><div class="seg" role="group" aria-labelledby="tlL"><button type="button" data-lang="orig" aria-pressed="${LANG==='orig'}">Orijinal</button><button type="button" data-lang="tr" aria-pressed="${LANG==='tr'}">Türkçe</button></div></div>
  </div>`;
}

/* ---------- finding ---------- */
function slot(lbl,cap,pins,cls='',src=''){
  return `<figure class="slot ${cls}"><div class="box${src?' has':''}"><span class="lbl">${esc(lbl)}</span>${src?`<img src="${src}" alt="${esc(cap)}" loading="lazy" data-zoom>`:'Görsel alanı'}</div>
    <figcaption>${esc(cap)}</figcaption></figure>`;
}
function finding(f){
  if(f.p==='ok') return `<article class="fx good"><div class="fx-top"><span class="badge ok"><i></i>Güçlü yan</span><span class="badge topic">${esc(f.ss[0])}</span></div><h3>${esc(f.t)}</h3><p class="g">${esc(f.g)}</p></article>`;
  const a=ak(f.act),L='abcdefgh';
  return `<article class="fx" id="f-${f.no}">
    <div class="fx-top"><span class="badge ${f.p}"><i></i>${PR[f.p]}</span><span class="badge topic">${esc(f.ss[0])}</span></div>
    <h3><span class="no">${f.no}</span><span>${esc(f.t)}</span></h3>
    ${f.m?`<p class="metric"><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M2.5 12.5 6 8.5l2.5 2.5 5-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Etkilediği metrik: <b>${esc(f.m)}</b></p>`:''}
    ${f.img&&f.img.length?`<div class="gal${f.img.length===1?' one':''}">${f.img.map((g,i)=>slot(f.no+(f.img.length>1?'-'+L[i]:''),g[0],null,'',i===0?IMG[f.k]:'')).join('')}</div>`:''}
    <div class="two"><div><h4>Ne gördük?</h4><p>${esc(f.obs)}</p></div><div><h4>Neden önemli?</h4><p>${esc(f.why)}</p></div></div>
    <div class="recx"><h4>Önerimiz</h4><p>${esc(f.rec)}</p>
      ${f.ex?`<div class="ex">${slot('İyi örnek',f.ex,null)}</div>`:''}
      ${a?`<a class="to-plan" href="#aksiyon-plani/${a.n}"><span><small>Aksiyon planındaki karşılığı</small><b>${a.n}. ${esc(a.t)}</b></span><i aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></i></a>`:''}</div>
  </article>`;
}


/* ---------- incelenen başlık ---------- */
function topicRow(a,n){
  const own=a.f.filter(f=>f.ss.includes(n)),good=a.good.filter(f=>f.ss.includes(n)),note=TOPIC_NOTE[a.id+'|'+n]||{},refs=(note.ref||[]).map(fk).filter(Boolean);
  const all=own.concat(refs);
  const s=all.some(f=>f.p==='bad')?'bad':all.length?'warn':'ok';
  const meta=own.length?`${own.length} bulgu`:refs.length?`${esc(T(refs[0].area))} alanında`:good.length?`${good.length} güçlü yan`:'Sorun görülmedi';
  const res=note.r||(own.length?'':'Sorun görülmedi.');
  const id='tp-'+a.id+'-'+a.s.findIndex(x=>x[0]===n);
  return `<li class="tpc"><button type="button" class="tp-h" aria-expanded="false" aria-controls="${id}"><span class="dot ${s}"></span><span class="tt">${esc(n)}</span><span class="tc">${meta}</span><svg class="chev" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <div class="tp-b" id="${id}" hidden>
      <div class="tp-g"><div><h4>Neye baktık?</h4><p>${esc(TOPIC_TPL[n]||'')}</p></div>${res?`<div><h4>Sonuç</h4><p>${esc(res)}</p></div>`:''}</div>
      ${note.img?`<div class="tp-img">${slot('Görsel',note.img,null)}</div>`:''}
      ${(own.length||refs.length||good.length)?`<div class="tp-l">${own.map(f=>`<a class="ref" href="${fHref(f)}">Bulgu ${f.no}</a>`).join('')}${refs.map(f=>`<a class="ref" href="${fHref(f)}">${esc(T(f.area))} · Bulgu ${f.no}</a>`).join('')}${good.length?`<span class="ref ok-ref">${good.length} güçlü yan</span>`:''}${own.length>1?`<button type="button" class="tp-f" data-topic="${esc(n)}">Bu başlığın bulgularını listele</button>`:''}</div>`:''}
    </div></li>`;
}
/* ---------- views ---------- */
function pager(ph,nh,pl,nl){return `<nav class="pager" aria-label="Sayfa geçişi">${ph?`<button type="button" data-go="${ph}"><small>Önceki</small><span>${esc(pl)}</span></button>`:''}${nh?`<button type="button" data-go="${nh}"><small>Sonraki</small><span>${esc(nl)}</span></button>`:''}</nav>`}

function vOverview(){
  const c=counts(),issues=c.bad+c.warn+c.mid;
  return `<section class="view" data-view="genel-bakis" aria-labelledby="h-ov">
    <div class="hero-x"><svg class="hero-mark" viewBox="0 0 256 256" aria-hidden="true"><path d="M224 128A96 96 0 0 1 59.78 195.55L93.89 161.77A48 48 0 0 0 176 128ZM32 127.99A96 96 0 0 1 196.22 60.46L162.11 94.23A48 48 0 0 0 80 128Z"/></svg><div class="hero-in">
    <div class="cover"><div>
      <div class="client-logo real" aria-hidden="true" style="margin-bottom:1.75rem">loma</div>
      <h1 class="h1" id="h-ov">${esc(R.client)}</h1>
      <p class="cover-kicker" style="margin:.9rem 0 0;font-size:1.125rem;color:var(--cc-text);font-weight:500">Commerce Check-up raporu</p>
      <p class="cover-site" style="margin-top:.35rem">${esc(R.site)} · ${esc(R.sector)}</p></div>
      <aside class="how-card" aria-labelledby="hc-t"><h2 id="hc-t">Bu rapor nasıl hazırlandı?</h2>
        <p>Bu rapordaki her bulgu Commerce Clinic danışmanları tarafından incelendi, kanıtla desteklendi ve yorumlandı.</p>
        <ul><li>Uzman incelemesi<b>18 saat</b></li><li>İncelenen ekran ve akış<b>46</b></li><li>İncelenen rakip<b>${COMP.length}</b></li></ul>
        <button type="button" data-how>Yöntemi ve tanımları görün</button></aside>
    </div>
    <dl class="meta"><div><dt>Hazırlayan</dt><dd>Commerce Clinic</dd></div><div><dt>İnceleme dönemi</dt><dd>${esc(R.period)}</dd></div><div><dt>Rapor tarihi</dt><dd>${esc(R.date)}</dd></div><div><dt>Final görüşmesi</dt><dd>${esc(R.final)}</dd></div></dl>
    <div class="tour-band"><span class="ic" aria-hidden="true">?</span><div><b>Raporu ilk kez mi açıyorsunuz?</b><span>Kısa bir turla nereden başlayacağınızı ve her bölümün ne anlattığını gösterelim.</span></div><button type="button" data-tour>Turu başlat</button></div>
    </div></div>

    <div class="block"><h2 class="h2">Kısa özet</h2>
      <div class="letter"><div class="body">
        <p>Loma Ev'in trafik tarafında ciddi bir sorunu yok. Reklamlar ve organik arama doğru kişileri siteye getiriyor, mobil ziyaretçilerin çoğu ürün sayfasına kadar ulaşıyor. Kayıp, ziyaretçinin karar verdiği yerde yaşanıyor.</p>
        <p>İncelememizde üç konu öne çıktı: mobil ürün sayfası satın alma kararını destekleyecek bilgiyi göstermiyor, siparişlerin yaklaşık üçte biri ölçümlere yansımıyor ve ilk siparişi veren müşteriyle sonrasında planlı bir iletişim kurulmuyor. Bu üçü birbirini besliyor.</p>
        <p>İlk 30 günde yapılacak işlerin çoğu düşük eforlu. Aksiyonları sizin ekibiniz ve mevcut iş ortaklarınızla uygulanabilecek şekilde sıraladık. ${esc(R.finalShort)}'deki final görüşmesinde her aksiyonun sahibini birlikte netleştireceğiz.</p>
      </div><div class="sign"><span class="avatar fav">${FAV}</span><div><b>Mahir Erdem</b><span>Lead Consultant</span></div></div></div>
    </div>

    <div class="block"><div class="block-head"><h2 class="h2">${esc(T('health'))}</h2><p class="micro">Check-up tarihindeki durum · ${esc(R.date)}</p></div>
      <div class="health2">
        <div class="h-main">
          <div class="gwrap">${gauge(R.overall,{w:300,stroke:26,big:68})}</div>
          <div><h3>${esc(T('score'))}: ${areaWord[st(R.overall)].toLowerCase()}</h3>
            <p>Sekiz alanın ticari etkisine göre ağırlıklandırılmış ortalaması.</p>
            <div class="keys"><span><span class="dot bad"></span>0–44 öncelikli</span><span><span class="dot warn"></span>45–64 gelişmeli</span><span><span class="dot ok"></span>65–100 sağlıklı</span></div>
          </div>
        </div>
        <div class="ggrid">${AREAS.map(a=>`<a href="#alan/${a.id}">${gauge(a.score,{w:160,stroke:14,big:34,bench:null})}<span class="gn">${esc(T(a.id))}</span><span class="gc">${a.f.length} bulgu</span></a>`).join('')}</div>
      </div>
    </div>

    <div class="block"><h2 class="h2">Büyümeyi bugün sınırlayan üç şey</h2>
      <p class="lead" style="max-width:36em">Bulguların tamamı önemli, ama sonuçları en çok bu üçü belirliyor. Önce bunlara odaklanmanızı öneriyoruz.</p>
      <div class="panel"><ol class="three in-panel">${THREE.map(x=>`<li><div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p><div class="refs">${x.f.map(k=>{const f=fk(k);return `<a class="ref" href="${fHref(f)}">Bulgu ${f.no}</a>`}).join('')}</div></div></li>`).join('')}</ol></div>
    </div>

    <div class="block"><h2 class="h2">Bu rapor nasıl ilerliyor?</h2>
      <p class="lead" style="max-width:38em">Her alanda bulduklarımızı bir öneriye, önerileri de sıralı bir aksiyon planına dönüştürdük.</p>
      <ol class="flow2">
        <li><span class="fn">1</span><b>8 alan</b><p>E-ticaretinizi sekiz açıdan inceledik.</p><a href="#alan/${AREAS[0].id}">Alanlara git</a></li>
        <li><span class="fn">2</span><b>${issues} bulgu</b><p>${c.bad} kritik, ${c.warn+c.mid} yüksek ve orta öncelikli bulgu çıktı; ${c.ok} güçlü yanı da not ettik.</p><span class="x"></span></li>
        <li><span class="fn">3</span><b>${issues} öneri</b><p>Her bulgunun altına ne yapılması gerektiğini yazdık.</p><span class="x"></span></li>
        <li><span class="fn">4</span><b>${ACTIONS.length} aksiyon</b><p>Benzer önerileri birleştirip etki ve efora göre sıraladık.</p><a href="#aksiyon-plani/liste">Aksiyon planı</a></li>
        <li><span class="fn">5</span><b>90 gün</b><p>Aksiyonları önerilen sıraya göre üç döneme yerleştirdik.</p><a href="#aksiyon-plani">90 günlük plan</a></li>
      </ol>
    </div>

    <div class="block"><h2 class="h2">Bu rapor neye dayanıyor?</h2>
      <div class="panel"><div class="basis in-panel"><div><b>18 sa.</b><span>uzman incelemesi</span></div><div><b>46</b><span>ekran ve akış</span></div><div><b>${COMP.length}</b><span>incelenen rakip</span></div><div><b>${SOURCES.length}</b><span>veri kaynağı</span></div></div>
      <ul class="sources">${SOURCES.map(s=>`<li><span class="sn">${srcIc(s)}${esc(s[0])}</span><span>${esc(s[1])}</span></li>`).join('')}</ul></div>
    </div>
    ${pager(null,'alan/'+AREAS[0].id,null,T(AREAS[0].id))}
  </section>`;
}

function vArea(a){
  const i=a.n-1,c=st(a.score);
  const prev=i>0?['alan/'+AREAS[i-1].id,T(AREAS[i-1].id)]:['genel-bakis','Genel bakış'];
  const next=i<AREAS.length-1?['alan/'+AREAS[i+1].id,T(AREAS[i+1].id)]:['aksiyon-plani',T('plan')];
  return `<section class="view" data-view="alan/${a.id}" aria-labelledby="h-${a.id}" hidden>
    <p class="crumb">Alan ${a.n} / ${AREAS.length}</p>
    <div class="area-head">
      <div><h1 class="h1" id="h-${a.id}">${esc(T(a.id))}</h1><p class="lead">${esc(a.scope)}</p></div>
      <div class="area-score" style="max-width:12rem">${gauge(a.score,{w:220,stroke:20,big:52})}<p class="micro" style="text-align:center;margin-top:.25rem">${areaWord[c]}</p></div>
    </div>
    <div class="assess panel" style="grid-template-columns:minmax(0,1fr)"><div class="body" style="max-width:var(--read)"><h2 class="sum-h">Alan özeti</h2>${a.assess.map(p=>`<p>${esc(p)}</p>`).join('')}<p class="info"><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 7v4M8 4.8v.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>${esc(a.by.replace(/^(İnceleme|Kaynak):\s*/,''))}</p></div></div>

    ${a.id==='market'?`<div class="block" style="margin-top:3rem"><div class="block-head"><h2 class="h2">İncelenen rakipler</h2><p class="micro">Rakiplerin tamamını değil, belirli başlıklarını inceledik.</p></div>
      <div class="panel" style="padding-top:.5rem;padding-bottom:.5rem"><ul class="comp">${COMP.map(c=>`<li><span class="sic" aria-hidden="true">${esc(c[0].slice(-1))}</span><div><b>${esc(c[0])}</b><small>${esc(c[1])}</small></div><span class="cw">${esc(c[2])}</span></li>`).join('')}</ul></div></div>`:''}
    <div class="block" style="margin-top:3rem"><div class="block-head"><h2 class="h2">İncelenen başlıklar</h2><p class="micro">Her başlığa tıklayarak neye baktığımızı ve sonucu görün.</p></div>
      <div class="panel" style="padding-top:.5rem;padding-bottom:.5rem"><ul class="topics2">${a.s.map(([n])=>topicRow(a,n)).join('')}</ul></div>
    </div>

    ${a.f.length?`<div class="block" style="margin-top:3.5rem"><div class="block-head"><h2 class="h2">Bulgular</h2><p class="micro">${a.f.length} bulgu, önem sırasına göre</p></div>
      <div class="prf" role="group" aria-label="Önceliğe göre filtrele"><button type="button" data-pr="" aria-pressed="true">Tümü <span>${a.f.length}</span></button>${['bad','warn','mid'].filter(p=>a.f.some(f=>f.p===p)).map(p=>`<button type="button" data-pr="${p}" aria-pressed="false"><i class="dot ${p==='mid'?'na':p}"></i>${PR[p]} <span>${a.f.filter(f=>f.p===p).length}</span></button>`).join('')}</div>
      <p class="topic-filter" hidden><span></span><button type="button" data-clear>Filtreyi temizle</button></p>
      <div class="flist-x">${a.f.map(finding).join('')}</div></div>`:''}
    ${a.good.length?`<div class="block" style="margin-top:3rem"><div class="block-head"><h2 class="h2">Korunması gerekenler</h2></div>${a.good.map(finding).join('')}</div>`:''}
    ${pager(prev[0],next[0],prev[1],next[1])}
  </section>`;
}

function actCard(a){
  const areas=[...new Set(a.src.map(f=>f.area))],s=sOf(a),info=STAT[a.k];
  return `<article class="ac ${ST_C[s]}" id="r-${a.n}" data-ph="${a.ph}" data-areas="${areas.join(' ')}">
    <div class="ac-h"><span class="ac-n">${s===2?'<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>':a.n}</span><div><span class="badge topic">${esc(a.type)}</span><h3>${esc(a.t)}</h3><p class="ac-d">${esc(a.d)}</p></div>
      <div class="stw"><div class="sts" role="group" aria-label="Aksiyon durumu">${ST_W.map((w,i)=>`<button type="button" data-st="${a.k}" data-v="${i}" aria-pressed="${s===i}" class="${ST_C[i]}">${w}</button>`).join('')}</div></div></div>
    <div class="ac-g">
      <div><h4>Nereden geldi?</h4><p class="ac-src">${areas.map(id=>`<span>${esc(T(id))}</span> ${a.src.filter(f=>f.area===id).map(f=>`<a href="${fHref(f)}">Bulgu ${f.no}</a>`).join(' ')}`).join('<br>')}</p></div>
      <div><h4>Yapıldığında ne değişmeli?</h4><p>${esc(a.exp)}</p></div>
    </div>
    ${a.sig?`<p class="ac-sig"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 7v4M8 4.8v.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>Nasıl anlaşılır?</span> ${esc(a.sig)}</p>`:''}
  </article>`;
}
function vPlan(){
  const all=progress(ACTIONS),types=[...new Set(ACTIONS.map(a=>a.type))];
  const recent=Object.entries(STAT).filter(([,v])=>v.s>0).map(([k,v])=>({a:ak(k),...v})).filter(x=>x.a).slice(-4).reverse();
  return `<section class="view" data-view="aksiyon-plani" aria-labelledby="h-plan" hidden>
    <h1 class="h1" id="h-plan">Plan</h1>
    <p class="lead" style="margin-top:1rem;max-width:38em">Sekiz alandaki önerilerimizi ${ACTIONS.length} aksiyonda topladık ve önerilen sıraya koyduk. Aksiyonları tamamladıkça işaretleyerek ilerlemenizi buradan takip edebilirsiniz.</p>
    <a class="pg-top" href="#aksiyon-plani/ilerleme"><span><b>${all[2]} / ${ACTIONS.length}</b> tamamlandı · ${all[1]} devam ediyor</span>${pbar(all)}<span class="pg-l">İlerleme takibi <svg class="arr" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>

    <div class="block" style="margin-top:3rem"><div class="block-head"><h2 class="h2">${esc(T('roadmap'))}</h2><p class="micro">Dönemler önerilen sıradır; ekibiniz hızlı ilerlerse hepsi daha erken tamamlanabilir.</p></div>
      <div class="panel rm">${PHASES.map(p=>{const L=ACTIONS.filter(a=>a.ph===p.n),c=progress(L);return `<div class="rm-r"><span class="rm-due">${p.chk[0]} · ${p.chk[1]}</span><div class="rm-p"><span class="rm-bar p${p.n}"></span><p class="pw">${p.w} · ${L.length} aksiyon</p><h3>${p.t}</h3><p class="rm-d">${p.d}</p><div class="rm-pg">${pbar(c)}<span>${c[2]} / ${L.length}</span></div></div>
        <ol class="rm-l">${L.map(a=>{const s=sOf(a);return `<li class="${ST_C[s]}"><a href="#aksiyon-plani/${a.n}"><span class="rn">${s===2?'✓':a.n}</span><span class="rt">${esc(a.t)}</span><svg class="arr" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a></li>`}).join('')}</ol></div>`}).join('')}</div>
    </div>

    <div class="block" id="liste"><div class="block-head"><h2 class="h2">${esc(T('plan'))}</h2><p class="micro">Her dönemde aksiyonlar önem sırasına göre sıralanmıştır.</p></div>
      <p class="sync"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 7v4M8 4.8v.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>Durumu değiştirdiğinizde bu değişiklik rapora erişimi olan herkese görünür. Bu alan ekibinizin kendi takibi içindir.</span></p>
      <div class="plan-tools">
        <div class="filters" role="group" aria-label="Filtrele"><button type="button" data-f="all" aria-pressed="true">Tümü</button>${PHASES.map(p=>`<button type="button" data-f="p${p.n}" aria-pressed="false">${p.w}</button>`).join('')}<button type="button" data-f="open" aria-pressed="false">Tamamlanmayanlar</button></div>
        <label><span class="sr-only">Alana göre filtrele</span><select class="sel" id="areaSel"><option value="">Tüm alanlar</option>${AREAS.map(a=>`<option value="${a.id}">${esc(T(a.id))}</option>`).join('')}</select></label>
      </div>
      <div id="planBody">${PHASES.map(p=>`<div class="ph-g" data-ph="${p.n}"><h3 class="ph-t"><span>${p.w}</span>${p.t}</h3>${ACTIONS.filter(a=>a.ph===p.n).map(actCard).join('')}</div>`).join('')}</div>
      <p class="empty panel" id="planEmpty" hidden>Bu seçimde aksiyon yok.</p>
    </div>

    <div class="block" id="ilerleme"><div class="block-head"><h2 class="h2">İlerleme takibi</h2><p class="micro">Ekibinizin işaretlediği durumlara göre güncellenir.</p></div>
      <div class="panel prog">
        <div class="pg-main"><p class="pg-num"><b>${all[2]}</b> / ${ACTIONS.length}</p><p class="pg-cap">aksiyon tamamlandı</p>${pbar(all,1)}
          <div class="pg-leg"><span><i class="st2"></i>Tamamlandı ${all[2]}</span><span><i class="st1"></i>Devam ediyor ${all[1]}</span><span><i class="st0"></i>Başlanmadı ${all[0]}</span></div></div>
        <div class="pg-cols">
          <div><h4>Dönemlere göre</h4>${PHASES.map(p=>{const L=ACTIONS.filter(a=>a.ph===p.n),c=progress(L);return `<div class="pg-row"><span>${p.w}</span>${pbar(c)}<b>${c[2]} / ${L.length}</b></div>`}).join('')}</div>
          <div><h4>İşin türüne göre</h4>${types.map(ty=>{const L=ACTIONS.filter(a=>a.type===ty),c=progress(L);return `<div class="pg-row"><span>${esc(ty)}</span>${pbar(c)}<b>${c[2]} / ${L.length}</b></div>`}).join('')}</div>
        </div>
        ${recent.length?`<details class="pg-rec"><summary><h4>Son güncellemeler</h4><svg class="chev" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><ul>${recent.map(x=>`<li><span class="dot ${x.s===2?'ok':'warn'}"></span><span><b>${esc(who(x.by))}</b>, "${esc(x.a.t)}" aksiyonunu <b>${ST_W[x.s].toLowerCase()}</b> olarak işaretledi.</span><small>${esc(x.at)}</small></li>`).join('')}</ul></details>`:''}
      </div>
    </div>
    ${pager('alan/'+AREAS[AREAS.length-1].id,null,T(AREAS[AREAS.length-1].id),null)}
  </section>`;
}

function howHTML(){
  return `<div class="help-top"><h2 id="how-t">Bu rapor nasıl hazırlandı?</h2><button type="button" data-close>Kapat</button></div>
  <p class="lead-s">Bu rapor otomatik bir tarama değildir. Bulgular ve yorumlar Commerce Clinic danışmanları tarafından yapılır; her bulgu kanıtla desteklenir ve ticari etkisine göre önceliklendirilir.</p>
  <h3>Gizlilik</h3>
  <p class="small muted">Bu rapor ve incelenen veriler gizlidir. Commerce Clinic raporu yalnızca markanın yetkili kişisine teslim eder ve üçüncü kişilerle paylaşmaz. Rapora kimlerin erişeceğine rapor sahibi karar verir; erişimler kayıt altındadır.</p>
  
  
  <h3>Neye dayanıyor?</h3>
  <ul class="areas-l src-l">${SOURCES.map(s=>`<li>${srcIc(s)}<div><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div></li>`).join('')}</ul>
  <h3>Öncelikler ne anlama geliyor?</h3>
  <div class="defl">
    <div><span class="badge bad"><i></i>Kritik</span><p>Satışı bugün doğrudan kaybettiriyor. İlk 30 günde ele alınmalı.</p></div>
    <div><span class="badge warn"><i></i>Yüksek</span><p>Satın almayı zorlaştırıyor ya da kararları yanıltıyor.</p></div>
    <div><span class="badge mid"><i></i>Orta</span><p>Güveni, verimi veya bütçe kullanımını zayıflatıyor.</p></div>
    <div><span class="badge ok"><i></i>Güçlü yan</span><p>İyi çalışan ve korunması gereken bir şey.</p></div>
  </div>
  <h3>Skorlar nasıl verildi?</h3>
  <p class="small muted">Alan skoru; incelenen başlıkların durumu, bulguların önemi ve kanıtların birlikte değerlendirilmesiyle danışman tarafından verilir. Hızlı bir referanstır, tek başına teşhis değildir.</p>
  <div class="scales" style="margin-top:.9rem"><div><i style="background:var(--bad)"></i>0–44 · Öncelikli</div><div><i style="background:var(--warn)"></i>45–64 · Gelişmeli</div><div><i style="background:var(--ok)"></i>65–100 · Sağlıklı</div></div>
  <h3>Aksiyonlar nasıl sıralandı?</h3>
  <p class="small muted">Etki, aksiyonun bağlı olduğu en önemli bulgudan gelir. Efor: <b>düşük</b> ayar veya içerik değişikliği, <b>orta</b> küçük bir geliştirme ya da tek bir entegrasyon düzeltmesi, <b>yüksek</b> birden fazla ekip veya yeni araç gerektiren iş. Yüksek etki ve düşük efor ilk 30 güne, daha fazla emek isteyen işler sonraki dönemlere yerleşir.</p>
  <h3>Sekiz alanda neye baktık?</h3>
  <ul class="areas-l">${AREAS.map(a=>`<li><b>${esc(T(a.id))}</b><span>${a.s.map(s=>esc(s[0])).join(', ')}</span></li>`).join('')}</ul>
  <h3>Bu çalışma neyi kapsamaz?</h3>
  <ul class="plain"><li>Güvenlik ve sızma testi</li><li>Derinlemesine reklam hesabı yönetimi ve teknik SEO denetimi</li><li>Önerilerin uygulanması. Commerce Check-up bir teşhis ve planlama çalışmasıdır; uygulama ekibiniz ve iş ortaklarınızla yapılır.</li></ul>`;
}
function how(o){
  const h=$('#how');
  if(o){if(typeof tour!=='undefined')tour.stop();h.hidden=false;requestAnimationFrame(()=>h.classList.add('open'));document.body.classList.remove('nav-open');h.querySelector('[data-close]').focus()}
  else{h.classList.remove('open');setTimeout(()=>{if(!h.classList.contains('open'))h.hidden=true},350)}
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-how]');if(b){how(true);return}const h=$('#how');if(h.classList.contains('open')&&!h.contains(e.target))how(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#how').classList.contains('open'))how(false)});

/* ---------- aksiyon durumu (checklist) — prototipte tarayıcıda; gerçekte rapor verisinde ortak ---------- */
const ST_W=['Başlanmadı','Devam ediyor','Tamamlandı'],ST_C=['st0','st1','st2'];
let STAT=(()=>{try{const v=localStorage.getItem('cc-status');if(v)return JSON.parse(v)}catch(e){}return {pdp:{s:2,by:'ayse@loma.com.tr',at:'29 Eyl 2026'},ritual:{s:1,by:'mehmet@loma.com.tr',at:'30 Eyl 2026'},track:{s:1,by:'ayse@loma.com.tr',at:'1 Eki 2026'},menu:{s:2,by:'mehmet@loma.com.tr',at:'2 Eki 2026'}}})();
const sOf=a=>(STAT[a.k]||{s:0}).s;
const who=e=>e?e.split('@')[0].replace(/^./,c=>c.toUpperCase()):'';
function setStatus(k,s){const d=new Date();STAT[k]={s,by:(typeof me!=='undefined'&&me)||'siz',at:d.toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'})};try{localStorage.setItem('cc-status',JSON.stringify(STAT))}catch(e){}const y=scrollY;render();window.scrollTo(0,y)}
function progress(list){const c=[0,0,0];list.forEach(a=>c[sOf(a)]++);return c}
function pbar(c,big){const n=c[0]+c[1]+c[2]||1;return `<div class="pb${big?' big':''}" role="img" aria-label="${c[2]} tamamlandı, ${c[1]} devam ediyor, ${c[0]} başlanmadı"><i class="st2" style="width:${c[2]/n*100}%"></i><i class="st1" style="width:${c[1]/n*100}%"></i></div>`}

/* ---------- render + routing ---------- */
let curPh='all',curArea='';
function render(){
  $('#main').innerHTML=vOverview()+AREAS.map(vArea).join('')+vPlan()+`<footer class="rfoot"><span>Bu rapordaki bulgular ve yorumlar Commerce Clinic danışmanları tarafından hazırlanmıştır. Gizlidir; yalnızca yetkilendirilen kişilerle paylaşılır.</span><span>© 2026 Commerce Clinic · Tüm hakları saklıdır.</span></footer>`;
  $('#how').innerHTML=howHTML();$('#how [data-close]').addEventListener('click',()=>how(false));
  $$('.pager button').forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.go}));
  $$('.filters button').forEach(b=>b.addEventListener('click',()=>{curPh=b.dataset.f;applyPlan()}));
  $('#areaSel').addEventListener('change',e=>{curArea=e.target.value;applyPlan()});
  $$('[data-tour]').forEach(b=>b.addEventListener('click',()=>tour.start()));
  $$('.tp-f').forEach(b=>b.addEventListener('click',()=>topic(b)));
  $$('.tp-h').forEach(b=>b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',o);document.getElementById(b.getAttribute('aria-controls')).hidden=!o}));
  $$('[data-clear]').forEach(b=>b.addEventListener('click',()=>clearTopic(b.closest('.view'))));
  $$('.prf button').forEach(b=>b.addEventListener('click',()=>prio(b)));
  $$('[data-st]').forEach(b=>b.addEventListener('click',()=>setStatus(b.dataset.st,+b.dataset.v)));
  route(true);
}
function topic(b){const v=b.closest('.view');v.dataset.topic=b.dataset.topic;filterArea(v,true)}
function prio(b){const v=b.closest('.view');v.dataset.pr=b.dataset.pr;filterArea(v,false)}
function filterArea(v,jump){
  const tp=v.dataset.topic||'',p=v.dataset.pr||'';let k=0;
  v.querySelectorAll('.prf button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.pr===p));
  v.querySelectorAll('.flist-x .fx').forEach(el=>{const f=F.find(f=>'f-'+f.no===el.id);const on=f&&(!tp||f.ss.includes(tp))&&(!p||f.p===p);el.hidden=!on;if(on)k++});
  const tf=v.querySelector('.topic-filter');if(!tf)return;
  if(tp||p){tf.hidden=false;tf.querySelector('span').textContent=`${tp?`"${tp}" başlığında `:''}${p?PR[p].toLowerCase()+' öncelikli ':''}${k} bulgu gösteriliyor.`}else tf.hidden=true;
  if(jump&&tp)v.querySelector('.flist-x').closest('.block').scrollIntoView({block:'start'});
}
function clearTopic(v){v.dataset.topic='';v.dataset.pr='';if(v.querySelector('.prf'))filterArea(v,false)}
function applyPlan(){
  $$('.filters button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===curPh));
  $('#areaSel').value=curArea;let n=0;
  $$('#planBody .ac').forEach(r=>{const on=(curPh==='all'||curPh==='p'+r.dataset.ph||(curPh==='open'&&!r.classList.contains('st2')))&&(!curArea||r.dataset.areas.split(' ').includes(curArea));r.hidden=!on;if(on)n++});
  $$('#planBody .ph-g').forEach(g=>g.hidden=!g.querySelector('.ac:not([hidden])'));
  $('#planEmpty').hidden=n>0;
}
let lastView=null;
function route(keep){
  const h=decodeURIComponent(location.hash.slice(1))||'genel-bakis',parts=h.split('/');
  let view=parts[0],target=null;
  if(view==='alan'){view='alan/'+(parts[1]||'');target=parts[2]?'f-'+parts[2]:null}
  else if(view==='aksiyon-plani'&&parts[1]){target=(parts[1]==='liste'||parts[1]==='ilerleme')?parts[1]:'r-'+parts[1];curPh='all';curArea=''}
  else if(view==='90-gun'){view='aksiyon-plani'}
  if(!$(`[data-view="${view}"]`))view='genel-bakis';
  $$('.view').forEach(v=>{v.hidden=v.dataset.view!==view;if(!v.hidden)clearTopic(v)});
  $('#rail').innerHTML=rail(view);
  $$('#rail [data-tour]').forEach(b=>b.addEventListener('click',()=>tour.start()));
  $$('#rail [data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  document.body.classList.remove('nav-open');$('#menuBtn').setAttribute('aria-expanded','false');
  if(view==='aksiyon-plani')applyPlan();
  if(keep===true&&!target)return;
  const same=lastView===view;lastView=view;
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>{const el=target&&document.getElementById(target);
    if(el){el.scrollIntoView({block:'start',behavior:same&&!RM?'smooth':'auto'});if(target.startsWith('r-')){el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),1600)}}else window.scrollTo(0,0)});
}

/* ---------- tur ---------- */
const tour=(()=>{
  const steps=[
    {v:'genel-bakis',sel:'.how-card',t:'Bu rapor nasıl hazırlandı?',d:'Raporun neye dayandığını, skorların ve önceliklerin ne anlama geldiğini buradan açabilirsiniz. Okurken takıldığınızda buraya dönebilirsiniz.'},
    {v:'genel-bakis',sel:'.letter',t:'Önce kısa özeti okuyun',d:'Raporun ana fikri ve danışmanın genel tespiti burada.'},
    {v:'genel-bakis',sel:'.health2',t:'Sağlık skoru',d:'Genel skor ve sekiz alanın skorları: kırmızı öncelikli, turuncu gelişmeli, yeşil sağlıklı. Skorlar check-up tarihindeki durumu gösterir; aksiyonlar tamamlandıkça değişmez. Bir alana tıklayarak ayrıntısına geçebilirsiniz.'},
    {v:'genel-bakis',sel:'.three',t:'Odaklanılacak üç konu',d:'Sonuçları en çok bu üç konu belirliyor. Altındaki bağlantılar ilgili bulgulara götürür.'},
    {v:'genel-bakis',sel:'#rail .grp:nth-of-type(1)',rail:1,railAll:1,t:'Rapor üç adımda ilerler',d:'Durum: genel tablo. Teşhis: sekiz alan ve skorları; skoru düşük alanlardan başlamanızı öneriyoruz. Plan: 90 günlük plan, aksiyonlar ve ilerleme takibi.'},
    {v:'alan/ux',sel:'.topics2',t:'İncelenen başlıklar',d:'Her alanda neye baktığımızı görürsünüz. Bir başlığa tıklayınca neye baktığımız, sonuç ve ilgili bulgular açılır. Rengi bulgulardan gelir; sorun yoksa "Sorun görülmedi" yazar.'},
    {v:'alan/ux',sel:'.flist-x .fx .fx-top',pad:10,t:'Bulgunun önceliği',d:'Her bulgunun üstünde önceliği ve ait olduğu başlık yazar. Bulguları üstteki düğmelerle önceliğe göre süzebilirsiniz.'},
    {v:'alan/ux',sel:'.flist-x .fx .gal',t:'Görseller',d:'Ekran görüntüleri ve kayıtlar. Altındaki not, görselde neyi vurguladığımızı söyler; görsele tıklayınca büyür.'},
    {v:'alan/ux',sel:'.flist-x .fx .two',t:'Ne gördük, neden önemli?',d:'Solda gözlemimiz, sağda bunun satışa, marja ya da müşteriye etkisi. Başlığın altındaki satır, bulgunun etkilediği metriği gösterir.'},
    {v:'alan/ux',sel:'.flist-x .fx .recx',t:'Önerimiz',d:'Ne yapılması gerektiği. En alttaki kart, bu önerinin plandaki karşılığına götürür.'},
    {v:'aksiyon-plani',sel:'.rm',t:'90 günlük plan',d:'Aksiyonlar önerilen sıraya göre üç döneme yerleşir. Dönemler takvim değil sıradır; ekibiniz hızlı ilerlerse hepsi daha erken bitebilir. Bir aksiyona tıklayınca kartına gidersiniz.'},
    {v:'aksiyon-plani',sel:'#planBody .ac',t:'Aksiyon kartı',d:'İşin türü, hangi bulgudan geldiği ve yapıldığında neyin değişmesi gerektiği. "Nasıl anlaşılır?" satırı, işin sonuç verip vermediğini neye bakarak anlayacağınızı söyler.'},
    {v:'aksiyon-plani',sel:'#planBody .ac .stw',t:'İlerlemenizi işaretleyin',d:'Her aksiyonu Başlanmadı, Devam ediyor ya da Tamamlandı olarak işaretleyin. Değişiklik rapora erişimi olan herkese görünür.'},
    {v:'aksiyon-plani',sel:'#ilerleme .prog',t:'İlerleme takibi',d:'İşaretlediğiniz durumlar burada toplanır: genel ilerleme, dönemlere ve işin türüne göre dağılım. Sol menüden doğrudan buraya gelebilirsiniz.'},
    {v:'aksiyon-plani',sel:'#shareBtn',g:1,t:'Ekibinizle paylaşın',d:'Rapor sahibi, Paylaş ile ekibinden en fazla 5 kişiyi e-postayla davet edebilir ve erişimlerini yönetebilir.'},
    {v:'genel-bakis',sel:'.rail-foot .tour-btn',rail:1,t:'Tur bitti',d:'Bu turu istediğiniz zaman buradan yeniden başlatabilirsiniz.'}
  ];
  let i=0,on=false;const el=$('#tour'),spot=$('#tSpot'),card=$('#tCard');
  const mob=()=>innerWidth<=900;
  function target(){const s=steps[i];return document.querySelector((s.rail||s.g)?s.sel:`[data-view="${s.v}"] ${s.sel}`)}
  function place(){
    const s=steps[i],t=target();if(!t)return;
    let r=t.getBoundingClientRect();const p=s.pad||8;
    if(s.railAll){const rs=[...document.querySelectorAll('#rail .grp')].map(e=>e.getBoundingClientRect());r={top:Math.min(...rs.map(x=>x.top)),left:Math.min(...rs.map(x=>x.left)),bottom:Math.max(...rs.map(x=>x.bottom)),right:Math.max(...rs.map(x=>x.right))};r.width=r.right-r.left;r.height=r.bottom-r.top}
    const top=Math.max(8,r.top-p),left=Math.max(8,r.left-p),w=Math.min(innerWidth-16,r.width+p*2),h=Math.min(innerHeight-16,r.bottom+p-top);
    Object.assign(spot.style,{top:top+'px',left:left+'px',width:w+'px',height:h+'px'});
    const cw=card.offsetWidth,ch=card.offsetHeight,g=14;
    let ct,cl;
    if(top+h+g+ch<innerHeight-8){ct=top+h+g}else if(top-g-ch>8){ct=top-g-ch}else{ct=innerHeight-ch-12}
    if(s.rail&&!mob()){cl=Math.min(left+w+g,innerWidth-cw-8);ct=Math.min(Math.max(8,top),innerHeight-ch-8)}
    else cl=Math.min(Math.max(8,left),innerWidth-cw-8);
    card.style.top=ct+'px';card.style.left=cl+'px';
  }
  function show(){
    const s=steps[i];
    const need='#'+s.v, cur=location.hash||'#genel-bakis';
    if(cur.split('/').slice(0,s.v.split('/').length).join('/')!==need){location.hash=s.v}
    document.body.classList.toggle('nav-open',!!(s.rail&&mob()));
    card.innerHTML=`<p class="tc-n">${i+1} / ${steps.length}</p><h3 id="tTitle">${esc(s.t)}</h3><p>${esc(s.d)}</p>
      <div class="t-bar"><i style="width:${(i+1)/steps.length*100}%"></i></div>
      <div class="tc-f"><button type="button" class="skip">${i===steps.length-1?'Kapat':'Turu kapat'}</button><span class="sp"></span>${i?'<button type="button" class="prev">Önceki</button>':''}<button type="button" class="next">${i===steps.length-1?'Bitir':'Sonraki'}</button></div>`;
    card.querySelector('.skip').onclick=stop;card.querySelector('.next').onclick=()=>i===steps.length-1?stop():go(1);
    const pv=card.querySelector('.prev');if(pv)pv.onclick=()=>go(-1);
    setTimeout(()=>{const t=target();if(t&&!s.rail&&!s.g){const tall=t.getBoundingClientRect().height>innerHeight*.5;if(tall){t.scrollIntoView({block:'start'});scrollBy(0,-(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bar'))||60)-16)}else t.scrollIntoView({block:'center'})}requestAnimationFrame(()=>{place();card.querySelector('.next').focus({preventScroll:true})})},60);
  }
  function go(d){i=Math.max(0,Math.min(steps.length-1,i+d));show()}
  function start(){i=0;on=true;el.hidden=false;document.body.classList.remove('nav-open');show()}
  function stop(){on=false;el.hidden=true;document.body.classList.remove('nav-open')}
  addEventListener('resize',()=>on&&place());addEventListener('scroll',()=>on&&place(),{passive:true});
  document.addEventListener('keydown',e=>{if(!on)return;if(e.key==='Escape')stop();else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1)});
  return {start,stop};
})();
document.addEventListener('click',e=>{const im=e.target.closest('[data-zoom]');const lb=$('#lb');if(im){lb.querySelector('img').src=im.src;lb.querySelector('p').textContent=im.alt;lb.hidden=false;return}if(!lb.hidden&&e.target.closest('#lb'))lb.hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#lb').hidden=true});
window.addEventListener('hashchange',()=>route());
function setLang(l){LANG=l;try{localStorage.setItem('cc-report-lang',LANG)}catch(e){}
  const y=scrollY;render();window.scrollTo(0,y)}
$('#menuBtn').addEventListener('click',()=>{const o=document.body.classList.toggle('nav-open');if(o)$('#rail').scrollTop=0;$('#menuBtn').setAttribute('aria-expanded',o)});
$('#scrim').addEventListener('click',()=>{document.body.classList.remove('nav-open');$('#menuBtn').setAttribute('aria-expanded','false')});

/* ---------- giriş ve paylaşım (prototip: tarayıcıda simüle edilir) ---------- */
const OWNER='ayse@loma.com.tr',MAXP=5;
const lock='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let people=LS.get('cc-people',[{e:OWNER,owner:1,st:'Giriş yaptı'},{e:'mehmet@loma.com.tr',st:'Giriş yaptı'},{e:'eticaret@ajans.com',st:'Davet gönderildi'}]);
let me=LS.get('cc-me',null);
const logo=()=>document.querySelector('.bar .logo').innerHTML;
function toast(m){const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
function authStep1(err){
  $('#auth .auth-card').innerHTML=`<div class="lg">${logo()}</div><h1 id="authT">${esc(R.client)} · Commerce Check-up raporu</h1>
  <p class="ds">Rapora erişmek için davet edilen e-posta adresinizi girin. Size tek kullanımlık bir giriş kodu göndereceğiz.</p>
  <label class="fld"><span>E-posta adresi</span><input class="inp" id="aMail" type="email" autocomplete="email" placeholder="ad@sirket.com" value="${esc(err?err.v:'')}"></label>
  <p class="err" id="aErr">${err?esc(err.m):''}</p>
  <button class="pbtn" id="aSend" type="button">Kod gönder</button>
  <p class="lock">${lock}<span>Bu rapor ve incelenen veriler gizlidir. Commerce Clinic raporu yalnızca markanın yetkili kişisine teslim eder, üçüncü kişilerle paylaşmaz. Rapora kimlerin erişeceğine rapor sahibi karar verir. E-posta adresinizin işlenmesine ilişkin bilgi için <a href="#" class="kvkk">KVKK Aydınlatma Metni</a>.</span></p>
  <p class="lock" style="border:0;margin-top:.5rem;padding:0"><span>Prototipte rapor sahibi olarak giriş: <button type="button" class="lnk" id="aDemo">${OWNER}</button></span></p>`;
  const go=()=>{const v=$('#aMail').value.trim().toLowerCase();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))return authStep1({v,m:'Geçerli bir e-posta adresi girin.'});
    if(!people.some(p=>p.e===v))return authStep1({v,m:'Bu adres rapora davet edilmemiş. Raporun sahibinden davet isteyin.'});
    authStep2(v)};
  $('#aDemo').onclick=()=>{$('#aMail').value=OWNER;go()};
  $('#aSend').onclick=go;$('#aMail').onkeydown=e=>{if(e.key==='Enter')go()};setTimeout(()=>$('#aMail').focus(),50);
}
function authStep2(v){
  $('#auth .auth-card').innerHTML=`<div class="lg">${logo()}</div><h1 id="authT">Giriş kodunu girin</h1>
  <p class="ds"><b style="color:var(--cc-text);font-weight:500">${esc(v)}</b> adresine 6 haneli bir kod gönderdik. Kod 10 dakika geçerlidir.</p>
  <div class="otp">${[0,1,2,3,4,5].map(i=>`<input inputmode="numeric" maxlength="1" aria-label="Kod ${i+1}. hane">`).join('')}</div>
  <p class="err"></p><button class="pbtn" id="aGo" type="button" disabled>Giriş yap</button>
  <p style="display:flex;justify-content:space-between;margin-top:1rem"><button class="lnk" id="aBack" type="button">Farklı adres</button><button class="lnk" id="aRe" type="button">Kodu yeniden gönder</button></p>
  <p class="lock">${lock}<span>Prototipte herhangi 6 hane kabul edilir.</span></p>`;
  const ins=$$('.otp input'),btn=$('#aGo');
  const upd=()=>btn.disabled=ins.some(i=>!/^\d$/.test(i.value));
  ins.forEach((i,k)=>{i.oninput=()=>{i.value=i.value.replace(/\D/g,'').slice(-1);if(i.value&&ins[k+1])ins[k+1].focus();upd()};
    i.onkeydown=e=>{if(e.key==='Backspace'&&!i.value&&ins[k-1])ins[k-1].focus();if(e.key==='Enter'&&!btn.disabled)btn.click()};
    i.onpaste=e=>{const d=(e.clipboardData.getData('text')||'').replace(/\D/g,'').slice(0,6);if(d.length){e.preventDefault();ins.forEach((x,j)=>x.value=d[j]||'');upd();ins[Math.min(d.length,5)].focus()}}});
  ins[0].focus();
  btn.onclick=()=>{me=v;LS.set('cc-me',me);const p=people.find(p=>p.e===v);if(p&&p.st!=='Giriş yaptı'){p.st='Giriş yaptı';LS.set('cc-people',people)}$('#auth').hidden=true;meBtn()};
  $('#aBack').onclick=()=>authStep1();$('#aRe').onclick=()=>toast('Yeni kod gönderildi.');
}
function meBtn(){const b=$('#meBtn');b.textContent=me?me[0]:'';b.hidden=!me;$('#shareBtn').hidden=!me}
function share(){
  const isOwner=people.some(p=>p.e===me&&p.owner),n=people.filter(p=>!p.owner).length;
  $('#share .m-card').innerHTML=`<div class="m-top"><h2 id="shT">Raporu paylaş</h2><button type="button" data-x>Kapat</button></div>
  <p class="ds">Raporu ekibinizden en fazla ${MAXP} kişiyle paylaşabilirsiniz. Davet ettiğiniz kişiler e-posta adresleriyle ve tek kullanımlık kodla giriş yapar.</p>
  ${isOwner?`<div class="inv"><label class="sr-only" for="invMail">Davet edilecek e-posta</label><input class="inp" id="invMail" type="email" placeholder="ad@sirket.com" ${n>=MAXP?'disabled':''}><button type="button" id="invGo" ${n>=MAXP?'disabled':''}>Davet gönder</button></div><p class="err" id="invErr"></p>`:`<p class="lock" style="border:0;margin-top:1rem;padding:0">${lock}<span>Davet gönderme ve erişimi kaldırma yetkisi raporun sahibindedir.</span></p>`}
  <div class="cap"><span>Davet edilen kişiler</span><span>${n} / ${MAXP}</span></div><div class="capbar"><i style="width:${n/MAXP*100}%"></i></div>
  <ul class="people">${people.map((p,i)=>`<li><span class="av">${esc(p.e[0])}</span><div><b>${esc(p.e)}${p.e===me?' (siz)':''}</b><small>${p.owner?'Rapor sahibi':esc(p.st)}</small></div>${p.owner?'<span class="own">Sahip</span>':isOwner?`<button type="button" class="rm" data-rm="${i}">Kaldır</button>`:''}</li>`).join('')}</ul>
  <p class="lock">${lock}<span>Rapor yalnızca bu listedeki kişilere görünür ve erişimler kayıt altındadır. Commerce Clinic raporu üçüncü kişilerle paylaşmaz. Erişimi kaldırılan kişi rapora bir daha giremez. Davet edeceğiniz kişilerin e-posta adresleri <a href="#" class="kvkk">KVKK Aydınlatma Metni</a> kapsamında işlenir.</span></p>`;
  $('#share [data-x]').onclick=()=>$('#share').hidden=true;
  $$('#share [data-rm]').forEach(b=>b.onclick=()=>{const p=people[+b.dataset.rm];people.splice(+b.dataset.rm,1);LS.set('cc-people',people);share();toast(p.e+' erişimi kaldırıldı.')});
  const go=$('#invGo');if(go){const f=()=>{const v=$('#invMail').value.trim().toLowerCase();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){$('#invErr').textContent='Geçerli bir e-posta adresi girin.';return}
    if(people.some(p=>p.e===v)){$('#invErr').textContent='Bu adresin zaten erişimi var.';return}
    people.push({e:v,st:'Davet gönderildi'});LS.set('cc-people',people);share();toast(v+' adresine davet gönderildi.')};
    go.onclick=f;$('#invMail').onkeydown=e=>{if(e.key==='Enter')f()}}
  $('#share').hidden=false;
}
$('#shareBtn').addEventListener('click',share);
$('#share').addEventListener('click',e=>{if(e.target.id==='share')$('#share').hidden=true});
$('#meBtn').addEventListener('click',e=>{let m=$('.me-menu');if(m){m.remove();return}m=document.createElement('div');m.className='me-menu';const r=e.currentTarget.getBoundingClientRect();m.style.top=(r.bottom+8)+'px';m.style.right=(innerWidth-r.right)+'px';
  m.innerHTML=`<p>${esc(me)}</p><button type="button" data-a="share">Raporu paylaş</button><button type="button" data-a="out">Çıkış yap</button>`;document.body.appendChild(m);
  m.querySelector('[data-a=share]').onclick=()=>{m.remove();share()};m.querySelector('[data-a=out]').onclick=()=>{m.remove();me=null;LS.set('cc-me',null);meBtn();$('#auth').hidden=false;authStep1()}});
document.addEventListener('click',e=>{const m=$('.me-menu');if(m&&!m.contains(e.target)&&e.target.id!=='meBtn')m.remove()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#share').hidden=true});
if(!me){me=OWNER;LS.set('cc-me',me)}meBtn();
render();
})();

