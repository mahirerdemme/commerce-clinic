/* Yasal metinler · sağdan açılan panel
   Site içindeki /kvkk, /gizlilik, /cerez-politikasi, /ticari-ileti linkleri sayfadan ayrılmadan panelde açılır.
   Metinler public/legal/<slug>.html'den gelir; doğrudan açılan adres aynı metni sayfa olarak gösterir (lib/legal.tsx). */
(function(){
  if(document.querySelector('.legal-page'))return; // yasal sayfanın kendisinde linkler normal çalışır
  const DOCS=['/kvkk','/gizlilik','/cerez-politikasi','/ticari-ileti'];
  const cache={};let root,panel,body,title,full,last=null;
  const load=p=>cache[p]||(cache[p]=fetch('/legal'+p+'.html').then(r=>{if(!r.ok)throw new Error(r.status);return r.text()}).catch(e=>{delete cache[p];throw e}));
  const docPath=a=>{if(!a||a.target==='_blank')return null;let u;try{u=new URL(a.getAttribute('href'),location.href)}catch(e){return null}return u.origin===location.origin&&DOCS.includes(u.pathname)?u.pathname:null};

  function build(){
    if(root)return;
    root=document.createElement('div');root.className='ldr';root.hidden=true;
    root.innerHTML='<div class="ldr-bg" data-x></div><div class="ldr-p" role="dialog" aria-modal="true" aria-labelledby="ldr-t" tabindex="-1"><div class="ldr-h"><p class="ldr-t" id="ldr-t"></p><a class="ldr-full" href="#" target="_blank" rel="noopener">Sayfada aç</a><button class="ldr-x" type="button" aria-label="Kapat" data-x><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button></div><div class="ldr-b"></div></div>';
    document.body.appendChild(root);
    panel=root.querySelector('.ldr-p');body=root.querySelector('.ldr-b');title=root.querySelector('.ldr-t');full=root.querySelector('.ldr-full');
    root.addEventListener('click',e=>{if(e.target.closest('[data-x]'))close()});
    root.addEventListener('keydown',e=>{
      if(e.key==='Escape'){e.stopPropagation();close()}
      if(e.key==='Tab'){const f=[...panel.querySelectorAll('a[href],button')].filter(x=>x.offsetParent);if(!f.length)return;const a=f[0],z=f[f.length-1];
        if(e.shiftKey&&(document.activeElement===a||document.activeElement===panel)){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
    });
  }

  async function open(p,trigger){
    build();
    const wasOpen=!root.hidden;
    if(!wasOpen)last=trigger||document.activeElement;
    full.href=p;
    if(!wasOpen){body.innerHTML='<p class="ldr-load">Yükleniyor…</p>';title.textContent='';root.hidden=false;document.documentElement.classList.add('ldr-lock');requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('on')))}
    try{
      const html=await load(p);
      body.innerHTML=html;body.scrollTop=0;
      const d=body.querySelector('.legal-doc');title.textContent=d?d.dataset.title:'';
      panel.focus({preventScroll:true});
    }catch(e){location.href=p}
  }
  function close(){
    if(!root||root.hidden)return;
    root.classList.remove('on');document.documentElement.classList.remove('ldr-lock');
    setTimeout(()=>{if(!root.classList.contains('on'))root.hidden=true},400);
    if(last&&last.focus)last.focus({preventScroll:true});
  }

  // yakalama aşamasında: sayfa script'lerinin link davranışlarından önce
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]'),p=docPath(a);if(!p)return;
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;
    e.preventDefault();e.stopPropagation();open(p,a);
  },true);
  // üzerine gelince metni önceden indir
  document.addEventListener('pointerover',e=>{const p=docPath(e.target.closest&&e.target.closest('a[href]'));if(p)load(p).catch(()=>{})},{passive:true});
})();
