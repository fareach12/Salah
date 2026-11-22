import {$,addDays,iso} from '../core/dom.js';
import {HM,h2g,hp} from '../core/hijri.js';
import {ld} from '../core/i18n.js';
import {S,save} from '../core/store.js';
import {on} from '../core/bus.js';
const GM=['January','February','March','April','May','June','July','August','September','October','November','December'];
let agC='g';
function agFill(){const h=agC==='h',op=(v,t)=>`<option value="${v}">${t}</option>`;
 $('agd').innerHTML=op('','Day')+Array.from({length:h?30:31},(_,i)=>op(i+1,i+1)).join('');
 $('agm').innerHTML=op('','Month')+(h?HM:GM).map((n,i)=>op(i+1,n)).join('');$('agy').placeholder=h?'Year (AH)':'Year'}
const gf=d=>ld(d,{day:'numeric',month:'short',year:'numeric'}),hf2=h=>`${h.day} ${HM[h.month-1]} ${h.year} AH`;
function agCalc(){const o=$('ago'),dd=+$('agd').value,mm=+$('agm').value,yy=+$('agy').value,e=$('ag2').value,h=agC==='h';
 if(!dd||!mm||!yy||!e){o.innerHTML='<div class="mu">Pick the day, month and year to see the age.</div>';return}
 const end=new Date(e+'T12:00:00');let gb,hb;
 if(h){hb={year:yy,month:mm,day:dd};gb=h2g(yy,mm,dd);if(!gb||yy<1300||yy>1600){o.innerHTML='<div class="mu">That Hijri date does not exist (check the day, month and year).</div>';return}}
 else{gb=new Date(yy,mm-1,dd,12);if(yy<1000||gb.getMonth()!==mm-1){o.innerHTML='<div class="mu">That date does not exist (check the day, month and year).</div>';return}hb=hp(gb)}
 if(gb>end){o.innerHTML='<div class="mu">The birth date is after the \u201cage on\u201d date.</div>';return}
 let y=end.getFullYear()-gb.getFullYear(),m=end.getMonth()-gb.getMonth(),d=end.getDate()-gb.getDate();
 if(d<0){m--;d+=new Date(end.getFullYear(),end.getMonth(),0).getDate()}if(m<0){y--;m+=12}
 const he=hp(end);let hy=he.year-hb.year,hm=he.month-hb.month,hd=he.day-hb.day;
 if(hd<0){hm--;hd+=hp(addDays(end,-he.day)).day}if(hm<0){hy--;hm+=12}
 const n=Math.round((end-gb)/864e5),nb=(()=>{let g=new Date(end.getFullYear(),gb.getMonth(),gb.getDate(),12);if(g<end)g=new Date(end.getFullYear()+1,gb.getMonth(),gb.getDate(),12);return Math.round((g-end)/864e5)})(),
 nh=(()=>{let g=h2g(he.year,hb.month,hb.day);if(g&&g<end)g=h2g(he.year+1,hb.month,hb.day);return g?Math.round((g-end)/864e5):null})(),
 L=(a,b)=>`<div class="row"><span>${a}</span><span>${b}</span></div>`,N=x=>x.toLocaleString();
 o.innerHTML=L('Born',`${gf(gb)}<br>${hf2(hb)}`)+L('Age (Gregorian)',`${y} years, ${m} months, ${d} days`)+L('Age (Hijri)',`${hy} years, ${hm} months, ${hd} days`)+
  L('In years',`${(n/365.2425).toFixed(2)} Gregorian<br>${(n/354.367).toFixed(2)} Hijri`)+L('In months',`${N(y*12+m)} Gregorian<br>${N(hy*12+hm)} Hijri`)+L('In weeks',N(Math.floor(n/7)))+L('In days',N(n))+L('In hours',N(n*24))+
  L('Next birthday',`${nb} days (Gregorian)${nh!==null?`<br>${nh} days (Hijri)`:''}`)}
document.querySelectorAll('#agt button').forEach(b=>b.onclick=()=>{agC=b.dataset.c;document.querySelectorAll('#agt button').forEach(x=>x.classList.toggle('act',x===b));agFill();agCalc()});
$('ag2').value=iso(new Date());$('agn').onclick=()=>{$('ag2').value=iso(new Date());agCalc()};
['agd','agm','agy','ag2'].forEach(i=>{$(i).addEventListener('change',agCalc);$(i).addEventListener('input',agCalc)});agFill();agCalc();
// ---------- Saved people (ages update automatically) ----------
S.pp=(Array.isArray(S.pp)?S.pp:[]).filter(q=>q&&typeof q.n==='string'&&(q.c==='g'||q.c==='h')&&+q.d&&+q.m&&+q.y).slice(0,30);
function agOk(c,dd,mm,yy){if(!dd||!mm||!yy)return null;
 if(c==='h'){const gb=h2g(yy,mm,dd);return(!gb||yy<1300||yy>1600)?null:{gb,hb:{year:yy,month:mm,day:dd}}}
 const gb=new Date(yy,mm-1,dd,12);return(yy<1000||gb.getMonth()!==mm-1)?null:{gb,hb:hp(gb)}}
