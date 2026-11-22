import {S,save} from '../../core/store.js';
import {iso} from '../../core/dom.js';
import {eff} from '../../core/prayer.js';
import {J,JE,JS,abs,fromAbs} from './math.js';
const def=()=>({logs:[],set:{min:1,grace:true,edit:7}});
export let Q=S.q&&Array.isArray(S.q.logs)&&S.q.set?S.q:(S.q=def());
Q.set=Object.assign(def().set,Q.set);
let memo={};
export function setQ(o){Q=S.q=o;memo={}}
function qsave(){memo={};S.q=Q;save()}
const today=()=>iso(eff()); // the day turns over at Maghrib, like everywhere else in the app
const dAdd=(s,n)=>{const d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return iso(d)};
const totals=()=>memo.t||(memo.t=Q.logs.reduce((t,l)=>(t[l.date]=(t[l.date]||0)+l.n,t),{}));
function next(){ // position after the most recently saved log
 if(!Q.logs.length)return[1,1];const l=Q.logs.reduce((a,b)=>b.at>a.at?b:a);
 const n=abs(l.e[0],l.e[1])+1;return n>6236?[1,1]:fromAbs(n)}
function streak(){
 const t=totals(),min=Q.set.min,ds=Object.keys(t).sort();if(!ds.length)return 0;
 let d=today();if((t[d]||0)<min)d=dAdd(d,-1);
 let k=0,cool=0;
 while(d>=ds[0]){
  if((t[d]||0)>=min)k++;else if(Q.set.grace&&cool===0)cool=8;else break;
  if(cool>0)cool--;d=dAdd(d,-1)}
 return k}
function cover(){const c=new Uint8Array(6238);for(let i=1;i<=Math.min(Q.set.base||0,6236);i++)c[i]=1;
 Q.logs.forEach(l=>{if(l.t==="rev")return;const x=abs(l.s[0],l.s[1]),y=abs(l.e[0],l.e[1]);for(let i=x;i<=y;i++)c[i]=1});return c}
function stats(){if(memo.s)return memo.s;const c=cover();let n=0;for(let i=1;i<=6236;i++)n+=c[i];
 const jf=J.map((_,k)=>{let m=0;for(let i=JS[k];i<=JE[k];i++)m+=c[i];return m/(JE[k]-JS[k]+1)});return memo.s={n,pct:n/6236*100,jf}}
const juzDone=()=>new Set(stats().jf.map((f,i)=>f>=1?i+1:0).filter(Boolean));
function bestStreak(){const t=totals(),ds=Object.keys(t).sort();if(!ds.length)return 0;let run=0,best=0;
 for(let d=ds[0];d<=today();d=dAdd(d,1)){if((t[d]||0)>=Q.set.min){run++;best=Math.max(best,run)}else run=0}return best}
export {qsave,today,dAdd,totals,next,streak,cover,stats,juzDone,bestStreak};
