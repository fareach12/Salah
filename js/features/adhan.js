import {$,addDays} from '../core/dom.js';
import {cityDay,lab,pt} from '../core/prayer.js';
import {S,save} from '../core/store.js';
import {tx} from '../core/i18n.js';
import {on} from '../core/bus.js';
// Adhan: plays the call to prayer at the prayers the user switched on.
// Sound = the user's own file (kept on the device in IndexedDB) or the default audio/adhan.mp3.
// Like Reminders it only runs while the app is open or was used recently.
const PR=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
const SILENT='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
const NONE='No adhan sound yet. Tap “Choose adhan sound”.';
const au=new Audio();au.preload='auto';
let url='',ready=null,quiet=false,bn=null;
// --- the chosen sound file lives in IndexedDB (too big for localStorage)
const idb=(mode,fn)=>new Promise((ok,no)=>{const q=indexedDB.open('salah-adhan',1);q.onupgradeneeded=()=>q.result.createObjectStore('f');q.onerror=()=>no(q.error);
 q.onsuccess=()=>{const db=q.result,t=db.transaction('f',mode),r=fn(t.objectStore('f'));t.oncomplete=()=>{db.close();ok(r&&r.result)};t.onerror=()=>no(t.error)}});
const dbGet=()=>idb('readonly',s=>s.get('adhan')),dbPut=b=>idb('readwrite',s=>s.put(b,'adhan')),dbDel=()=>idb('readwrite',s=>s.delete('adhan'));
// Load the sound as a blob: works offline and avoids the range-request problems of audio served by a service worker.
function load(){return ready||(ready=(async()=>{
 let b=null;try{b=await dbGet()}catch(e){}
 if(!b){const r=await fetch('audio/adhan.mp3');if(!r.ok)throw 0;b=await r.blob()}
 if(url)URL.revokeObjectURL(url);return url=URL.createObjectURL(b)})().catch(()=>{ready=null;return ''}))}
// --- status line (file names are user text, so they are kept out of translation)
const say=(m,name)=>{const e=$('ads');e.textContent=m;if(name){const s=document.createElement('span');s.translate=false;s.textContent=name;e.append(s)}tx(e)};
const idle=()=>{S.adf?say('Custom sound: ',S.adf):say('');$('adr').style.display=S.adf?'':'none'};
// --- the banner shown when the adhan starts (same look as a reminder banner)
const hide=()=>{if(bn){bn.remove();bn=null}};
const sync=()=>{if(bn&&bn.isConnected){bn.lastChild.textContent=au.paused?'Tap to play':'Tap to stop';tx(bn)}};
function banner(n,d){hide();const b=bn=document.createElement('div'),a=document.createElement('div'),c=document.createElement('div');
 b.style.cssText='position:fixed;top:calc(12px + env(safe-area-inset-top,0px));left:12px;right:12px;z-index:99;padding:14px;border-radius:12px;background:#127050;color:#fff;font-weight:600;text-align:center;box-shadow:0 4px 16px #0006;cursor:pointer';
 a.textContent='\u{1F54C} Time for '+lab(n,d);c.textContent='Tap to stop';c.style.cssText='font-size:.8rem;font-weight:400;opacity:.85;margin-top:2px';
 b.append(a,c);b.onclick=()=>au.paused?play(n,d):stop();document.body.appendChild(b);tx(b);
 setTimeout(()=>{if(bn===b&&au.paused)hide()},6e4)}
// --- playing
async function play(n,d){const u=await load();if(!u){say(NONE);return false}
 quiet=false;if(au.src!==u)au.src=u;au.currentTime=0;
 try{await au.play();
  try{navigator.mediaSession.metadata=new MediaMetadata({title:'Adhan',artist:n?lab(n,d):'',artwork:[{src:'icon-512.png',sizes:'512x512',type:'image/png'}]});navigator.mediaSession.setActionHandler('pause',stop)}catch(e){}
  return true}
 catch(e){say('Sound blocked by the browser. Tap Test once to allow it.');return false}}
function stop(){quiet=false;au.pause();au.currentTime=0;hide()}
au.onplay=()=>{if(!quiet){say('Playing…');sync()}};
au.onpause=()=>{if(!quiet){idle();sync()}};
au.onended=()=>{idle();hide()};
// Phones only allow sound after a tap: the first tap anywhere in the app "unlocks" the audio element silently.
function unlock(){if(!au.paused||quiet)return;quiet=true;au.src=SILENT;
 au.play().then(()=>{if(quiet){au.pause();quiet=false;removeEventListener('click',unlock);load().then(u=>{if(u&&au.paused&&au.src!==u){au.src=u;au.load()}})}}).catch(()=>{quiet=false})}
addEventListener('click',unlock);
async function fire(n,d){const ok=play(n,d);banner(n,d);try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}
 if(!await ok){sync();try{if(window.Notification&&Notification.permission==='granted')navigator.serviceWorker.ready.then(g=>g.showNotification('Salah',{body:'Time for '+lab(n,d),icon:'icon-192.png',tag:'adhan-'+n}))}catch(e){}}}
// Once per prayer per day, and only within 90 s of the time: an adhan that is minutes late is not played.
function chk(){const now=new Date(),dk=now.toDateString();
 for(const k in S.af)if(S.af[k]!==dk)delete S.af[k];
 PR.forEach(n=>{if(!S.ad[n]||S.af[n]===dk)return;const p=pt(cityDay(now),n);if(!p)return;const df=now-p;if(df>=0&&df<9e4){S.af[n]=dk;save();fire(n,now)}})}
// --- settings card
const adn=$('adn');
adn.innerHTML=PR.map(n=>`<button type="button" data-n="${n}" aria-pressed="false">${n}</button>`).join('');
const paint=()=>adn.querySelectorAll('button').forEach(b=>{const o=!!S.ad[b.dataset.n];b.classList.toggle('act',o);b.setAttribute('aria-pressed',o)});
adn.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const n=b.dataset.n;S.ad[n]=S.ad[n]?0:1;save();paint();
 if(S.ad[n])load().then(u=>{if(!u)say(NONE)})});
$('adt').onclick=()=>play();
$('adx').onclick=stop;
$('adc').onclick=()=>$('adf').click();
$('adf').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
 if(!(f.type||'').startsWith('audio/')&&!/\.(mp3|m4a|aac|ogg|oga|opus|wav)$/i.test(f.name)){say('That is not an audio file.');return}
 try{await dbPut(f);S.adf=f.name.slice(0,60);save();ready=null;stop();idle()}catch(x){say('Could not save the sound on this device.')}};
$('adr').onclick=async()=>{try{await dbDel()}catch(x){}S.adf='';save();ready=null;stop();idle()};
// Own timer: wakes right at the next adhan time (also while the page is in the background), so it never waits for the screen refresh.
let tm=0;
function arm(){clearTimeout(tm);const now=new Date();let w=3e4;
 PR.forEach(n=>{if(!S.ad[n])return;[0,1].forEach(o=>{const p=pt(addDays(cityDay(now),o),n);if(p&&p>now)w=Math.min(w,p-now)})});
 tm=setTimeout(()=>{chk();arm()},Math.max(20,w+15))}
paint();idle();on('render',()=>{chk();arm()});arm();
if(PR.some(n=>S.ad[n]))load(); // ready before the first prayer time
