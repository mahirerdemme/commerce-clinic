
;

document.documentElement.classList.add('js');(function(){var w=document.querySelector('.ab-why');if(!w)return;if(!('IntersectionObserver' in window)){w.classList.add('in');return}new IntersectionObserver(function(e){e.forEach(function(x){w.classList.toggle('in',x.isIntersecting)})},{threshold:.6}).observe(w)})();(function(){var f=document.querySelector('.why-f');if(!f)return;if(!('IntersectionObserver' in window)){f.classList.add('in');return}new IntersectionObserver(function(e,o){e.forEach(function(x){if(x.isIntersecting){setTimeout(function(){f.classList.add('in')},150);o.disconnect()}})},{threshold:.35}).observe(f)})();
(function(){
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const header=$('.header');
  function hdr(){
    header.classList.toggle('scrolled',scrollY>40);
    const y=header.querySelector('.bar').getBoundingClientRect(),mid=y.top+y.height/2;
    header.classList.toggle('theme-dark',$$('.chapter').some(c=>{const r=c.getBoundingClientRect();return r.top<=mid&&r.bottom>=mid}));
  }
  addEventListener('scroll',hdr,{passive:true});hdr();
  // mobil menü
  const mb=$('.menu-btn');
  mb.addEventListener('click',()=>{const o=document.body.classList.toggle('menu-open');mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Menüyü kapat':'Menüyü aç')});
  $$('.nav a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('menu-open');mb.setAttribute('aria-expanded',false)}));
  // taslak işaretleri
  const ft=$('#flagToggle');
  ft.addEventListener('click',()=>{const h=document.body.classList.toggle('hide-flags');ft.setAttribute('aria-pressed',h);ft.textContent=h?'Taslak işaretlerini göster':'Taslak işaretlerini gizle'});
  // sekmeler (8 alan + rapor)
  function tabs(sel){
    const t=$$(sel+' [role=tab]');
    const act=b=>t.forEach(x=>{const on=x===b;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on});
    t.forEach((b,i)=>{b.addEventListener('click',()=>act(b));b.addEventListener('keydown',e=>{let n=null;if(e.key==='ArrowDown'||e.key==='ArrowRight')n=t[(i+1)%t.length];if(e.key==='ArrowUp'||e.key==='ArrowLeft')n=t[(i-1+t.length)%t.length];if(n){e.preventDefault();act(n);n.focus()}})});
  }
  tabs('.al-t');tabs('.rpt-t');
  // yaklaşım: vurgular sırayla dolar
  const apS=$('.appr'),apF=$$('.appr .f');
  if(apS&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const fill=()=>{const r=apS.getBoundingClientRect(),vh=innerHeight;const p=Math.min(1,Math.max(0,(vh*.8-r.top)/(r.height*.9)));const n=apF.length;
      apF.forEach((el,i)=>{const q=Math.min(1,Math.max(0,p*n-i));el.style.setProperty('--p',(q*100).toFixed(1)+'%')})};
    addEventListener('scroll',fill,{passive:true});addEventListener('resize',fill);fill();
  }
  // prototip yardımcıları
  const toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.appendChild(toast);let tt;
  const say=m=>{toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),2600)};
  $$('a[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();say('Bu sayfa yakında yayında.')}));
  const nf=$('#notesForm');if(nf)nf.addEventListener('submit',e=>{e.preventDefault();const v=$('#nEmail');if(!v.checkValidity()){v.focus();say('Geçerli bir e-posta adresi girin.');return}say('Teşekkürler. Bülten kaydı çok yakında aktif olacak.');v.value=''});
})();

(function(){
  // sayfa geçişi: header sabit, içerik çapraz geçişle (Sendr gibi)
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!RM){document.body.classList.add('pg-in');setTimeout(()=>document.body.classList.remove('pg-in'),600)}
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[data-go]');if(!a)return;
    e.preventDefault();const url=a.href;
    if(RM){location.href=url;return}
    document.body.classList.add('pg-out');
    setTimeout(()=>{location.href=url;document.body.classList.remove('pg-out');document.body.classList.add('pg-in');setTimeout(()=>document.body.classList.remove('pg-in'),600)},260);
  });
})();


;

