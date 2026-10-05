// Ücretsiz rehber · altyapı değiştirirken 12 adımlık kontrol listesi
// Çıktı: content/pages/kontrol-listesi.html (sayfa: /rehber/e-ticaret-altyapi-gecisi/kontrol-listesi) + rehber tanıtım sayfasındaki adım listesi
// Çalıştır: node design/kontrol-listesi/altyapi-gecisi.mjs
// Anahtarlar (s1-1 …) sıradan üretilir; madde ekleyip çıkarınca kullanıcıların tarayıcıdaki işaretleri kayabilir. Yayından sonra sona ekleyin.
import fs from "node:fs";

// Madde: "metin" ya da ["metin", "koşul"] → koşullu maddelerde "Bizde yok" seçeneği çıkar, seçilirse sayımdan düşer
const PHASES = [
  { id: "once", n: 1, t: "Geçiş öncesi", d: "Kapsam netleşir; veri, üyeler, adresler, entegrasyonlar ve ölçüm kodları taşınmaya hazırlanır.", steps: [
    { t: "Geçişin amacını, kapsamını ve takvimini netleştirin", d: "Yalnız altyapı mı değişiyor, yoksa tasarım, ERP ya da alan adı da mı? Kapsam baştan net değilse takvim de net olmaz.", i: [
      "Geçişle çözülmesi beklenen problemler ve ölçülebilir hedefler yazılı",
      "Kapsam belli: altyapı, tasarım, ERP, alan adı; hangisi değişiyor, hangisi aynı kalıyor",
      "Bugünkü değerler kaydedildi: trafik, organik trafik, dönüşüm oranı, ortalama sepet, sayfa hızı skorları",
      "Canlıya geçiş tarihi kampanya ve yoğun satış dönemlerinin dışında; test için tampon süre bırakıldı",
      "Kararları kimin onaylayacağı ve ajans / altyapı firması tarafındaki muhatap belli" ] },
    { t: "Yeni altyapının gereksinimleri karşıladığını doğrulayın", d: "Bugün sitede çalışan her şeyin yeni altyapıda bir karşılığı olmalı.", i: [
      "Olmazsa olmaz özellikler listelendi ve yeni altyapıda tek tek karşılığı bulundu",
      "Mevcut özel geliştirmelerin yeni altyapıda nasıl yapılacağı netleşti",
      "Kullanılan ödeme kuruluşu, taksit seçenekleri ve kargo firmaları destekleniyor",
      "Kampanya, kupon ve fiyat kurguları yeni altyapıda kurulabiliyor",
      ["Çoklu dil, para birimi ya da yurt dışı satış kurgusu destekleniyor", "Yurt dışı satış varsa"],
      ["B2B fiyat listeleri ve bayi girişleri destekleniyor", "B2B varsa"],
      "Yönetim paneli rolleri ve yetkileri ekip yapısına uyuyor" ] },
    { t: "Veri envanterini ve taşıma planını hazırlayın", d: "Neyin taşınacağı, neyin taşınmayacağı ve neyin arşivleneceği baştan yazılı olmalı.", i: [
      "Ürün, varyant, kategori, marka ve görseller sayıldı; taşıma sonrası sayılar karşılaştırılacak",
      "Ürün açıklamaları, filtre özellikleri ve SEO alanları (başlık, açıklama) taşıma kapsamında",
      "Sipariş geçmişinin taşınıp taşınmayacağına karar verildi",
      ["Ürün yorumları ve değerlendirmeler taşınıyor", "Yorumlar varsa"],
      ["Hediye çekleri, puan ve sadakat bakiyeleri taşınıyor", "Varsa"],
      "İçerik sayfaları, blog yazıları ve kampanya sayfaları listelendi",
      "Taşınmayacak veriler için arşiv yöntemi belirlendi" ] },
    { t: "Üye geçişini ve şifre sürecini planlayın", d: "Şifreler güvenlik gereği altyapılar arasında taşınamaz; üyeler yeni şifre belirlemek zorunda kalır. Bunu önceden kolaylaştırın.", i: [
      "Üyeler; iletişim izinleri (ticari ileti onayları, İYS kayıtları) ile birlikte taşınıyor",
      "Giriş ve üyelik adımlarına not eklendi: \"Daha önce üye olduysanız Şifremi unuttum ile yeni şifre belirleyin.\"",
      "Şifre sıfırlama e-postası yeni altyapıda test edildi ve markaya uygun",
      "Mevcut üyelere geçiş duyurusu (e-posta / SMS) hazır, gönderim zamanı belli",
      ["Google, Apple gibi sosyal girişler yeni altyapıda yeniden kuruldu", "Sosyal giriş varsa"],
      "Müşteri hizmetleri için \"giriş yapamıyorum\" sorusuna hazır yanıt var" ] },
    { t: "URL, link ve yönlendirme haritasını çıkarın", d: "Arama görünürlüğünü ve reklamlardan gelen trafiği korumanın en kritik adımı.", i: [
      "Tüm adresler çıkarıldı: site haritası, Search Console ve analitikte en çok ziyaret alan sayfalar",
      "Ürün, kategori, marka, içerik ve kampanya sayfaları için eski → yeni 301 yönlendirme tablosu hazır",
      "Banner, slider ve menülerdeki linkler yeni adreslere göre güncellendi",
      "E-posta şablonları, sosyal medya profilleri, QR kodlar ve basılı materyallerdeki linkler listelendi",
      "Sayfa başlıkları, açıklamalar, canonical ve yapısal veri taşınıyor",
      "Yeni robots.txt ve site haritası hazır",
      ["Alan adı paneli ve DNS erişimi elde; eski alan adındaki her adres yeni alan adına 301 ile gidiyor", "Alan adı değişiyorsa"],
      ["Search Console'da adres değişikliği bildirimi planlandı", "Alan adı değişiyorsa"],
      "Yapay zekâ aramaları için ayarlar yeni altyapıda: robots.txt'de yapay zekâ tarayıcılarına (GPTBot, Google-Extended, PerplexityBot vb.) verilen izinler bilinçli, llms.txt hazır, ürün ve marka yapısal verisi yerinde" ] },
    { t: "Entegrasyonları ve sorumlularını netleştirin", d: "Her entegrasyonun bir sahibi, bir test senaryosu ve canlıya geçişte bir kontrolü olmalı.", i: [
      "Tüm entegrasyonlar ve sahipleri listelendi; API erişimleri ve sözleşmeler tek yerde",
      ["ERP: stok, fiyat, sipariş, iade ve cari eşleşmesi senaryoları yazıldı", "ERP varsa"],
      ["Yeni ERP'ye de geçiliyorsa iki geçişin sırası ve takvimi ayrı planlandı", "Yeni ERP varsa"],
      "Muhasebe, e-fatura ve e-arşiv akışı yeni altyapıya bağlanıyor",
      ["Pazaryeri entegrasyonu ve stok paylaşımı yeni altyapıya göre kuruldu; stok çakışması riski kontrol edildi", "Pazaryeri varsa"],
      "E-posta / SMS pazarlama ve CRM araçları yeni altyapıya bağlanıyor" ] },
    { t: "Ölçüm ve reklam kodlarının taşınmasını planlayın", d: "Kodlar taşınmazsa geçişten sonraki ilk haftalar hem ölçülemez hem reklam algoritmaları öğrendiğini kaybeder.", i: [
      "Kullanılan tüm kodlar listelendi: GA4, GTM, Meta Pixel, Google Ads, TikTok, Criteo vb.",
      "E-ticaret olayları (ürün görüntüleme, sepete ekleme, ödeme, satın alma) yeni altyapıda kuruldu",
      ["Meta Conversions API ve sunucu taraflı etiketleme yeniden kuruldu", "Kullanılıyorsa"],
      "Google Merchant Center ve diğer ürün feed'leri yeni adreslere göre hazır",
      "Çerez onayı ve Consent Mode yeni sitede çalışıyor",
      "Canlıya geçiş günü reklamların duraklatılması ya da bütçenin kısılması planlandı" ] },
  ] },
  { id: "sirasi", n: 2, t: "Test ve canlıya geçiş", d: "Yeni site gerçek senaryolarla denenir, geçiş günü adım adım yürütülür.", steps: [
    { t: "Tasarımı ve içeriği tüm çözünürlüklerde kontrol edin", d: "Yeni tasarım varsa her ekran mobil, tablet ve masaüstünde ayrı ayrı gözden geçirilmeli.", i: [
      "Ana sayfa, kategori, ürün detay, sepet, ödeme ve üyelik ekranları mobil, tablet ve masaüstünde kontrol edildi",
      "Farklı tarayıcılarda (Safari, Chrome, Samsung Internet) denendi",
      "Boş sepet, stokta yok, arama sonucu yok ve 404 sayfaları tasarlandı",
      "Ürün görselleri, açıklamalar ve varyant seçimleri örnekleme ile kontrol edildi",
      "Yasal metinler (KVKK, mesafeli satış, çerez, iade) ve iletişim bilgileri yerinde" ] },
    { t: "Sipariş, ödeme ve operasyon akışını uçtan uca test edin", d: "Sepetten teslimata ve iadeye kadar, gerçek senaryolarla.", i: [
      "Üye ve misafir olarak, mobil ve masaüstünde sipariş verildi",
      "Kupon, kampanya ve kargo ücreti kuralları doğru hesaplanıyor",
      "Tüm ödeme yöntemleri, taksitler, 3D Secure ve başarısız ödeme akışı denendi",
      "Sipariş, kargo ve iade bildirimleri (e-posta / SMS) doğru gidiyor",
      "Kargo etiketi ve takip numarası oluşuyor",
      "İade ve iptal akışı denendi; fatura doğru kesiliyor",
      ["Test siparişleri ERP'ye doğru aktarıldı; stok ve fiyat doğru geri geliyor", "ERP varsa"] ] },
    { t: "Canlıya geçiş gününü planlayın ve yürütün", d: "Kim, neyi, hangi sırayla yapacak ve sorun çıkarsa ne olacak?", i: [
      "Geçiş günü adım adım yazıldı; her adımın sorumlusu ve saati belli",
      "Reklamlar duraklatıldı ya da bütçe kısıldı",
      "Eski sitede sipariş alımı durduruldu; son sipariş, stok ve üye aktarımı yapıldı",
      "DNS, SSL ve 301 yönlendirmeler canlıda çalışıyor",
      "İletişim kanalları çalışıyor: telefon, WhatsApp, e-posta, iletişim formu",
      "Ekip, geçişi izleyen ilk saatlerde ulaşılabilir",
      "Geri dönüş koşulu ve yöntemi önceden belirlendi" ] },
  ] },
  { id: "sonrasi", n: 3, t: "Geçiş sonrası", d: "İlk günler yakından izlenir, kayıplar erken yakalanır, sonuç ilk adımda yazılan hedefle karşılaştırılır.", steps: [
    { t: "İlk hafta: kontrolleri yapın, trafiği geri açın", d: "Kaybolan sayfalar, kırık linkler ve çalışmayan kodlar en çok ilk günlerde yakalanır.", i: [
      "Site bir tarama aracıyla (Screaming Frog vb.) tarandı; kırık link ve yönlendirme zinciri yok",
      "Eski adreslerden örnekler tek tek denendi; doğru sayfaya gidiyor",
      "Yeni site haritası Search Console'a gönderildi; kapsam hataları izleniyor",
      "Analitik ve reklam dönüşümleri veri topluyor; satın almalar ile siparişler tutuyor",
      "Reklamlar kademeli olarak tekrar açıldı; ürün feed'leri onaylandı",
      "Kısa süreli ısı haritası ve oturum kaydı kuruldu (Hotjar, Microsoft Clarity)",
      ["İlk haftalar için kısa süreli canlı destek kuruldu", "Canlı destek yoksa"] ] },
    { t: "İlk 30 gün: ölçün ve sonucu değerlendirin", d: "Geçiş, ilk adımda yazılan hedefe ulaştı mı?", i: [
      "PageSpeed ve Core Web Vitals değerleri geçiş öncesiyle karşılaştırıldı",
      "Organik trafik ve sıralamalar haftalık izleniyor",
      "Dönüşüm oranı, ortalama sepet ve sepet terk oranı önceki değerlerle karşılaştırıldı",
      "Müşteri hizmetlerine gelen geçişle ilgili şikâyetler toplandı ve çözüldü",
      "Isı haritası ve oturum kayıtlarından çıkan sorunlar listelendi",
      "Hedeflerle karşılaştırma yapıldı; açık kalan işler önceliklendirildi",
      "Geçici araçların (ısı haritası, canlı destek) kalıp kalmayacağına karar verildi" ] },
  ] },
];

