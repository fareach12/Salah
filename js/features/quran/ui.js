import {AR,C,N} from './data.js';
import {ld,tx} from '../../core/i18n.js';
import {Q,bestStreak,dAdd,juzDone,next,qsave,setQ,stats,streak,today,totals} from './state.js';
import {H,J,abs,count,facts,fromAbs,idx,pageOf,pgw,rn,rng,validate} from './math.js';
import {S} from '../../core/store.js';
import {HM,hp} from '../../core/hijri.js';
import {pad} from '../../core/dom.js';
import {ui} from '../../core/nav.js';
import {on} from '../../core/bus.js';
let view="home",cal=null,flash="",sel=null,logDate=null,anim=false;
const root=document.getElementById("qr");const qs=s=>root.querySelector(s);
function go(v){const ch=v!==view;view=v;anim=ch;draw();if(ch)scrollTo(0,0)}
const pos=(s,a)=>N[s-1]+" "+s+":"+a;
const opts=sel=>N.map((n,i)=>`<option value="${i+1}"${i+1===sel?" selected":""}>${i+1}. ${n} — ${AR[i]}</option>`).join("");
function draw(){
 const tabs=[["home","Today"],["log","Log"],["calendar","Calendar"],["ref","Progress"],["settings","More"]];
 const f={home,log,calendar,ref,settings}[view]||home;
 root.innerHTML=`<div class="f seg" style="margin-bottom:12px">${tabs.map(([k,l])=>`<button type="button" data-v="${k}" class="${k===view?"act":""}">${l}</button>`).join("")}</div>`+`<div class="qv${anim?" in":""}">`+f()+"</div>";anim=false;if(view==="home")flash="";
 tx(root);if(view==="log")bindLog();if(view==="settings")bindSet();if(view==="calendar")bindCal();if(view==="ref")bindRef()}
root.addEventListener("click",e=>{const b=e.target.closest("[data-v]");if(b)go(b.dataset.v)});
function planInfo(st){const p=Q.set.plan;if(!p)return"";
 const used=Math.max(0,Math.round((new Date(today()+"T12:00:00")-new Date(p.start+"T12:00:00"))/864e5)),left=Math.max(1,p.days-used),R=6236-st.n,end=dAdd(p.start,p.days-1);
 if(R<=0)return"Plan complete. Alhamdulillah.";const per=Math.ceil(R/left);
 return`Plan: finish by ${dl(end)}. ${R} ayahs left and ${left} ${left>1?"days":"day"} to go, so about ${per} ayahs a day (around ${rn(per*604/6236)} pages).`}