(function(){
  const L=document.getElementById('liste');
  const VIEWS={
    'platform-gecisi':{el:document.getElementById('platform-gecisi'),sec:/^s[1-7]$/,title:'Platform Değiştirmeden Önce Sorulması Gereken 7 Soru | Commerce Notes',desc:'E-ticaret platformu değiştirmeden önce netleşmesi gereken 7 soru: veri, entegrasyon, arama görünürlüğü, ekip, zamanlama ve başarı ölçütleri.'},
    'altyapi-kontrol-listesi':{el:document.getElementById('altyapi-kontrol-listesi'),sec:/^(g[1-4]|rehber-indir|tesekkurler-altyapi-kontrol-listesi)$/,title:'Altyapı Değiştirirken 12 Adımlık Kontrol Listesi (PDF) | Commerce Notes',desc:'E-ticaret altyapısı değiştirirken geçiş öncesi, sırası ve sonrası için 12 adımlık ücretsiz kontrol listesi. Veri, entegrasyon, SEO ve ekip için PDF.'}
  };
  const baseT=document.title,md=document.querySelector('meta[name="description"]'),baseD=md&&md.content,can=document.querySelector('link[rel="canonical"]'),baseC=can&&can.href;
  function route(){
    const h=location.hash.slice(1);let cur=null;
    for(const k in VIEWS){if(h===k||VIEWS[k].sec.test(h))cur=k}
    L.hidden=!!cur;for(const k in VIEWS)VIEWS[k].el.hidden=k!==cur;
    document.title=cur?VIEWS[cur].title:baseT;
    if(md)md.content=cur?VIEWS[cur].desc:baseD;
    if(can)can.href=cur?'https://thecommerceclinic.com/commerce-notes/'+cur:baseC;
    if(!h||h===cur||h==='liste')window.scrollTo(0,0);
    if(h==='rehber-indir')openRP(true);
  }
  addEventListener('hashchange',route);route();
  // filtre
  const tabs=[...document.querySelectorAll('.cn-filter button')],rows=[...document.querySelectorAll('.cn-row')];
  tabs.forEach(b=>b.addEventListener('click',()=>{
    tabs.forEach(t=>t.setAttribute('aria-selected',t===b));
    const f=b.dataset.f;let n=0;
    rows.forEach(r=>{const on=f==='all'||r.dataset.cat.split(' ').includes(f);r.hidden=!on;if(on)n++});
    document.getElementById('cnEmpty').hidden=n>0;
  }));
  const say=m=>{const t=document.querySelector('.toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>t.classList.remove('show'),2600)};
  document.querySelectorAll('[data-soon]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();say('Bu yazı çok yakında yayında.')}));
  const f=document.getElementById('cnSub');f&&f.addEventListener('submit',e=>{e.preventDefault();const i=document.getElementById('cn-email');if(!i.value||!i.checkValidity()){i.focus();say('Geçerli bir e-posta adresi girin.');return}say('Teşekkürler. Bülten kaydı çok yakında aktif olacak.');i.value=''});
  // rehber indirme popup'ı
  function openRP(fromHash){
    const p=document.getElementById('rp');if(!p||!p.hidden)return;
    p.hidden=false;document.body.classList.add('gp-open');requestAnimationFrame(()=>p.classList.add('on'));
    document.getElementById('rp-form').hidden=false;document.getElementById('rp-done').hidden=true;
    if(!fromHash){try{history.pushState(null,'',location.pathname+location.search+'#rehber-indir')}catch(_){}}
    (window.dataLayer=window.dataLayer||[]).push({event:'resource_open',resource:'altyapi-kontrol-listesi'});
    setTimeout(()=>document.getElementById('rp-name').focus(),80);
  }
  function closeRP(keepHash){
    const p=document.getElementById('rp');if(!p||p.hidden)return;
    p.classList.remove('on');document.body.classList.remove('gp-open');
    setTimeout(()=>{p.hidden=true},480);
    if(!keepHash){try{history.replaceState(null,'',location.pathname+location.search+'#altyapi-kontrol-listesi')}catch(_){}}
  }
  window.openRP=openRP;
  document.addEventListener('click',e=>{const a=e.target.closest('[data-rp]');if(a){e.preventDefault();openRP(false)}});
  const rpEl=document.getElementById('rp');
  if(rpEl){
    rpEl.querySelector('.gp-x').addEventListener('click',()=>closeRP());
    document.getElementById('rp-close2').addEventListener('click',()=>closeRP());
    rpEl.querySelector('.rp-gp').addEventListener('click',()=>closeRP(true),true);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!rpEl.hidden)closeRP()});
    rpEl.addEventListener('click',e=>{if(e.target===rpEl)closeRP()});
    const f=document.getElementById('rp-form');
    f.addEventListener('input',e=>e.target.classList&&e.target.classList.remove('is-err'));
    f.addEventListener('submit',e=>{
      e.preventDefault();
      const n=document.getElementById('rp-name'),em=document.getElementById('rp-email'),k=document.getElementById('rp-kvkk');
      let ok=true;
      [n,em].forEach(x=>{const bad=!x.value.trim()||(x.type==='email'&&!x.checkValidity());x.classList.toggle('is-err',bad);if(bad)ok=false});
      document.getElementById('rp-kvkk-l').classList.toggle('is-err',!k.checked);if(!k.checked)ok=false;
      document.getElementById('rp-err').hidden=ok;if(!ok)return;
      f.hidden=true;const d=document.getElementById('rp-done');d.hidden=false;
      try{history.replaceState(null,'',location.pathname+location.search+'#tesekkurler-altyapi-kontrol-listesi')}catch(_){}
      (window.dataLayer=window.dataLayer||[]).push({event:'generate_lead',lead_type:'resource',resource:'altyapi-kontrol-listesi',newsletter:document.getElementById('rp-news').checked});
      d.focus();
    });
  }
  // içindekiler
  const heads=[...document.querySelectorAll('.cn-text h2[id]')],links=[...document.querySelectorAll('.cn-toc a')];
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{es.forEach(x=>{if(x.isIntersecting){links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+x.target.id))}})},{rootMargin:'-20% 0px -70% 0px'});heads.forEach(h=>io.observe(h))}
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
    document.body.classList.remove('menu-open');
    gp.hidden=false;document.body.classList.add('gp-open');
    requestAnimationFrame(()=>gp.classList.add('on'));
    setStep(1);
    if(!fromHash){try{history.pushState({gp:1},'',base+'#gorusme-planla')}catch(e){location.hash='gorusme-planla'}}
    dl.push({event:'gp_open',page:'commerce-notes'});
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
    const k=$('#gp-kvkk');$('.gp-kvkk').classList.toggle('is-err',!k.checked);if(!k.checked)ok=false;
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
