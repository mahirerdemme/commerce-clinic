
;

(function(){
  const root=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('ready')));
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

  // ===== HEADER: compact + dark chapter =====
  const header=$('.header');
  function hdr(){
    header.classList.toggle('scrolled',scrollY>40);
    const y=header.querySelector('.bar').getBoundingClientRect();const mid=y.top+y.height/2;
    const dark=$$('.chapter').some(c=>{const r=c.getBoundingClientRect();return r.top<=mid&&r.bottom>=mid});
    header.classList.toggle('theme-dark',dark);
  }

  // ===== ECOSYSTEM STACK: depth + tone per active card =====
  const eco=$('#ekosistem'),cards=$$('.scard'),ecoHead=$('#ecoHead');
  const TONES={a:['#0C0C0B','#151412','#19141C','#10151A','#1A1510','#16141D','#0F1613'],
               b:['#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF']};
  function setEh(){eco.style.setProperty('--eh',ecoHead.offsetHeight+'px')}
  setEh();document.fonts&&document.fonts.ready.then(setEh);addEventListener('resize',setEh);
  function paintCards(){const v=eco.dataset.v;cards.forEach((c,k)=>c.style.setProperty('--card-bg',v==='b'?TONES.b[k]:''))}
  function stack(){
    // bölüm ekranda değilken kartları ölçme (her scroll karesinde 7 kart için yerleşim okuyordu)
    const er=eco.getBoundingClientRect();if(er.bottom<0||er.top>innerHeight)return;
    const desk=innerWidth>860,rs=cards.map(c=>c.getBoundingClientRect());
    let active=0;
    cards.forEach((c,k)=>{
      const stickTop=parseFloat(getComputedStyle(c).top)||0;
      if(rs[k].top<=stickTop+4)active=k;
      if(!desk||RM){c.style.transform='';c.style.filter='';return}
      let d=0;const H=rs[k].height||1;
      for(let j=k+1;j<cards.length;j++){d+=Math.min(1,Math.max(0,(rs[k].top+H-rs[j].top)/H))}
      c.style.transform=d?`scale(${(1-Math.min(d,4)*.03).toFixed(4)})`:'';
      c.style.filter=d?`brightness(${(1-Math.min(d,4)*(eco.dataset.v==='a'?.12:.025)).toFixed(4)})`:'';
    });
    // başlık, son kart serbest kaldığında onunla birlikte ayrılsın
    const last=cards[cards.length-1],lt=parseFloat(getComputedStyle(last).top)||0,dl=rs[rs.length-1].top-lt;
    ecoHead.style.transform=(desk&&dl<0&&rs[rs.length-1].top<innerHeight)?`translateY(${dl}px)`:'';
  }
  paintCards();
  // sistem isimleri: hover / dokunma
  $$('.sys').forEach(s=>{const b=s.querySelector('.avs');s.querySelector('.sys-more').addEventListener('click',()=>b.click());
    b.addEventListener('click',()=>{const o=!s.classList.contains('open');$$('.sys.open').forEach(x=>{x.classList.remove('open');x.querySelector('.avs').setAttribute('aria-expanded','false')});s.classList.toggle('open',o);b.setAttribute('aria-expanded',o)});
  });
  let tick=false;
  function onScroll(){if(tick)return;tick=true;requestAnimationFrame(()=>{hdr();stack();tick=false})}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();

  // ===== EKRAN DIŞI ANİMASYONLAR: görünmeyen bölümlerdeki sonsuz animasyonlar durur (styles/home.css · anim-off) =====
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('anim-off',!e.isIntersecting)),{rootMargin:'200px 0px'});
    $$('.topbar,main section,footer').forEach(el=>io.observe(el));
  }

  // ===== CONSULTING OBJECT =====
  // Eski sprite döngüsü kaldırıldı: obje artık tek sabit görsel (styles/home.css · 0f889b9fd806.webp) + CSS süzülme (coFloat).
  // Döngü her karede stil yazıyor ve süzülmeyen ikinci katmanı yarı saydam gösterip gölge kopya oluşturuyordu.

  // ===== MOBILE MENU =====
  const mb=$('.menu-btn');
  // açılış/kapanışta header geçişsiz değişir (menu-snap), açıkken sayfa kilitlenir (menu-lock)
  function setMenu(o){
    const b=document.body;if(b.classList.contains('menu-open')===o)return;
    b.classList.add('menu-snap');b.classList.toggle('menu-open',o);document.documentElement.classList.toggle('menu-lock',o);
    requestAnimationFrame(()=>requestAnimationFrame(()=>b.classList.remove('menu-snap')));
    mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Menüyü kapat':'Menüyü aç');
  }
  mb.addEventListener('click',()=>setMenu(!document.body.classList.contains('menu-open')));
  $$('.nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
  matchMedia('(min-width:861px)').addEventListener('change',e=>{if(e.matches)setMenu(false)});

  // ===== DRAFT FLAGS =====
  const ft=$('#flagToggle');
  ft.addEventListener('click',()=>{const h=document.body.classList.toggle('hide-flags');ft.setAttribute('aria-pressed',h);ft.textContent=h?'Taslak işaretlerini göster':'Taslak işaretlerini gizle'});

  // ===== HEALTH DATA (hero + report) =====
  const areas=[['Business & Positioning',61],['Market & Competition',72],['UX & Conversion',38],['Merchandising & Content',58],['Technology & Data',42],['Post-Purchase & Retention',49],['Acquisition & Marketing',70],['Organization & Growth',56]];
  const st=v=>v<45?'bad':v<65?'warn':'ok';
  const bench=64;
  // hero ekranı: Clinic Report v32 — Genel bakış / Commerce Health Overview (örnek veri, rapordaki ile aynı)
  const RA=[['Business & Positioning',61,1],['Market & Competition',72,1],['UX & Conversion',38,3],['Merchandising & Content',58,1],['Technology & Data',42,2],['Post-Purchase & Retention',49,2],['Acquisition & Marketing',70,1],['Organization & Growth Readiness',56,1]];
  const gauge=(v,w,sw,fs)=>{const r=(w-sw)/2,cx=w/2,cy=r+sw/2,h=cy+sw/2+4,pt=t=>{const a=Math.PI*(1-t);return[cx+r*Math.cos(a),cy-r*Math.sin(a)]},[x0,y0]=pt(0),[x1,y1]=pt(1),[xs,ys]=pt(v/100),c=st(v);
    return `<svg class="rs-gauge" viewBox="-4 -4 ${w+8} ${h+4}"><path class="trk" stroke-width="${sw}" d="M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}"/><path class="val ${c}" stroke-width="${sw}" d="M${x0} ${y0}A${r} ${r} 0 0 1 ${xs.toFixed(2)} ${ys.toFixed(2)}"/><text class="${c}" x="${cx}" y="${cy-2}" font-size="${fs}">${v}</text></svg>`};
  const SYM='<svg viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M224 128A96 96 0 0 1 59.78 195.55L93.89 161.77A48 48 0 0 0 176 128ZM32 127.99A96 96 0 0 1 196.22 60.46L162.11 94.23A48 48 0 0 0 80 128Z"/></svg>';
  $('#lapScreen').innerHTML=`<div class="rs-top">${SYM}<b>Commerce Clinic</b><span class="sep"></span><span class="rp">Commerce Check-up raporu</span><span class="sh"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 10V2M5 5l3-3 3 3M3 9v4h10V9"/></svg>Paylaş</span><span class="av" style="color:#fff">${SYM}</span></div>
  <div class="rs-body"><div class="rs-rail">
    <div class="rs-g on"><p class="rs-gh"><i>1</i><b>Durum</b><small>genel tablo</small></p><ul><li class="on"><span class="t">Genel bakış</span></li></ul></div>
    <div class="rs-g"><p class="rs-gh"><i>2</i><b>Teşhis</b><small>8 alan</small></p><ul>${RA.map(([n,v])=>`<li><span class="rs-d ${st(v)}"></span><span class="t">${n}</span><span class="s">${v}</span></li>`).join('')}</ul></div>
    <div class="rs-g"><p class="rs-gh"><i>3</i><b>Plan</b><small>ne yapmalı, hangi sırayla</small></p><ul><li><span class="t">90-Day Growth Roadmap</span></li><li><span class="t">Priority Action Plan</span></li><li><span class="t">İlerleme takibi</span></li></ul></div>
  </div><div class="rs-main">
    <p class="rs-h"><b>Commerce Health Overview</b><small>Check-up tarihindeki durum · 24 Eylül 2026</small></p>
    <div class="rs-card"><div class="rs-hm">${gauge(57,300,26,68)}<div><h4>Commerce Health Score: gelişmeli</h4><p>Sekiz alanın ticari etkisine göre ağırlıklandırılmış ortalaması.</p><div class="rs-keys"><span><i class="rs-d bad"></i>0–44 öncelikli</span><span><i class="rs-d warn"></i>45–64 gelişmeli</span><span><i class="rs-d ok"></i>65–100 sağlıklı</span></div></div></div>
    <div class="rs-gg">${RA.map(([n,v,f])=>`<div>${gauge(v,160,14,34)}<b>${n}</b><small>${f} bulgu</small></div>`).join('')}</div></div>
  </div></div>`;
  $('#spBig').innerHTML=gauge(57,300,26,68);
  $('#spGG').innerHTML=RA.map(([n,v])=>`<li>${gauge(v,160,14,34)}${n}</li>`).join('');

  // ===== PROBLEM SYSTEM MAP =====
  const A=[['brand','Brand'],['product','Product'],['pricing','Pricing'],['marketing','Marketing'],['ux','UX'],['checkout','Checkout'],['tech','Technology'],['ops','Operations'],['crm','CRM'],['market','Marketplace']];
  const P=[
    {t:'Dönüşüm düşük',q:'Sorun ödeme adımında görünür; kaynağı çoğu zaman trafik kalitesinde, üründe veya fiyat algısındadır.',rel:['marketing','product','pricing','ux','checkout','tech','ops']},
    {t:'Sepet terk oranı yüksek',q:'Terk sepette görünür; nedeni çoğu zaman kargo maliyeti, ödeme seçenekleri ya da güven eksikliğidir.',rel:['checkout','pricing','ux','tech','ops','crm']},
    {t:'Tekrar satın alma düşük',q:'Müşteri bir kez alıp gidiyorsa sebep ürün deneyiminde, teslimatta veya sipariş sonrası iletişimde olabilir.',rel:['crm','ops','product','brand','pricing']},
    {t:'Reklamlar verimsiz',q:'Maliyet reklam panelinde görünür; asıl mesele hedefleme, marka algısı, sayfa deneyimi veya ölçümleme olabilir.',rel:['marketing','brand','ux','product','tech']},
    {t:'Operasyon yavaş',q:'Gecikme depoda görünür; kaynağı entegrasyonlar, stok yönetimi veya kanal karmaşası olabilir.',rel:['ops','tech','market','crm','product']}
  ];
  const map=$('#map'),svg=map.querySelector('svg'),NS='http://www.w3.org/2000/svg',pos={};
  const RR=innerWidth<640?44:41;
  A.forEach(([id],k)=>{const a=-Math.PI/2+k*2*Math.PI/A.length;pos[id]=[50+RR*Math.cos(a),50+RR*Math.sin(a)]});
  const mk=(a,b,cls)=>{const l=document.createElementNS(NS,'line');l.setAttribute('x1',a[0]);l.setAttribute('y1',a[1]);l.setAttribute('x2',b[0]);l.setAttribute('y2',b[1]);l.setAttribute('vector-effect','non-scaling-stroke');if(cls)l.setAttribute('class',cls);svg.appendChild(l);return l};
  const spokes={};A.forEach(([id])=>spokes[id]=mk(pos[id],[50,50]));
  const webs=[];for(let x=0;x<A.length;x++)for(let y=x+1;y<A.length;y++){const a=A[x][0],b=A[y][0];webs.push({a,b,el:mk(pos[a],pos[b],'web')})}
  const aEls={};A.forEach(([id,n])=>{const d=document.createElement('span');d.className='area';d.textContent=n;d.style.left=pos[id][0]+'%';d.style.top=pos[id][1]+'%';map.appendChild(d);aEls[id]=d});
  const pbT=$('#pbTabs'),pbB=[];
  P.forEach((pr,k)=>{const b=document.createElement('button');b.type='button';b.textContent=pr.t;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{sel(k);b.scrollIntoView({inline:'nearest',block:'nearest',behavior:'smooth'})});pbT.appendChild(b);pbB.push(b)});
  const panel=$('#panel'),nm=id=>A.find(a=>a[0]===id)[1];
  function sel(k){
    const pr=P[k];
    pbB.forEach((b,i)=>b.setAttribute('aria-pressed',i===k));
    Object.entries(aEls).forEach(([id,e])=>e.classList.toggle('on',pr.rel.includes(id)));
    Object.entries(spokes).forEach(([id,l])=>l.classList.toggle('on',pr.rel.includes(id)));
    const ord=A.map(a=>a[0]).filter(id=>pr.rel.includes(id)),ring=new Set(ord.map((id,i)=>id+'|'+ord[(i+1)%ord.length]));
    webs.forEach(w=>w.el.classList.toggle('on',ring.has(w.a+'|'+w.b)||ring.has(w.b+'|'+w.a)));
    panel.style.opacity=0;
    setTimeout(()=>{$('#p-t').textContent=pr.t;$('#p-q').textContent=pr.q;$('#p-rel').innerHTML=pr.rel.map(r=>'<span>'+nm(r)+'</span>').join('');panel.style.opacity=1},RM?0:160);
  }
  sel(0);

  // ===== ROLLING DIGITS =====
  const rolls=$$('.roll');
  if(!RM&&'IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){rolls.forEach((r,i)=>setTimeout(()=>r.classList.add('go'),i*100));io.disconnect()}})},{threshold:.5});
    io.observe($('#stats'));
  }

  // ===== CHECK-UP OUTPUT TABS =====
  const tabs=$$('.steps [role=tab]');
  function act(t){tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on})}
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>act(t));t.addEventListener('keydown',e=>{let n=null;if(e.key==='ArrowDown'||e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];if(e.key==='ArrowUp'||e.key==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];if(n){e.preventDefault();act(n);n.focus()}})});

  // ===== PROTOTYPE HELPERS =====
  const toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);let tt;
  const say=m=>{toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),2600)};
  $$('a[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();say('Bu sayfa yakında yayında.')}));
  $('#notesForm').addEventListener('submit',e=>{e.preventDefault();const v=$('#nEmail');if(!v.checkValidity()){v.focus();say('Geçerli bir e-posta adresi girin.');return}const nc=$('#nConsent');$('#nConsent-l').classList.toggle('is-err',!nc.checked);if(!nc.checked){nc.focus();say('Bülten için ticari ileti onay kutusunu işaretleyin.');return}say('Teşekkürler. Bülten kaydı çok yakında aktif olacak.');v.value=''});
})();