const ROUTE = "/rehber/e-ticaret-altyapi-gecisi/kontrol-listesi";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const chk = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>';
const all = PHASES.flatMap((p) => p.steps);
const total = all.reduce((a, s) => a + s.i.length, 0);
let n = 0;

const item = (id, j, it) => {
  const [t, cond] = Array.isArray(it) ? it : [it];
  const k = `${id}-${j + 1}`;
  return `          <li${cond ? " class=\"kl-c\"" : ""}><label class="kl-it"><input type="checkbox" data-k="${k}"><span class="kl-bx" aria-hidden="true">${chk}</span><span class="kl-tx">${cond ? `<em class="kl-if">${esc(cond)}</em> ` : ""}${esc(t)}</span></label>${cond ? `<button type="button" class="kl-na" data-na="${k}" aria-pressed="false">Bizde yok</button>` : ""}</li>`;
};

const phases = PHASES.map((p) => `
    <section class="kl-ph" id="${p.id}" aria-labelledby="${p.id}-t">
      <header class="kl-ph-h"><p class="kl-ph-e">${p.n}. aşama</p><h2 class="kl-ph-t" id="${p.id}-t">${p.t}</h2><p class="kl-ph-d">${p.d}</p></header>
${p.steps.map((s) => { n++; const id = `s${n}`; return `      <article class="kl-step" id="${id}" data-step="${n}" aria-labelledby="${id}-t">
        <div class="kl-sh"><span class="kl-n" aria-hidden="true">${String(n).padStart(2, "0")}</span><div><h3 class="kl-st" id="${id}-t">${esc(s.t)}</h3><p class="kl-sd">${esc(s.d)}</p></div><span class="kl-sc"><b>0</b>/<i>${s.i.length}</i></span></div>
        <ul class="kl-items">
${s.i.map((it, j) => item(id, j, it)).join("\n")}
        </ul>
        <div class="kl-meta"><label class="kl-f"><span>Sorumlu</span><input type="text" data-k="${id}-o" placeholder="Ad veya ekip" autocomplete="off"></label><label class="kl-f"><span>Hedef tarih</span><input type="date" data-k="${id}-d"></label></div>
      </article>`; }).join("\n")}
    </section>`).join("\n");

