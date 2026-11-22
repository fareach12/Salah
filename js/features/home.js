import {$,addDays} from '../core/dom.js';
import {calc,clk,eff,fmt,lab,pt} from '../core/prayer.js';
import {S} from '../core/store.js';
import {HM,hp,scanEv} from '../core/hijri.js';
import {ld} from '../core/i18n.js';
import {on} from '../core/bus.js';
import {refresh} from '../core/render.js';
const put=(id,v,text)=>{const e=$(id);if(e._h!==v){e._h=v;if(text)e.textContent=v;else e.innerHTML=v}}; // only touch the DOM when something changed
let view=0,curPh='',evK='',evC=null,evA='';
export const hot={next:0}; // time of the next prayer, read by the main loop
const hm=ms=>Math.floor(ms/36e5)+'h '+String(Math.floor(ms%36e5/6e4)).padStart(2,'0')+'m';
function render(){
 const now=new Date(),T=calc(now),names=Object.keys(T),ds=names.map(n=>pt(now,n));
 clk.hOff=ds[4]&&now>=ds[4]?1:0;
 const iqS=(n,i)=>{const m=S.iq[n]||0;if(!m||!ds[i])return'';const q=new Date(ds[i].getTime()+m*6e4),w=ds[i]<=now&&now<q?` · in ${Math.ceil((q-now)/6e4)} min`:'';return `<small class="sm">Iqama ${fmt(q)}${w}</small>`};
 const ni=ds.findIndex((d,i)=>i!==1&&d&&d>now);
 const nextName=ni<0?'Fajr':names[ni],nextDate=ni<0?pt(addDays(now,1),'Fajr'):ds[ni];
 const pre=ds[0]&&now<ds[0];
 const mS=pre?pt(addDays(now,-1),'Maghrib'):ds[4],mE=pre?ds[0]:pt(addDays(now,1),'Fajr'); // the night: Maghrib to Fajr
 const mid=mS&&mE?new Date(mS.getTime()+(mE-mS)/2):null;
 const asrEnd=ds[4]?new Date(ds[4].getTime()-20*6e4):null;
 let ci=-1;
 if(pre)ci=5;
 else [[0,ds[0],ds[1]],[2,ds[2],ds[3]],[3,ds[3],asrEnd],[4,ds[4],ds[5]],[5,ds[5],mE]].forEach(([i,a,b])=>{if(a&&b&&now>=a&&now<b)ci=i});
 const late=ci===5&&mid&&now>=mid; // after Islamic midnight: permissible until Fajr
 if(view===1){const b=addDays(now,1);
  put('times',names.map((n,i)=>{const t=pt(b,n),t0=ds[i],df=t&&t0?((t.getHours()*60+t.getMinutes()-t0.getHours()*60-t0.getMinutes()+2160)%1440)-720:0;
   return `<div class="row${i===1?' sr':''}"><svg class="ic"><use href="#i-${n}"/></svg><span>${lab(n,b)}</span><span>${fmt(t)}<small class="sm">${df>0?'+':df<0?'\u2212':''}${Math.abs(df)} min vs today</small></span></div>`}).join(''))}
 else put('times',names.map((n,i)=>`<div class="row${i===ci?' on':''}${ds[i]&&ds[i]<=now&&i!==ci?' past':''}${i===1?' sr':''}"><svg class="ic"><use href="#i-${n}"/></svg><span>${lab(n,now)}${i===ci?(late?' · now (late)':' · now'):''}</span><span>${fmt(ds[i])}${iqS(n,i)}</span></div>`).join(''));
 put('nn',lab(nextName,nextDate),1);
 if(ds[0]&&ds[1]&&ds[2]&&ds[4]&&mS&&mE){
  const third=new Date(mS.getTime()+(mE-mS)*2/3),d1=new Date(ds[1].getTime()+15*6e4),d2=new Date(ds[2].getTime()-10*6e4);
  const o1=now>=d1&&now<d2,o2=now>=third&&now<mE;
  put('vol',
   `<div class="row${o1?' on':''}"><span>Duha${o1?' · now':''}</span><span>${fmt(d1)} – ${fmt(d2)}</span></div>`+
   `<div class="row${o2?' on':''}"><span>Salatul Layl${o2?' · now':''}</span><span>${fmt(third)} – ${fmt(mE)}</span></div>`+
   `<div class="row"><span>Islamic midnight</span><span>${fmt(mid)}</span></div>`)}
 {const e=eff(),hj=hp(e),wd=e.getDay(),k=e.toDateString();
  if(evK!==k){evK=k;evC=scanEv(e)}
  const dl=i=>i===0?'today':i===1?'tomorrow':'in '+i+' days';
  const rm=evC.out.find(x=>x.n==='Ramadan begins');
  if(evA!==k){evA=k;if(hj.month===9||(rm&&rm.i<=30)||evC.out.some(x=>x.i<=3&&x.n!=='Ramadan begins'))$('evd').open=true}
  put('ev',
   (hj.month===9?`<div class="row on"><span>Ramadan</span><span>Day ${hj.day}</span></div>`:rm?`<div class="row on"><span>Ramadan begins</span><span>${dl(rm.i)}</span></div>`:'')+
   evC.out.filter(x=>x.n!=='Ramadan begins').slice(0,4).map(x=>`<div class="row"><span>${x.n}</span><span>${ld(x.d,{day:'numeric',month:'short'})}<small class="sm">${dl(x.i)}</small></span></div>`).join(''));
  if(ds[0]&&ds[4]){
   const nf=pt(addDays(now,1),'Fajr'),inF=now>=ds[0]&&now<ds[4];
   const st=now<ds[0]?'Suhoor ends in '+hm(ds[0]-now):inF?'Iftar in '+hm(ds[4]-now):'Next Suhoor ends '+fmt(nf);
   const tg=[];
   if(hj.month===9)tg.push('Ramadan fast');
   if((hj.month===10&&hj.day===1)||(hj.month===12&&hj.day>=10&&hj.day<=13))tg.push('No fasting today (Eid days)');
   else{if(wd===1||wd===4)tg.push((wd===1?'Monday':'Thursday')+' sunnah');
    if(hj.day>=13&&hj.day<=15&&hj.month!==9)tg.push('White day');
    if(hj.month===1&&hj.day===10)tg.push('Ashura');
    if(hj.month===12&&hj.day===9)tg.push('Day of Arafah')}
   const wn=evC.white>0&&!(hj.day>=13&&hj.day<=15)&&hj.month!==9?' · White days begin '+dl(evC.white):'';
   put('fs',
    `<div class="row"><span>Suhoor ends (Fajr)</span><span>${fmt(ds[0])}</span></div>`+
    `<div class="row"><span>Iftar (Maghrib)</span><span>${fmt(ds[4])}</span></div>`+
    `<div class="row${inF?' on':''}"><span>${st}</span></div>`+
    `<div class="mu">Today: ${tg.join(' · ')||'no special fast day'}${wn}</div>`)}
 }
 put('cp',S.city?'📍 '+S.city:'',1);
 put('nt',nextDate?fmt(nextDate):'',1);
 {const pv=(ni<0?ds[5]:ds.filter((d,i)=>i!==1&&d&&d<=now).pop())||pt(addDays(now,-1),'Isha');
  const fr=nextDate&&pv?Math.min(1,Math.max(0,(now-pv)/(nextDate-pv))):0;
  $('rf').setAttribute('stroke-dasharray',((1-fr)*276.46).toFixed(1)+' 276.46');
  put('rh',nextDate?hm(Math.max(0,nextDate-now)):'',1);
  hot.next=nextDate?nextDate.getTime():0;
  const P={night:['#0c1a3c','#13265a','#22397a'],fajr:['#26256a','#3c3f8f','#6a6fc0'],morning:['#0b4a38','#127050','#1c8a64'],noon:['#0b5f7a','#12829a','#27a5b5'],asr:['#8a5a12','#b97a1c','#e0a63a'],sunset:['#7a2f1c','#b3472a','#e0803a']};
  const ph=!ds[0]||!ds[5]?'morning':now<ds[0]?'night':now<ds[1]?'fajr':now<ds[2]?'morning':now<ds[3]?'noon':now<ds[4]?'asr':now<ds[5]?'sunset':'night';
  if(ph!==curPh){curPh=ph;const rs=document.documentElement.style;rs.setProperty('--h1',P[ph][0]);rs.setProperty('--hm',P[ph][1]);rs.setProperty('--h2',P[ph][2]);const tc=document.querySelector('meta[name=theme-color]');if(tc)tc.content=P[ph][0]}}
 {const e=eff(),h=hp(e);
  put('hj',`${h.day} ${HM[h.month-1]} ${h.year} AH`,1);
  put('gr',ld(e,{weekday:'long',day:'numeric',month:'long',year:'numeric'}),1)}
}
on('render',render);on('hijri',()=>{evK=''});
$('dv').addEventListener('click',e=>{const o=e.target.dataset.o;if(o==null)return;view=+o;[...$('dv').children].forEach(b=>b.classList.toggle('act',b.dataset.o===o));refresh()});
