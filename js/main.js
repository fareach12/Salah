import {fillForm} from './features/settings.js';
import {applyLg} from './core/i18n.js';
import {refresh} from './core/render.js';
import {showTab} from './core/nav.js';
import {hot} from './features/home.js';
import './core/nav.js';
import './features/home.js';import './features/timetable.js';import './features/qibla.js';import './features/calendar.js';
import './features/reminders.js';import './features/adhan.js';import './features/age.js';import './features/quran/index.js';
fillForm();applyLg();refresh();showTab('home');
let lastK=Math.floor(Date.now()/6e4);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastK=Math.floor(Date.now()/6e4);refresh()}});
// Wake exactly at the next minute change or the next prayer time (no 1-second polling lag).
function tick(){const n=Date.now(),k=Math.floor(n/6e4);
 if(!document.hidden&&(k!==lastK||(hot.next&&n>=hot.next))){lastK=k;refresh()}
 const t=Date.now();let d=6e4-t%6e4;if(hot.next>t)d=Math.min(d,hot.next-t);
 setTimeout(tick,Math.max(20,d+15))}
tick();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
