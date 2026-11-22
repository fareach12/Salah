import {fillForm} from './features/settings.js';
import {applyLg} from './core/i18n.js';
import {refresh} from './core/render.js';
import {showTab} from './core/nav.js';
import {hot} from './features/home.js';
import './core/nav.js';
import './features/home.js';import './features/timetable.js';import './features/qibla.js';import './features/calendar.js';
import './features/reminders.js';import './features/adhan.js';import './features/age.js';import './features/quran/index.js';
fillForm();applyLg();refresh();
{ // a refresh keeps you on the same page (tab, Quran sub-page and scroll position)
 let t='home',y=0;try{t=sessionStorage.getItem('tab')||'home';y=+sessionStorage.getItem('sy')||0}catch(e){}
 if(!document.querySelector('#nav button[data-t="'+t+'"]'))t='home';
 showTab(t);
 if(y>0){let go=1;const stop=()=>{go=0};addEventListener('touchstart',stop,{once:true,passive:true});addEventListener('wheel',stop,{once:true,passive:true});
  [0,150,450].forEach(d=>setTimeout(()=>{if(go)scrollTo(0,y)},d))}
 const sv=()=>{try{sessionStorage.setItem('sy',Math.round(scrollY))}catch(e){}};
 addEventListener('pagehide',sv);document.addEventListener('visibilitychange',()=>{if(document.hidden)sv()});
}
let lastK=Math.floor(Date.now()/6e4);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastK=Math.floor(Date.now()/6e4);refresh()}});
// Wake exactly at the next minute change or the next prayer time (no 1-second polling lag).
function tick(){const n=Date.now(),k=Math.floor(n/6e4);
 if(!document.hidden&&(k!==lastK||(hot.next&&n>=hot.next))){lastK=k;refresh()}
 const t=Date.now();let d=6e4-t%6e4;if(hot.next>t)d=Math.min(d,hot.next-t);
 setTimeout(tick,Math.max(20,d+15))}
tick();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
