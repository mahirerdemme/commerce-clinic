// Mobil ekran görüntüsü: Chrome DevTools Protocol ile gerçek cihaz emülasyonu (390x844, DPR 2, dokunmatik, iPhone UA)
// kullanım: node shot.mjs <url> <out.png> [y=0] [height=1600] [width=390]
// Örnek: npm run build && npx next start -p 3100 &  → node scripts/mobil-ss.mjs http://localhost:3100/ /tmp/ana.png 0 1600
import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const [url,out,yArg='0',hArg='1600',wArg='390']=process.argv.slice(2);
const W=+wArg,H=844,Y=+yArg,HH=+hArg;
const CH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port=9333;
const chrome=spawn(CH,['--headless=new','--disable-gpu','--hide-scrollbars','--no-first-run','--user-data-dir='+process.env.HOME+'/.cache/cc-cdp-profile',`--remote-debugging-port=${port}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let tabs;for(let i=0;i<60;i++){try{tabs=await (await fetch(`http://127.0.0.1:${port}/json`)).json();break}catch{await sleep(200)}}
const t=tabs.find(x=>x.type==='page');
const ws=new WebSocket(t.webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);
let id=0;const pend=new Map();
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result||m.error);pend.delete(m.id)}};
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
await send('Emulation.setDeviceMetricsOverride',{width:W,height:H,deviceScaleFactor:2,mobile:true});
await send('Emulation.setUserAgentOverride',{userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'});
await send('Emulation.setTouchEmulationEnabled',{enabled:true});
await send('Page.enable');
await send('Page.navigate',{url});
await sleep(2500);
await send('Runtime.evaluate',{expression:`(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=300){scrollTo(0,y);await new Promise(r=>setTimeout(r,50))}scrollTo(0,${Y})})()`,awaitPromise:true});
await send('Runtime.evaluate',{expression:`document.querySelectorAll('[class*=cookie],[id*=cookie],[class*=cerez],[id*=cerez],[class*=consent],[id*=consent]').forEach(e=>e.remove())`});
await sleep(900);
const m=await send('Page.getLayoutMetrics');
const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:Y,width:W,height:HH,scale:1}});
writeFileSync(out,Buffer.from(r.data,'base64'));
ws.close();chrome.kill();
console.log('ok',out,'sayfa yüksekliği:',Math.round(m.cssContentSize.height),'genişlik:',Math.round(m.cssContentSize.width));