const tm=l=>l.at?new Date(l.at).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit",hour12:S.fm!=="24"}):"";
const hj=d=>hp(new Date(d+"T12:00:00")),hjs=d=>{const h=hj(d);return h.day+" "+HM[h.month-1]+" "+h.year};
const dl=d=>ld(new Date(d+"T12:00:00"),{weekday:"short",day:"numeric",month:"short"})+" · "+hjs(d);
const editable=d=>d>=dAdd(today(),-Q.set.edit)&&d<=today();
function entry(l,del){const ty=l.t==="mem"?"Memorizing · ":l.t==="rev"?"Revising · ":"";return`<div class="li"><span><b translate="no">${rng(l.s[0],l.s[1],l.e[0],l.e[1])}</b><br><span class="mu">${facts(l)}</span><br><span class="mu">${ty}Written at ${tm(l)}${l.note?' · “<span translate="no">'+l.note.replace(/[<>&]/g,"")+'</span>”':""}</span></span>${del?`<button class="x" type="button" data-del="${l.id}">Delete</button>`:""}</div>`}
function home(){
 const t=totals(),td=t[today()]||0,[s,a]=next(),n=abs(s,a),st=stats();
 const dl0=Q.logs.filter(l=>l.date===today()),pw=dl0.reduce((x,l)=>x+pgw(l),0);
 const wk=[...Array(7)].reduce((x,_,i)=>x+(t[dAdd(today(),-i)]||0),0);
 const mo=Object.entries(t).filter(([d])=>d.slice(0,7)===today().slice(0,7)).reduce((x,[,v])=>x+v,0);
 return`<div class="card"><div class="mu">Ayahs read today</div><div class="big">${td}</div>
 <div class="mu">${td?"About "+rn(pw)+(pw>1.05?" pages. ":" page. "):""}${td>=Q.set.min?"Today counts toward your streak.":"Read at least "+Q.set.min+" to keep your streak."}</div></div>
 <div class="qrow"><div class="card"><div class="gd" style="font-size:28px">${streak()}</div><div class="mu">day streak</div></div>
 <div class="card"><div style="font-size:28px">${wk}</div><div class="mu">last 7 days</div></div>
 <div class="card"><div style="font-size:28px">${mo}</div><div class="mu">this month</div></div></div>
 <div class="card"><div class="mu">Quran completed</div><div style="font-size:28px;font-weight:700">${rn(st.pct)}%</div><div class="bar"><i style="width:${st.pct}%"></i></div><div class="mu">${6236-st.n} ayahs left${Q.set.base||Q.logs.length?"":". Set your starting point in Progress."}</div>${Q.set.plan?`<div class="mu" style="margin-top:6px">${planInfo(st)}</div>`:""}</div>
 <div class="card"><div class="mu">Continue from</div><div class="ar">${AR[s-1]}</div><div translate="no" style="font-size:18px;font-weight:600">${pos(s,a)}</div>
 <div class="mu">Page ${pageOf(n)} of 604 · Juz ${idx(J,n)} · Hizb ${idx(H,n)}</div><br><button type="button" data-v="log">Log reading</button></div>${flash?`<p class="gd">${flash}</p>`:""}`}

function log(){
 const [s,a]=next(),tdy=today();
 const days=[...Array(Q.set.edit+1)].map((_,i)=>dAdd(tdy,-i)),pick=days.includes(logDate)?logDate:tdy;
 const recent=Q.logs.filter(l=>l.date>=days[days.length-1]).sort((x,y)=>y.at-x.at);
 return`<div class="card">
 <label for="q_dt">Day</label><select id="q_dt">${days.map((d,i)=>`<option value="${d}"${d===pick?" selected":""}>${i?dl(d):"Today"}</option>`).join("")}</select>
 <label>Start</label><div class="qrow"><select translate="no" id="q_s1" style="flex:2">${opts(s)}</select><input id="q_a1" type="number" inputmode="numeric" min="1" value="${a}" aria-label="Start ayah"></div>
 <label>End</label><div class="qrow"><select translate="no" id="q_s2" style="flex:2">${opts(s)}</select><input id="q_a2" type="number" inputmode="numeric" min="1" placeholder="Ayah" aria-label="End ayah"></div>
 <label for="q_ty">Type</label><select id="q_ty"><option value="read">Reading</option><option value="mem">Memorizing</option><option value="rev">Revising (not counted in completion)</option></select>
 <label for="q_nt">Note (optional)</label><input id="q_nt" maxlength="80" placeholder="For example: after Fajr" autocomplete="off">
 <div id="q_pv" class="mu" style="margin-top:10px;min-height:44px"></div><p id="q_er" class="err"></p><button id="q_sv" type="button">Save</button></div>
 <details class="card" open><summary>Recent entries</summary>${recent.length?recent.map(l=>entry(l,true)).join(""):'<p class="mu">Nothing logged yet. Pick where you stopped and add your end ayah.</p>'}</details>`}