const nav = PHASES.map((p) => `<li><a href="#${p.id}" data-ph="${p.id}"><span>${p.t}</span><em>0/${p.steps.reduce((b, s) => b + s.i.length, 0)}</em></a></li>`).join("");

const html = `<!--#header-->

<main>
<section class="ab-hero kl-hero" id="top" aria-labelledby="kl-title">
  <div class="wrap">
    <p class="ab-pill"><a href="/" data-go>Commerce Clinic</a><span aria-hidden="true">/</span><a href="/rehber/e-ticaret-altyapi-gecisi" data-go>Ücretsiz rehber</a><span aria-hidden="true">/</span>Kontrol listesi</p>
    <h1 class="display" id="kl-title">E-ticaret altyapısı değiştirirken 12 adımlık rehber</h1>
    <p class="lead">Altyapı değiştiren markalar için; geçiş öncesinden canlıya çıktıktan sonraki ilk 30 güne kadar kontrol listesi. Yıllardır yürüttüğümüz geçişlerde baktığımız her şey burada. Maddeleri işaretleyin, size uymayanları "Bizde yok" ile çıkarın, her adıma sorumlu ve tarih yazın.</p>
    <ul class="kl-facts"><li>12 adım · 3 aşama</li><li>${total} kontrol maddesi</li><li>Hazırlayan: Mahir Erdem</li></ul>
  </div>
</section>

<section class="kl" aria-label="Kontrol listesi">
  <div class="wrap kl-grid">
    <aside class="kl-side">
      <div class="kl-prog" role="group" aria-label="İlerleme">
        <p class="kl-pt"><b id="klPct">%0</b><span id="klCnt">0 / ${total} madde</span></p>
        <div class="kl-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-labelledby="klCnt"><i id="klBar"></i></div>
      </div>
      <ol class="kl-nav">${nav}</ol>
      <div class="kl-acts">
        <button type="button" class="kl-a" id="klPrint"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4.5 6V2h7v4M4.5 11.5H2.5v-5h11v5h-2M4.5 9.5h7V14h-7z"/></svg>Yazdır / PDF kaydet</button>
        <button type="button" class="kl-a" id="klCopy"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6.5 9.5l3-3M7 4.5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L10.7 8.2M9 11.5l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7L5.3 7.8"/></svg>Bağlantıyı kopyala</button>
        <button type="button" class="kl-a kl-a-mute" id="klReset">Sıfırla</button>
      </div>
      <p class="kl-note">İşaretler ve notlar yalnız bu tarayıcıda tutulur; hiçbir yere gönderilmez.</p>
    </aside>

    <div class="kl-main">
${phases}

      <div class="kl-end">
        <p class="kl-end-e">Liste bitti, sıra planda</p>
        <h2 class="kl-end-t">Geçiş planınızı birlikte gözden geçirelim.</h2>
        <p>Bu liste neyin kontrol edileceğini gösterir; hangisinin sizin için kritik olduğunu ise işin kendisi belirler. 30 dakikalık ön görüşmede planınızı birlikte okuyalım.</p>
        <a class="btn btn-primary" href="/gorusme-planla" data-page><svg class="cal" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2"/><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3"/></svg>Görüşme Planla</a>
      </div>
    </div>
  </div>
</section>
</main>
<!--#footer-->

<!--#gp-->
`;

