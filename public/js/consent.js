/* Çerez onayı · minimal bant + tercih penceresi
   - Tercih "cc-consent" çerezinde 6 ay saklanır: "1|a" analitik açık, "1|n" yalnız zorunlu
   - Google Consent Mode v2: varsayılan "reddedildi" layout'ta (app/layout.tsx); burada yalnız güncellenir
   - [data-cc-open] olan her buton tercih penceresini açar (footer: "Çerez tercihleri") */
(function(){
  const NAME='cc-consent',VER='1',MAX=60*60*24*180;
  const get=()=>{const m=document.cookie.match(/(?:^|; )cc-consent=([^;]*)/);return m?decodeURIComponent(m[1]):null};
  const state=()=>{const v=get();return v&&v.split('|')[0]===VER?{analytics:v.split('|')[1]==='a'}:null};
  const dl=window.dataLayer=window.dataLayer||[];
  const gtag=window.gtag||function(){dl.push(arguments)};

  function save(analytics){
    document.cookie=`${NAME}=${VER}|${analytics?'a':'n'}; Max-Age=${MAX}; Path=/; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;
    gtag('consent','update',{analytics_storage:analytics?'granted':'denied'});
    dl.push({event:'cc_consent',analytics});
    if(!analytics)document.cookie.split('; ').map(c=>c.split('=')[0]).filter(n=>/^_ga/.test(n)).forEach(n=>{
      const host=location.hostname.replace(/^www\./,'');
      document.cookie=`${n}=; Max-Age=0; Path=/`;document.cookie=`${n}=; Max-Age=0; Path=/; Domain=.${host}`;
    });
    hideBanner();closeModal();
  }

  /* ---------- bant ---------- */
  let banner;
  function showBanner(){
    banner=document.createElement('div');banner.className='ccb';banner.setAttribute('role','region');banner.setAttribute('aria-label','Çerez tercihi');
    banner.innerHTML='<p>Siteyi geliştirmek için, izin verirseniz analitik çerezler kullanılır. Ayrıntılar <a href="/cerez-politikasi">Çerez Politikası</a>\'nda.</p><div class="ccb-a"><button type="button" class="cc-btn ccb-yes" data-a>Kabul et</button><button type="button" class="cc-btn ccb-no" data-cc-open>Tercihler</button></div><button type="button" class="ccb-x" aria-label="Kapat ve reddet" data-r><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>';
    // çarpı da reddet sayılır (yalnız zorunlu çerezler)
    banner.querySelectorAll('[data-r]').forEach(b=>b.addEventListener('click',()=>save(false)));
    banner.querySelector('[data-a]').addEventListener('click',()=>save(true));
    document.body.appendChild(banner);
    requestAnimationFrame(()=>requestAnimationFrame(()=>banner.classList.add('on')));
  }
  function hideBanner(){if(!banner)return;const b=banner;banner=null;b.classList.remove('on');setTimeout(()=>b.remove(),400)}

  /* ---------- tercih penceresi ---------- */
  let modal,last;
  function openModal(trigger){
    last=trigger||document.activeElement;
    if(!modal){
      modal=document.createElement('div');modal.className='ccm';modal.hidden=true;
      modal.innerHTML='<div class="ccm-bg" data-x></div><div class="ccm-p" role="dialog" aria-modal="true" aria-labelledby="ccm-t" tabindex="-1">'+
        '<button type="button" class="ccm-x" aria-label="Kapat" data-x><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>'+
        '<h2 class="ccm-t" id="ccm-t">Çerez tercihleri</h2><p class="ccm-d">Hangi çerezlerin kullanılacağını seçin. Ayrıntılar <a href="/cerez-politikasi">Çerez Politikası</a>\'nda.</p>'+
        '<div class="ccm-row"><div><b>Zorunlu çerezler</b><span>Sitenin çalışması, güvenliği ve bu tercihin hatırlanması için.</span></div><em class="ccm-on">Her zaman aktif</em></div>'+
        '<label class="ccm-row" for="ccm-an"><div><b>Analitik çerezler</b><span>Hangi sayfaların ne kadar ziyaret edildiğini anonim istatistiklerle ölçmek için (Google Analytics).</span></div><input type="checkbox" id="ccm-an" class="cc-sw" role="switch"></label>'+
        '<div class="ccm-a"><button type="button" class="cc-btn" data-r>Tümünü reddet</button><button type="button" class="cc-btn cc-btn-dark" data-s>Ayarları kaydet</button></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click',e=>{if(e.target.closest('[data-x]'))closeModal()});
      modal.querySelector('[data-r]').addEventListener('click',()=>save(false));
      modal.querySelector('[data-s]').addEventListener('click',()=>save(modal.querySelector('#ccm-an').checked));
      modal.addEventListener('keydown',e=>{
        if(e.key==='Escape'){e.stopPropagation();closeModal()}
        if(e.key==='Tab'){const f=[...modal.querySelectorAll('a[href],button,input')].filter(x=>x.offsetParent);const a=f[0],z=f[f.length-1];
          if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
      });
    }
    const s=state();modal.querySelector('#ccm-an').checked=!!(s&&s.analytics);
    modal.hidden=false;document.documentElement.classList.add('ccm-lock');
    requestAnimationFrame(()=>requestAnimationFrame(()=>modal.classList.add('on')));
    modal.querySelector('.ccm-p').focus({preventScroll:true});
  }
  function closeModal(){
    if(!modal||modal.hidden)return;
    modal.classList.remove('on');document.documentElement.classList.remove('ccm-lock');
    setTimeout(()=>{if(!modal.classList.contains('on'))modal.hidden=true},300);
    if(last&&last.focus&&document.contains(last))last.focus({preventScroll:true});
  }

  document.addEventListener('click',e=>{const b=e.target.closest('[data-cc-open]');if(b){e.preventDefault();openModal(b)}});
  // ?cerez-bandi: tercih kayıtlı olsa da bandı göster (gözden geçirme için)
  if(!state()||/[?&]cerez-bandi\b/.test(location.search)){
    const go=()=>setTimeout(showBanner,700);
    document.readyState==='complete'?go():addEventListener('load',go,{once:true});
  }
})();