;

(function(){
  // sayfa geçişi: header sabit, içerik çapraz geçişle (Sendr gibi)
  // Cross-document View Transitions destekleniyorsa geçişi tarayıcı yapar (styles/<sayfa>.css · @view-transition)
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches, VT='PageRevealEvent' in window;
  if(!RM&&!VT){document.body.classList.add('pg-in');setTimeout(()=>document.body.classList.remove('pg-in'),600)}
  document.addEventListener('click',e=>{
    if(VT||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const a=e.target.closest('a[data-go]');if(!a)return;
    e.preventDefault();const url=a.href;
    if(RM){location.href=url;return}
    document.body.classList.add('pg-out');
    setTimeout(()=>{location.href=url;document.body.classList.remove('pg-out');document.body.classList.add('pg-in');setTimeout(()=>document.body.classList.remove('pg-in'),600)},260);
  });
})();

;

/* Görüşme Planla · tam ekran talep formu
   Prototip: açılınca adres #gorusme-planla, gönderince #tesekkurler olur.
   Canlıda (Next.js): /gorusme-planla ve /gorusme-planla/tesekkurler route'ları; UTM'ler gizli alanlara yazılır, GA4 page_view + generate_lead. */
(function(){
  const gp=document.getElementById('gp');if(!gp)return;
  const $=s=>gp.querySelector(s),$$=s=>[...gp.querySelectorAll(s)];
  const form=$('#gp-form'),s1=$('[data-s="1"]'),s2=$('[data-s="2"]'),done=$('#gp-done');
  const dl=window.dataLayer=window.dataLayer||[];
  let lastFocus=null;
  const base=location.pathname+location.search;

  // UTM: sayfa adresinden gizli alanlara
  try{const q=new URLSearchParams(location.search);['utm_source','utm_medium','utm_campaign'].forEach(k=>{const el=$('#gp-'+k.replace('_','-'));if(el&&q.get(k))el.value=q.get(k)})}catch(e){}

  function setStep(n){
    gp.dataset.step=n;
    s1.hidden=n!==1; s2.hidden=n!==2; form.hidden=n==='done'; done.hidden=n!=='done';
    $('#gp-steplabel').textContent=n===2?'Adım 2 / 2':'Adım 1 / 2';
    $('.gp-r').scrollTop=0;
  }
  function open(fromHash){
    if(!gp.hidden)return;
    lastFocus=document.activeElement;
    document.body.classList.remove('menu-open');document.documentElement.classList.remove('menu-lock');
    const mbt=document.querySelector('.menu-btn');if(mbt){mbt.setAttribute('aria-expanded',false);mbt.setAttribute('aria-label','Menüyü aç')}
    gp.hidden=false;document.body.classList.add('gp-open');
    requestAnimationFrame(()=>gp.classList.add('on'));
    setStep(1);
    if(!fromHash){try{history.pushState({gp:1},'',base+'#gorusme-planla')}catch(e){location.hash='gorusme-planla'}}
    dl.push({event:'gp_open',page:'home'});
    setTimeout(()=>{const f=$('input[name="interest"]:checked')||$('#gp-i1');f&&f.focus()},60);
  }
  function close(){
    if(gp.hidden)return;
    gp.classList.remove('on');document.body.classList.remove('gp-open');
    setTimeout(()=>{gp.hidden=true;if(gp.dataset.step==='done'){form.reset();$('#gp-topics').hidden=true;$('#gp-phone-w').hidden=true}},480);
    try{history.replaceState(null,'',base)}catch(e){}
    lastFocus&&lastFocus.focus&&lastFocus.focus();
  }

  // tüm "Görüşme Planla" bağlantıları popup'ı açar
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href="/gorusme-planla"]');if(!a)return;
    e.preventDefault();e.stopPropagation();open(false);
  },true);
  $('.gp-x').addEventListener('click',close);
  $('#gp-close2').addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!gp.hidden)close()});
  addEventListener('popstate',()=>{if(!/gorusme-planla|tesekkurler/.test(location.hash))close()});
  if(/^#(gorusme-planla|tesekkurler)$/.test(location.hash))open(true);

  // adım 1
  $$('input[name="interest"]').forEach(r=>r.addEventListener('change',()=>{
    $('#gp-topics').hidden=r.value!=='Danışmanlık'||!r.checked;$('#gp-err1').hidden=true;
  }));
  $('#gp-next').addEventListener('click',()=>{
    if(!$('input[name="interest"]:checked')){$('#gp-err1').hidden=false;return}
    setStep(2);setTimeout(()=>$('#gp-name').focus(),60);
  });
  $('#gp-back').addEventListener('click',()=>setStep(1));

  // adım 2
  $$('input[name="channel"]').forEach(r=>r.addEventListener('change',()=>{
    const tel=$('#gp-c2').checked;$('#gp-phone-w').hidden=!tel;$('#gp-phone').required=tel;
  }));
  form.addEventListener('input',e=>{e.target.classList&&e.target.classList.remove('is-err')});
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const req=[$('#gp-name'),$('#gp-email'),$('#gp-site')];
    if($('#gp-c2').checked)req.push($('#gp-phone'));
    let ok=true;
    req.forEach(el=>{const v=el.value.trim();const bad=!v||(el.type==='email'&&!el.checkValidity());el.classList.toggle('is-err',bad);if(bad)ok=false});
    
    $('#gp-err2').hidden=ok;
    if(!ok){const f=form.querySelector('.is-err')||k;f.focus();return}

    const interest=$('input[name="interest"]:checked').value;
    const topics=$$('input[name="topics"]:checked').map(x=>x.value);
    const ch=$('input[name="channel"]:checked').value;
    const rows=[['İlgi alanı',interest]];
    if(topics.length)rows.push(['Konular',topics.join(', ')]);
    rows.push(['Marka / site',$('#gp-site').value.trim()],['Dönüş',ch==='Telefon'?'Telefon · '+$('#gp-phone').value.trim():'E-posta · '+$('#gp-email').value.trim()]);
    const sum=$('#gp-sum');sum.innerHTML='';
    rows.forEach(([t,d])=>{const w=document.createElement('div');const a=document.createElement('dt');a.textContent=t;const b=document.createElement('dd');b.textContent=d;w.append(a,b);sum.append(w)});
    $('#gp-done-t').textContent=ch==='Telefon'?'1 iş günü içinde sizi arayarak dönüş yapılacak.':'1 iş günü içinde e-posta ile dönüş yapılacak.';
    setStep('done');
    try{history.replaceState({gp:2},'',base+'#tesekkurler')}catch(e){location.hash='tesekkurler'}
    dl.push({event:'generate_lead',interest:interest,channel:ch});
    setTimeout(()=>done.focus(),60);
  });
})();