function bindLog(){
 const g=id=>qs("#q_"+id),v=id=>+g(id).value;
 const mk=()=>({s:[v("s1"),v("a1")],e:[v("s2"),v("a2")]});
 const upd=()=>{const e=g("a2").value;if(!e){g("pv").textContent="";g("er").textContent="";return}
  const err=validate(v("s1"),v("a1"),v("s2"),v("a2"));g("er").textContent=err;tx(g("er"));
  if(err){g("pv").textContent="";return}
  const l=mk();l.n=count(l.s[0],l.s[1],l.e[0],l.e[1]);g("pv").innerHTML='<b translate="no">'+rng(l.s[0],l.s[1],l.e[0],l.e[1])+"</b><br>"+facts(l);tx(g("pv"))};
 ["s1","a1","s2","a2"].forEach(i=>g(i).addEventListener("input",upd));
 g("s1").addEventListener("change",()=>{if(!g("a2").value)g("s2").value=g("s1").value});
 g("sv").onclick=()=>{const err=g("a2").value?validate(v("s1"),v("a1"),v("s2"),v("a2")):"Enter the end ayah.";
  if(err){g("er").textContent=err;tx(g("er"));return}
  const l=mk(),b4=juzDone(),n4=stats().n;
  Q.logs.push({id:Date.now()+""+Math.random().toString(36).slice(2,6),date:g("dt").value,s:l.s,e:l.e,n:count(l.s[0],l.s[1],l.e[0],l.e[1]),t:g("ty").value,note:g("nt").value.trim(),at:Date.now()});
  const nw=[...juzDone()].filter(x=>!b4.has(x));
  flash=stats().n>=6236&&n4<6236?"Khatma complete. Alhamdulillah.":nw.length?"Saved. Juz "+nw.join(", ")+" complete.":"Saved.";
  logDate=null;qsave();go("home")};
 bindDel()}
function bindDel(){root.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{Q.logs=Q.logs.filter(l=>l.id!==b.dataset.del);qsave();draw()})}

function hmr(y,m,dim){const a=hp(new Date(y,m,1,12)),b=hp(new Date(y,m,dim,12));
 return a.month===b.month&&a.year===b.year?HM[a.month-1]+" "+a.year:HM[a.month-1]+(a.year!==b.year?" "+a.year:"")+" – "+HM[b.month-1]+" "+b.year}
function calendar(){
 const y=cal.getFullYear(),m=cal.getMonth(),ym=y+"-"+pad(m+1),t=totals(),first=new Date(y,m,1).getDay(),dim=new Date(y,m+1,0).getDate(),min=Q.set.min;
 if(!sel||sel.slice(0,7)!==ym)sel=today().slice(0,7)===ym?today():null;
 let h=["Sa","Su","Mo","Tu","We","Th","Fr"].map(d=>`<div class="qhd">${d}</div>`).join("")+"<div></div>".repeat((first+1)%7),days=0,tot=0;
 for(let d=1;d<=dim;d++){const k=ym+"-"+pad(d),n=t[k]||0;if(n>=min)days++;tot+=n;
  const c=n>=min*8?"l3":n>=min*3?"l2":n>=min?"l1":n?"some":"";
  h+=`<button type="button" class="qd ${c}${k===today()?" today":""}${k===sel?" sel":""}" data-day="${k}" aria-label="${dl(k)}: ${n} ayahs"><span>${hj(k).day}</span><small class="qh">${d}</small>${n?`<small>${n}</small>`:""}</button>`}
 let det="";
 if(sel){const ls=Q.logs.filter(l=>l.date===sel).sort((x,y)=>x.at-y.at),pgs=new Set();
  ls.forEach(l=>{for(let p=pageOf(abs(l.s[0],l.s[1]));p<=pageOf(abs(l.e[0],l.e[1]));p++)pgs.add(p)});
  det=`<div class="card"><b>${dl(sel)}</b>${ls.length?`<div class="mu">${t[sel]} ayahs · ${pgs.size} ${pgs.size>1?"pages":"page"} touched</div>${ls.map(l=>entry(l,editable(sel))).join("")}`:'<p class="mu">Nothing logged on this day.</p>'}${editable(sel)?`<br><button type="button" class="sec" data-logday="${sel}">Log reading for this day</button>`:""}</div>`}
 return`<div class="qrow" style="margin-bottom:10px"><button class="sec" type="button" id="q_pm" aria-label="Previous month" style="flex:0 0 52px">‹</button><b style="text-align:center">${hmr(y,m,dim)}<br><span class="mu" style="font-weight:400">${ld(cal,{month:"long",year:"numeric"})}</span></b><button class="sec" type="button" id="q_nm" aria-label="Next month" style="flex:0 0 52px">›</button></div>
 <div class="card"><div class="qcal">${h}</div><div class="mu" style="margin-top:10px">${days} days read · ${tot} ayahs. Big number = Hijri day, small number = date. Darker boxes mean more ayahs. Tap a day for details.</div></div>${det}`}
