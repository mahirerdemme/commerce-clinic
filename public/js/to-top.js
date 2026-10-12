/* Mobil: aşağı inince beliren minimal "yukarı çık" butonu (stiller styles/ortak.css · .to-top)
   Sayfa en üstteyken gizli; çerez bandı açıkken CSS gizler. */
(function(){
  if(!document.querySelector('.footer'))return;
  var b=document.createElement('button');
  b.type='button';b.className='to-top';b.setAttribute('aria-label','Sayfanın başına dön');
  b.innerHTML='<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>';
  document.body.appendChild(b);
  var ticking=false;
  function update(){ticking=false;b.classList.toggle('on',window.scrollY>window.innerHeight*.9)}
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  b.addEventListener('click',function(){
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
    window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  });
  update();
})();

/* Mobil menü açıkken kapsülün dışına (karartılmış sayfaya) dokunmak menüyü kapatır */
document.addEventListener('click',function(e){
  if(!document.body.classList.contains('menu-open'))return;
  if(e.target.closest&&e.target.closest('.bar'))return;
  var m=document.querySelector('.menu-btn');if(m)m.click();
});
