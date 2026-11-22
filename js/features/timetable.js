import {S} from '../core/store.js';
import {clk,eff,pt,tparts} from '../core/prayer.js';
import {ld} from '../core/i18n.js';
import {hp} from '../core/hijri.js';
import {$} from '../core/dom.js';
import {on} from '../core/bus.js';
import {ui} from '../core/nav.js';
let ttSig='',ttDirty=true,tmo=new Date();tmo=new Date(tmo.getFullYear(),tmo.getMonth(),1,12);
const ft=d=>{if(!d)return'—';const[h,mi]=tparts(d),m=String(mi).padStart(2,'0');return S.fm==='24'?String(h).padStart(2,'0')+':'+m:(h%12||12)+':'+m};
function renderTT(){ttDirty=false;const y=tmo.getFullYear(),m=tmo.getMonth(),n=new Date(y,m+1,0).getDate(),nm=['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'],td=eff().toDateString();
 let h='<table><tr><th>Date</th>'+nm.map(x=>`<th>${x}</th>`).join('')+'</tr>';
 for(let i=1;i<=n;i++){const d=new Date(y,m,i,12);
  h+=`<tr${d.toDateString()===td?' class="td"':''}><td>${ld(d,{weekday:'short'})} ${i} <small>${hp(d).day}</small></td>`+nm.map(x=>`<td>${ft(pt(d,x))}</td>`).join('')+'</tr>'}
 $('ttb').innerHTML=h+'</table>';$('ttm').textContent=ld(tmo,{month:'long',year:'numeric'})}
$('tp').onclick=()=>{tmo=new Date(tmo.getFullYear(),tmo.getMonth()-1,1,12);renderTT()};
$('tn').onclick=()=>{tmo=new Date(tmo.getFullYear(),tmo.getMonth()+1,1,12);renderTT()};
$('tpr').onclick=()=>{try{window.print()}catch(e){}};
const sig=()=>JSON.stringify([S.lat,S.lng,S.me,S.as,S.fm,S.adj,S.ha,new Date().toDateString()+clk.hOff]);
on('render',()=>{const sg=sig();if(sg!==ttSig){ttSig=sg;ttDirty=true;if(ui.tab==='cal')renderTT()}});
on('tab',t=>{if(t==='cal'&&ttDirty)renderTT()});on('lang',renderTT);