function pAge(q,end){const r=agOk(q.c,+q.d,+q.m,+q.y);if(!r)return null;const{gb,hb}=r;if(gb>end)return{fut:1,gb};
 let y=end.getFullYear()-gb.getFullYear(),m=end.getMonth()-gb.getMonth(),d=end.getDate()-gb.getDate();
 if(d<0){m--;d+=new Date(end.getFullYear(),end.getMonth(),0).getDate()}if(m<0){y--;m+=12}
 const he=hp(end);let hy=he.year-hb.year,hm=he.month-hb.month,hd=he.day-hb.day;
 if(hd<0){hm--;hd+=hp(addDays(end,-he.day)).day}if(hm<0){hy--;hm+=12}
 let g=new Date(end.getFullYear(),gb.getMonth(),gb.getDate(),12);if(g<end)g=new Date(end.getFullYear()+1,gb.getMonth(),gb.getDate(),12);
 return{y,m,d,hy,hm,hd,nb:Math.round((g-end)/864e5),gb}}
function agLoad(q){agC=q.c;document.querySelectorAll('#agt button').forEach(x=>x.classList.toggle('act',x.dataset.c===q.c));agFill();
 $('agd').value=q.d;$('agm').value=q.m;$('agy').value=q.y;$('agname').value=q.n;$('agms').textContent='';agCalc();$('ago').scrollIntoView({block:'nearest'})}
let ppSig='';
function renderPeople(){const bx=$('agpl'),end=new Date();end.setHours(12,0,0,0);
 const sig=JSON.stringify([S.pp,iso(end),S.ha]);if(sig===ppSig)return;ppSig=sig;bx.textContent='';
 if(!S.pp.length){const e=document.createElement('div');e.className='mu';e.textContent='Nobody saved yet. Fill in a birth date above, add a name and tap Save.';bx.appendChild(e);return}
 S.pp.forEach(q=>{const a=pAge(q,end),w=document.createElement('div');w.className='row';w.style.cssText='align-items:center;gap:8px';
  const l=document.createElement('div');l.style.cssText='flex:1;min-width:0;cursor:pointer';l.setAttribute('role','button');l.tabIndex=0;l.title='Tap to open in the calculator';
  const nm=document.createElement('b');nm.setAttribute('translate','no');nm.textContent=q.n;nm.style.cssText='display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';l.appendChild(nm);
  const bn=document.createElement('small');bn.className='sm l';bn.textContent=a?'Born '+gf(a.gb):'Invalid date';l.appendChild(bn);
  l.onclick=()=>agLoad(q);l.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();agLoad(q)}};
  const r=document.createElement('div');r.style.cssText='text-align:right;flex:none';
  if(!a){r.textContent='\u2014'}else if(a.fut){r.textContent='Not born yet'}
  else{r.textContent=a.y+'y '+a.m+'m '+a.d+'d';
   const h=document.createElement('small');h.className='sm';h.textContent='Hijri '+a.hy+'y '+a.hm+'m '+a.hd+'d';r.appendChild(h);
   const b=document.createElement('small');b.className='sm';b.textContent=a.nb===0?'\u{1F382} Birthday today!':'\u{1F382} in '+a.nb+(a.nb===1?' day':' days');r.appendChild(b)}
  const x=document.createElement('button');x.type='button';x.textContent='\u2715';x.setAttribute('aria-label','Delete '+q.n);x.style.cssText='flex:none;padding:6px 10px';
  x.onclick=()=>{S.pp=S.pp.filter(z=>z.id!==q.id);save();renderPeople()};
  w.append(l,r,x);bx.appendChild(w)})}
$('agsv').onclick=()=>{const ms=$('agms'),dd=+$('agd').value,mm=+$('agm').value,yy=+$('agy').value;
 if(!agOk(agC,dd,mm,yy)){ms.textContent='Pick a valid birth date first.';return}
 const n=($('agname').value.trim()||'Person').slice(0,30),i=S.pp.findIndex(z=>z.n.toLowerCase()===n.toLowerCase());
 if(i<0&&S.pp.length>=30){ms.textContent='You can save up to 30 people. Delete one first.';return}
 const rec={id:i>=0?S.pp[i].id:'p'+Date.now(),n,c:agC,d:dd,m:mm,y:yy};
 if(i>=0)S.pp[i]=rec;else S.pp.push(rec);save();ms.textContent=i>=0?'Updated '+n+'.':'Saved '+n+'.';$('agname').value='';renderPeople()};
on('render',renderPeople);