function bindCal(){
 qs("#q_pm").onclick=()=>{cal=new Date(cal.getFullYear(),cal.getMonth()-1,1);draw()};
 qs("#q_nm").onclick=()=>{cal=new Date(cal.getFullYear(),cal.getMonth()+1,1);draw()};
 root.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{sel=b.dataset.day;draw()});
 root.querySelectorAll("[data-logday]").forEach(b=>b.onclick=()=>{logDate=b.dataset.logday;go("log")});
 bindDel()}

function ref(){
 const st=stats(),[s,a]=next(),cur=idx(J,abs(s,a)),f=p=>p[0]+":"+p[1],pg=p=>pageOf(abs(p[0],p[1])),bs=Q.set.base||0,p=Q.set.plan;
 const bsp=bs?fromAbs(bs):null;
 return`<div class="card"><div class="mu">Quran completed</div><div class="big">${rn(st.pct)}%</div><div class="bar"><i style="width:${st.pct}%"></i></div>
 <div class="mu">${st.n} of 6236 ayahs done · ${6236-st.n} left. Revising and re-reading are not counted here.</div><div class="mu" style="margin-top:6px">Best streak: ${bestStreak()} days · Current: ${streak()}</div></div>
 <details class="card" open><summary>Starting point</summary><p class="mu">Already read part of the Quran before using this app? Set where you reached. Everything before it counts as done.${bsp?" Now: up to "+pos(bsp[0],bsp[1])+".":""}</p>
 <div class="qrow"><select translate="no" id="q_bs" style="flex:2">${opts(bsp?bsp[0]:1)}</select><input id="q_ba" type="number" inputmode="numeric" min="1" placeholder="Ayah" value="${bsp?bsp[1]:""}" aria-label="Last ayah read"></div>
 <p id="q_be" class="err"></p><div class="qrow"><button type="button" id="q_bset">Save starting point</button><button type="button" class="sec" id="q_bclr">Clear</button></div></details>
 <details class="card" open><summary>Finish plan</summary><p class="mu">${p?planInfo(st):"Choose how many days you want to take to finish the Quran. Use 30 for Ramadan."}</p>
 <label for="q_pd">Days to finish</label><input id="q_pd" type="number" inputmode="numeric" min="1" max="1000" value="${p?p.days:30}">
 <br><br><div class="qrow"><button type="button" id="q_pset">${p?"Restart plan today":"Start plan today"}</button>${p?'<button type="button" class="sec" id="q_pclr">Remove plan</button>':""}</div></details>
 <details class="card" open><summary>Juz progress</summary><div class="jg">${st.jf.map((fr,i)=>`<div class="${fr>=.6?"dk":""}" style="background:color-mix(in srgb,var(--ac) ${Math.round(fr*100)}%,var(--card))"><b>${i+1}</b><small>${Math.floor(fr*100)}%</small></div>`).join("")}</div></details>
 <details class="card" open><summary>Juz and hizb</summary><p class="mu">Where each part starts. Your next ayah is in juz ${cur}. Pages follow the 604-page Madinah mushaf.</p>
 <div style="overflow-x:auto"><table><tr><th>Juz</th><th>Starts</th><th>Page (of 604)</th><th>Hizb</th></tr>${J.map((p,i)=>`<tr class="${i+1===cur?"cur":""}"><td>${i+1}</td><td>${f(p)}</td><td>${pg(p)}</td><td>${2*i+1}, ${2*i+2} (${f(H[2*i+1])})</td></tr>`).join("")}</table></div></details>`}