;
/*lg-js*/
(()=>{const ul=document.querySelector('.logos');if(!ul)return;
let pool=JSON.parse(document.getElementById('lg-pool').textContent);if(!pool.length)return;
const cells=[...ul.querySelectorAll('.lg')],recent=[];let vis=false,t;
new IntersectionObserver(e=>{vis=e[0].isIntersecting},{threshold:.2}).observe(ul);
const read=el=>({n:el.getAttribute('aria-label'),w:el.style.getPropertyValue('--w'),h:el.style.getPropertyValue('--h'),m:el.style.getPropertyValue('--m')});
const write=(el,d)=>{el.setAttribute('aria-label',d.n);el.style.setProperty('--w',d.w);el.style.setProperty('--h',d.h);el.style.setProperty('--m',d.m)};
const tick=()=>{if(vis&&!document.hidden){
  const c=cells.filter(el=>el.offsetParent&&!recent.includes(el));if(c.length){
  const el=c[Math.floor(Math.random()*c.length)];recent.push(el);if(recent.length>4)recent.shift();
  const pi=Math.floor(Math.random()*pool.length),pd=pool[pi];pool[pi]=read(el);
  const nw=el.cloneNode();nw.classList.add('out','in');write(nw,pd);el.after(nw);
  cells[cells.indexOf(el)]=nw;recent[recent.length-1]=nw;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{el.classList.add('out');nw.classList.remove('out')}));
  setTimeout(()=>{el.remove();nw.classList.remove('in')},1200);}}
  t=setTimeout(tick,2800)};
