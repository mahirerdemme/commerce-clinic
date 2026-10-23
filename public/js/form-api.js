/* Form gönderimi: window.ccPost(url, veri) → Promise<boolean> (sunucu ok:true dediyse true)
   Bot koruması: sayfa yüklenince imzalı zaman damgası alınır (çok hızlı gönderim reddedilir) ve forma
   insanın görmediği bir tuzak alanı (cc_nick) eklenir; botlar bunu doldurursa sunucu gönderimi yok sayar. */
(function(){
  var tok=null;
  function al(){
    if(tok)return tok;
    tok=fetch('/api/form-token',{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){return j.t||''}).catch(function(){return ''});
    return tok;
  }
  function tuzak(){
    ['gp-form','rp-form','notesForm','cnSub'].forEach(function(id){
      var f=document.getElementById(id);
      if(!f||f.querySelector('.cc-nick'))return;
      var w=document.createElement('div');
      w.setAttribute('aria-hidden','true');
      w.style.cssText='position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden';
      var i=document.createElement('input');
      i.type='text';i.name='cc_nick';i.className='cc-nick';i.tabIndex=-1;i.autocomplete='off';
      w.appendChild(i);f.appendChild(w);
    });
  }
  function init(){al();tuzak()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

  window.ccPost=function(url,data){
    var body=Object.assign({},data);
    var n=document.querySelector('.cc-nick');
    body.cc_nick=[].slice.call(document.querySelectorAll('.cc-nick')).map(function(x){return x.value}).join('');
    return al().then(function(t){
      body._t=t;
      var c=new AbortController(),to=setTimeout(function(){c.abort()},12000);
      return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:c.signal})
        .then(function(r){return r.json().then(function(j){return !!(r.ok&&j&&j.ok)},function(){return false})})
        .catch(function(){return false})
        .then(function(ok){clearTimeout(to);if(!ok){tok=null}return ok});
    });
  };
})();