function bindRef(){
 qs("#q_bset").onclick=()=>{const s=+qs("#q_bs").value,a=+qs("#q_ba").value;
  if(!Number.isInteger(a)||a<1||a>C[s-1]){qs("#q_be").textContent=N[s-1]+" has "+C[s-1]+" ayahs. Enter a number from 1 to "+C[s-1]+".";tx(qs("#q_be"));return}
  Q.set.base=abs(s,a);qsave();draw()};
 qs("#q_bclr").onclick=()=>{Q.set.base=0;qsave();draw()};
 qs("#q_pset").onclick=()=>{const d=Math.max(1,Math.min(1000,Math.round(+qs("#q_pd").value)||30));Q.set.plan={days:d,start:today()};qsave();draw()};
 const pc=qs("#q_pclr");if(pc)pc.onclick=()=>{Q.set.plan=null;qsave();draw()}}

function settings(){const s=Q.set;
 return`<details class="card" open><summary>Streak and entries</summary>
 <label for="q_mn">Daily minimum (ayahs) to keep the streak</label><input id="q_mn" type="number" min="1" value="${s.min}">
 <label for="q_gr">Grace day (one missed day per week is forgiven)</label><select id="q_gr"><option value="1"${s.grace?" selected":""}>On</option><option value="0"${s.grace?"":" selected"}>Off</option></select>
 <label for="q_ed">Days you can add or delete entries</label><select id="q_ed"><option${s.edit===3?" selected":""}>3</option><option${s.edit===7?" selected":""}>7</option></select></details>
 <details class="card" open><summary>Reminders</summary><p class="mu">Use Tools, then Reminders, to set a reading reminder, for example 10 minutes after Fajr with the label Read Quran.</p></details>
 <details class="card" open><summary>Backup</summary><p class="mu">Quran data is saved only on this phone. Copy it somewhere safe, and paste it back to restore.</p>
 <textarea translate="no" id="q_bk" aria-label="Backup data">${JSON.stringify(Q)}</textarea><br><br><div class="qrow"><button class="sec" id="q_cb" type="button">Copy backup</button><button id="q_rs" type="button">Restore from text</button></div><p id="q_er" class="err"></p></details>`}
function bindSet(){
 const sv=()=>{Q.set=Object.assign({},Q.set,{min:Math.max(1,+qs("#q_mn").value||1),grace:qs("#q_gr").value==="1",edit:+qs("#q_ed").value});qsave()};
 ["q_mn","q_gr","q_ed"].forEach(i=>qs("#"+i).addEventListener("change",sv));
 qs("#q_cb").onclick=async e=>{try{await navigator.clipboard.writeText(qs("#q_bk").value)}catch(x){qs("#q_bk").select();try{document.execCommand("copy")}catch(_){}}e.target.textContent="Copied";tx(e.target)};
 qs("#q_rs").onclick=()=>{try{const o=JSON.parse(qs("#q_bk").value);if(!Array.isArray(o.logs)||!o.set)throw 0;setQ(o);qsave();flash="Restored.";go("home")}catch(e){qs("#q_er").textContent="That text is not a valid backup.";tx(qs("#q_er"))}}}
let lt="";
export function show(){if(!cal)cal=new Date(today()+"T12:00:00");flash="";anim=true;lt=today();draw()}
const redraw=()=>{if(cal)draw()};
const tick=()=>{const t=today();if(t!==lt){lt=t;if(ui.tab==="quran")draw()}};
on('lang',redraw);on('render',tick);