t=setTimeout(tick,1800);})();

;
/*mo-js*/
(function(){var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,SR=true;
var h=document.querySelector('h1');
if(h&&!h.closest('.hero')&&!RM){
  var i=0,tw=document.createTreeWalker(h,NodeFilter.SHOW_TEXT),ns=[],n;while(n=tw.nextNode())ns.push(n);
  ns.forEach(function(t){var f=document.createDocumentFragment();t.nodeValue.split(/(\s+)/).forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p));return}
    var w=document.createElement('span');w.className='mw';w.style.setProperty('--i',i++);var s=document.createElement('span');s.textContent=p;w.appendChild(s);f.appendChild(w)});t.parentNode.replaceChild(f,t)});
  h.classList.add('mo-h');
  var k=0;[].forEach.call(h.parentNode.children,function(c){if(c===h||/^(SCRIPT|STYLE)$/.test(c.tagName))return;c.classList.add('hf');c.style.setProperty('--d',(0.35+0.1*k++)+'s');});
  requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('mo-go');[].forEach.call(h.parentNode.querySelectorAll(':scope>.hf'),function(c){c.classList.add('mo-go')})})});
}
if(!SR||RM||!('IntersectionObserver' in window))return;
var vh=innerHeight,items=[];
[].forEach.call(document.querySelectorAll('section'),function(sec){
  if(sec.contains(h)||sec.closest('.hero')||/cta-final|ab-why|hero/.test(sec.className))return;
  var c=sec.querySelector(':scope>.wrap')||sec;while(c.children.length===1&&c.firstElementChild.tagName!=='UL'&&!/^(H1|H2|H3|P)$/.test(c.firstElementChild.tagName))c=c.firstElementChild;
  [].forEach.call(c.children,function(ch){
    if(/^(SCRIPT|STYLE)$/.test(ch.tagName)||/sg-l|sg-r|flag/.test(ch.className))return;
    var cs=getComputedStyle(ch);if(cs.position==='absolute'||cs.position==='fixed'||cs.position==='sticky')return;
    var kids=[].filter.call(ch.children,function(x){return !/^(SCRIPT|STYLE)$/.test(x.tagName)});
    if((cs.display==='grid'||/^(UL|OL)$/.test(ch.tagName))&&kids.length>=2&&kids.length<=9)kids.forEach(function(x,j){items.push([x,j])});else items.push([ch,0]);
  })});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);el.style.setProperty('--d',Math.min(el.__j,4)*0.07+'s');el.classList.add('on');setTimeout(function(){el.classList.remove('sr','on');el.style.removeProperty('--d')},1400)})},{rootMargin:'0px 0px -9% 0px'});
items.forEach(function(p){var el=p[0];if(el.getBoundingClientRect().top<vh*0.95)return;el.__j=p[1];el.classList.add('sr');io.observe(el)});
var pend=[].slice.call(document.querySelectorAll('.sr')),tk=0;
addEventListener('scroll',function(){if(tk)return;tk=requestAnimationFrame(function(){tk=0;pend=pend.filter(function(el){if(!el.classList.contains('sr'))return false;if(el.getBoundingClientRect().bottom<0){io.unobserve(el);el.classList.remove('sr');return false}return true})})},{passive:true});
})();
