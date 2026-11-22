import {lab,pt} from '../core/prayer.js';
import {S,save} from '../core/store.js';
import {$} from '../core/dom.js';
import {on} from '../core/bus.js';
const remTxt=(r,d)=>(r.m?`${r.m} min ${r.d<0?'before':'after'} `:'At ')+lab(r.p,d||new Date())+(r.l?` \u2013 ${r.l}`:'');
function fireRem(r,d){const x=remTxt(r,d);try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}
 const b=document.createElement('div');b.textContent='\u23F0 '+x;b.style.cssText='position:fixed;top:12px;left:12px;right:12px;z-index:99;padding:14px;border-radius:12px;background:#127050;color:#fff;font-weight:600;text-align:center;box-shadow:0 4px 16px #0006';b.onclick=()=>b.remove();document.body.appendChild(b);setTimeout(()=>b.remove(),30000);
 try{if(window.Notification&&Notification.permission==='granted')navigator.serviceWorker.ready.then(g=>g.showNotification('Salah',{body:x,icon:'icon-192.png',tag:r.id}))}catch(e){}}
function chkRem(){const now=new Date(),dk=now.toDateString();
 for(const k in S.rf)if(S.rf[k]!==dk)delete S.rf[k];
 S.rem.forEach(r=>{const p=pt(now,r.p);if(!p||S.rf[r.id]===dk)return;const df=now-new Date(p.getTime()+r.d*r.m*6e4);if(df>=0&&df<12e4){S.rf[r.id]=dk;save();fireRem(r,now)}})}
function rList(){const bx=$('rls');bx.textContent='';S.rem.forEach(r=>{const w=document.createElement('div');w.className='row';const t=document.createElement('span');t.textContent=remTxt(r);const b=document.createElement('button');b.type='button';b.textContent='\u2715';b.setAttribute('aria-label','Delete');b.onclick=()=>{S.rem=S.rem.filter(x=>x.id!==r.id);save();rList()};w.append(t,b);bx.appendChild(w)});if(!S.rem.length)bx.textContent='No reminders yet'}
$('ra').onclick=()=>{S.rem.push({id:'r'+Date.now(),p:$('rp').value,d:+$('rd').value,m:Math.max(0,Math.min(180,parseInt($('rm').value)||0)),l:$('rl').value.trim().slice(0,40)});$('rl').value='';save();rList();chkRem()};
const rnS=()=>{$('rn').textContent=!window.Notification?'Notifications not supported':Notification.permission==='granted'?'Notifications on \u2713':'Enable notifications'};
$('rn').onclick=()=>{if(window.Notification&&Notification.permission==='default')Notification.requestPermission().then(rnS)};
rnS();rList();
on('render',chkRem);
