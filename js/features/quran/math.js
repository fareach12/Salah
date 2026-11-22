import {C,HQ,N,PG} from './data.js';
const CUM=[0];C.forEach((c,i)=>CUM.push(CUM[i]+c));
const abs=(s,a)=>CUM[s-1]+a;
const fromAbs=n=>{let s=1;while(s<114&&CUM[s]<n)s++;return[s,n-CUM[s-1]]};
const idx=(L,n)=>{let r=1;L.forEach((p,i)=>{if(abs(p[0],p[1])<=n)r=i+1});return r};
const H=[...Array(60)].map((_,k)=>fromAbs(HQ[4*k+1]));
const J=H.filter((_,i)=>i%2===0);
const pageOf=n=>{let lo=1,hi=604;while(lo<hi){const m=(lo+hi+1)>>1;if(PG[m]<=n)lo=m;else hi=m-1}return lo};
const rn=x=>String(Math.round(x*10)/10);
const pgw=l=>{const x=abs(l.s[0],l.s[1]),y=abs(l.e[0],l.e[1]);let f=0;for(let p=pageOf(x);p<=pageOf(y);p++){const lo=Math.max(x,PG[p]),hi=Math.min(y,PG[p+1]-1);f+=(hi-lo+1)/(PG[p+1]-PG[p])}return f};
const rng=(s,a,e,b)=>s===e?N[s-1]+" "+s+":"+a+(b>a?"–"+b:""):N[s-1]+" "+s+":"+a+" → "+N[e-1]+" "+e+":"+b;
const facts=l=>{const p1=pageOf(abs(l.s[0],l.s[1])),p2=pageOf(abs(l.e[0],l.e[1]));return l.n+" ayahs · Page "+p1+(p2>p1?"–"+p2:"")+" of 604 · about "+rn(pgw(l))+(pgw(l)>1.05?" pages":" page")+" · Juz "+span(J,...l.s,...l.e)+" · Hizb "+span(H,...l.s,...l.e)};
const validate=(s1,a1,s2,a2)=>{
 for(const[s,a]of[[s1,a1],[s2,a2]]){if(!Number.isInteger(a)||a<1)return"Enter a whole ayah number.";if(a>C[s-1])return N[s-1]+" has only "+C[s-1]+" ayahs.";}
 if(abs(s2,a2)<abs(s1,a1))return"The end must come after the start.";return""};
const count=(s1,a1,s2,a2)=>abs(s2,a2)-abs(s1,a1)+1;
const span=(L,s1,a1,s2,a2)=>{const x=idx(L,abs(s1,a1)),y=idx(L,abs(s2,a2));return x===y?""+x:x+"–"+y};
const JS=J.map(p=>abs(p[0],p[1])),JE=J.map((p,i)=>i<29?JS[i+1]-1:6236);
export {abs,fromAbs,idx,H,J,JS,JE,pageOf,rn,pgw,rng,facts,validate,count,span};
