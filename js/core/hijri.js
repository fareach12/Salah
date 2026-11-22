import {S} from './store.js';
import {addDays} from './dom.js';
const HM=['Muharram','Safar','Rabiʻ I','Rabiʻ II','Jumada I','Jumada II','Rajab','Shaʻban','Ramadan','Shawwal','Dhu al-Qiʻdah','Dhu al-Hijjah'];
const hf=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric'});
const HC=new Map();
const hp=d=>{const e=S.ha?addDays(d,S.ha):d,k=e.getFullYear()*10000+e.getMonth()*100+e.getDate();let o=HC.get(k);
 if(!o){o={};hf.formatToParts(e).forEach(p=>o[p.type]=parseInt(p.value));HC.set(k,o)}return o};
function h2g(y,m,d){const tv=y*1e4+m*100+d;let g=new Date(Math.round(y*.970229+621.574),0,1,12);
 for(let i=0;i<60;i++){const c=hp(g);if(c.year*1e4+c.month*100+c.day===tv)return g;let st=Math.round(((y-c.year)*12+(m-c.month))*29.5306+(d-c.day));if(!st)st=tv>c.year*1e4+c.month*100+c.day?1:-1;g=addDays(g,st)}return null}
const EV=[[1,1,'Islamic New Year'],[1,10,'Day of Ashura'],[9,1,'Ramadan begins'],[10,1,'Eid al-Fitr'],[12,9,'Day of Arafah'],[12,10,'Eid al-Adha']];
function scanEv(td){const out=[],got={};let white=null;
 const tn=new Date(td.getFullYear(),td.getMonth(),td.getDate(),12),h0=hp(td);let s=addDays(tn,-(h0.day-1));
 for(let k=0;k<14;k++){const m=(h0.month-1+k)%12+1;
  const at=D=>{const d=addDays(s,D-1);return{d:d,i:Math.round((d-tn)/864e5)}};
  EV.forEach((e,j)=>{if(!got[j]&&e[0]===m){const x=at(e[1]);if(x.i>=0){got[j]=1;out.push({n:e[2],d:x.d,i:x.i})}}});
  if(white===null){const x=at(13);if(x.i>=0)white=x.i}
  let s2=addDays(s,29);if(hp(s2).day!==1)s2=addDays(s,30);s=s2}
 out.sort((a,b)=>a.i-b.i);return{out,white}}
export {HM,hp,h2g,scanEv};
