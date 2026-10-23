/* Form gönderimi: window.ccPost(url, veri) → Promise<boolean> (sunucu ok:true dediyse true) */
window.ccPost=function(url,data){
  var c=new AbortController(),t=setTimeout(function(){c.abort()},12000);
  return fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:c.signal})
    .then(function(r){return r.json().then(function(j){return !!(r.ok&&j&&j.ok)},function(){return false})})
    .catch(function(){return false})
    .then(function(ok){clearTimeout(t);return ok});
};