const root = new URL("../../", import.meta.url);
fs.writeFileSync(new URL("content/pages/kontrol-listesi.html", root), html);

// Rehber tanıtım sayfası (/rehber/e-ticaret-altyapi-gecisi): adım listesi ve kapak görselindeki ilk 5 adım
const notesP = new URL("content/pages/rehber-altyapi-gecisi.html", root);
let notes = fs.readFileSync(notesP, "utf8");
let k = 0;
const list = `<div class="gd-list">\n${PHASES.map((p) => `          <p class="gd-ph3">${p.t}</p>
          <ol start="${k + 1}">
${p.steps.map((s) => { k++; return `            <li><b>${esc(s.t)}.</b> ${esc(s.d)}</li>`; }).join("\n")}
          </ol>`).join("\n")}
        </div>`;
notes = notes.replace(/<div class="gd-list">[\s\S]*?<\/ol>\s*<\/div>/, list);
const rows = all.slice(0, 5).map((s) => `        <span class="gd-row"><i></i><span>${esc(s.t)}</span><em>Sorumlu</em></span>`).join("\n");
notes = notes.replace(/(<span class="gd-sec">1 · Geçiş öncesi<\/span>\n)(?:\s*<span class="gd-row">.*\n)+/, `$1${rows}\n`);
fs.writeFileSync(notesP, notes);

console.log("ok", n, "adım", total, "madde,", all.flatMap((s) => s.i).filter(Array.isArray).length, "koşullu ·", ROUTE);
