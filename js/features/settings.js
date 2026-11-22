import {S,save} from '../core/store.js';
import {$} from '../core/dom.js';
import {refresh} from '../core/render.js';
import {CT} from '../data/cities.js';
import {cos,sin} from '../core/prayer.js';
import {applyLg,tx} from '../core/i18n.js';
import {emit} from '../core/bus.js';
function fillForm(){setCity(S.city);$('lat').value=S.lat;$('lng').value=S.lng;$('me').value=S.me;$('as').value=S.as;$('fm').value=S.fm;$('ha').value=String(S.ha||0)}
function upd(){const a=parseFloat($('lat').value),b=parseFloat($('lng').value);
 if(!isNaN(a)&&!isNaN(b)&&Math.abs(a)<=90&&Math.abs(b)<=180){S.lat=a;S.lng=b}
 $('lat').value=S.lat;$('lng').value=S.lng; // snap back if the typed value was invalid
 S.me=$('me').value;S.as=+$('as').value;S.fm=$('fm').value;save();refresh()}
['lat','lng','me','as','fm'].forEach(i=>$(i).addEventListener('change',upd));
$('city').innerHTML=CT.map(c=>`<option value="${c.n}">${c.n}</option>`).join('');
function setCity(n){const el=$('city');n=n||'';if(n&&![...el.options].some(o=>o.value===n)){const o=document.createElement('option');o.value=n;o.textContent=n;el.insertBefore(o,el.firstChild)}el.value=n}
$('city').addEventListener('change',()=>{const c=CT.find(x=>x.n.toLowerCase()===$('city').value.trim().toLowerCase());
 if(c){S.city=c.n;S.lat=c.a;S.lng=c.b;S.tz=c.z;$('city').value=c.n;$('lat').value=c.a;$('lng').value=c.b;save();refresh()}});
{const hav=(a,b,c,d)=>12742*Math.asin(Math.sqrt(sin((c-a)/2)**2+cos(a)*cos(c)*sin((d-b)/2)**2));
 if(!navigator.geolocation)$('loc').style.display='none';
 else $('loc').onclick=()=>{const st=$('locs');st.textContent='Locating…';tx();
  navigator.geolocation.getCurrentPosition(p=>{
   const a=+p.coords.latitude.toFixed(4),b=+p.coords.longitude.toFixed(4);let best=null,bd=1e9;
   CT.forEach(c=>{const d=hav(a,b,c.a,c.b);if(d<bd){bd=d;best=c}});
   S.lat=a;S.lng=b;S.city=bd<=50?best.n:'My location';S.tz=''; // you are here: device clock
   setCity(S.city);$('lat').value=a;$('lng').value=b;st.textContent='';save();refresh()},
  e=>{st.textContent=e.code===1?'Location permission was denied.':'Could not get your location.';tx()},
  {timeout:15000,maximumAge:60000})}}
$('iqa').innerHTML=['Fajr','Dhuhr','Asr','Maghrib','Isha'].map(n=>`<div style="flex:1 1 30%"><label style="margin:4px 0 2px">${n}</label><input type="number" min="0" step="1" inputmode="numeric" data-n="${n}" value="${+S.iq[n]||0}"></div>`).join('');
$('iqa').addEventListener('change',e=>{const n=e.target.dataset.n;if(n){S.iq[n]=Math.max(0,parseInt(e.target.value)||0);save();refresh()}});
$('adj').innerHTML=['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'].map(n=>`<div style="flex:1 1 30%"><label style="margin:4px 0 2px">${n}</label><div class="sg"><button type="button" class="sb" data-n="${n}" data-neg="${(S.adj[n]||0)<0?1:0}">${(S.adj[n]||0)<0?'−':'+'}</button><input type="number" min="0" step="1" inputmode="numeric" data-n="${n}" value="${Math.abs(S.adj[n]||0)}"></div></div>`).join('');
const upA=n=>{const b=$('adj').querySelector('.sb[data-n="'+n+'"]'),i=$('adj').querySelector('input[data-n="'+n+'"]');S.adj[n]=(b.dataset.neg==='1'?-1:1)*Math.abs(parseInt(i.value)||0);save();refresh()};
$('adj').addEventListener('click',e=>{const b=e.target.closest('.sb');if(!b)return;b.dataset.neg=b.dataset.neg==='1'?'0':'1';b.textContent=b.dataset.neg==='1'?'−':'+';upA(b.dataset.n)});
$('adj').addEventListener('change',e=>{if(e.target.tagName==='INPUT')upA(e.target.dataset.n)});
$('lg').value=S.lg||'en';
$('lg').addEventListener('change',()=>{S.lg=$('lg').value;save();applyLg();emit('lang');refresh()});
// The phone's status bar and the Android bar (home/back) take the colour of the bottom menu, so they follow every theme.
const syncBar=()=>{const c=getComputedStyle(document.documentElement).getPropertyValue('--card').trim();if(c)document.querySelectorAll('meta[name="theme-color"]').forEach(m=>m.content=c)};
const applyTh=()=>{if(S.th&&S.th!=='auto')document.documentElement.dataset.theme=S.th;else delete document.documentElement.dataset.theme;syncBar()};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',syncBar);
$('th').value=S.th;applyTh();$('th').addEventListener('change',()=>{S.th=$('th').value;save();applyTh()});
$('ha').addEventListener('change',()=>{S.ha=+$('ha').value;save();emit('hijri');refresh()});
export {fillForm};
