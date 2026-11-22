import {M,S} from './store.js';
import {hp} from './hijri.js';
import {addDays} from './dom.js';
const R=Math.PI/180,sin=x=>Math.sin(x*R),cos=x=>Math.cos(x*R),tan=x=>Math.tan(x*R);
const asin=x=>Math.asin(x)/R,acos=x=>Math.acos(x)/R,acot=x=>Math.atan(1/x)/R,atan2=(y,x)=>Math.atan2(y,x)/R;
const fa=a=>((a%360)+360)%360,fh=h=>((h%24)+24)%24;
function sun(jd){const D=jd-2451545,g=fa(357.529+.98560028*D),q=fa(280.459+.98564736*D),
L=fa(q+1.915*sin(g)+.02*sin(2*g)),e=23.439-3.6e-7*D,RA=fh(atan2(cos(e)*sin(L),cos(L))/15);
return{d:asin(sin(e)*sin(L)),eq:q/15-RA}}

function calc0(date){
 const{lat,lng}=S,[fj,ish]=M[S.me],tz=-new Date(date.getFullYear(),date.getMonth(),date.getDate(),12).getTimezoneOffset()/60; // offset at noon: correct on daylight-saving change days
 const jd0=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/864e5+2440587.5-lng/360;
 const noon=t=>fh(12-sun(jd0+t).eq);
 const ang=(a,t,ccw)=>{const s=sun(jd0+t),v=acos((-sin(a)-sin(s.d)*sin(lat))/(cos(s.d)*cos(lat)))/15;
  return noon(t)+(ccw?-v:v)};
 const asr=(t)=>{const s=sun(jd0+t);return ang(-acot(S.as+tan(Math.abs(lat-s.d))),t)};
 const adj=h=>h+tz-lng/15;
 const mg0=adj(ang(.833,18/24)),mg=Math.ceil(mg0*60-1e-7)/60; // Maghrib rounded UP to a whole minute so iftar is never shown early
 const T={Fajr:adj(ang(fj,5/24,1)),Sunrise:adj(ang(.833,6/24,1)),Dhuhr:adj(noon(.5))+1/60,
  Asr:adj(asr(15/24)),Maghrib:mg,Isha:ish==='90'?mg+(hp(addDays(date,1)).month===9?2:1.5):adj(ang(ish,18/24))};
 const nl=fh(T.Sunrise-T.Maghrib),lim=a=>a/60*nl;
 {const d=fh(T.Sunrise-T.Fajr);if(isNaN(d)||d>lim(fj))T.Fajr=T.Sunrise-lim(fj)}
 if(ish!=='90'){const d=fh(T.Isha-T.Maghrib);if(isNaN(d)||d>lim(ish))T.Isha=T.Maghrib+lim(ish)}
 return T}

// calc() is cached per day: render, timetable and reminders all ask for the same days again and again
const CK={};let ckSig='';
function calc(date){const sig=S.lat+','+S.lng+','+S.me+','+S.as+','+(S.ha||0);
 if(sig!==ckSig||Object.keys(CK).length>120){ckSig=sig;for(const k in CK)delete CK[k]}
 const k=date.getFullYear()*372+date.getMonth()*31+date.getDate();return CK[k]||(CK[k]=calc0(date))}
const toDate=(base,h)=>isNaN(h)?null:new Date(base.getFullYear(),base.getMonth(),base.getDate(),0,0,Math.round(h*3600));
const fmt=d=>{if(!d)return'—';let h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0');
 if(S.fm==='24')return String(h).padStart(2,'0')+':'+m;const p=h<12?'AM':'PM';h=h%12||12;return h+':'+m+' '+p};
const pt=(d,n)=>toDate(d,calc(d)[n]+(S.adj[n]||0)/60); // prayer n on day d, with the user's minute adjustments
const lab=(n,d)=>n==='Dhuhr'&&d&&d.getDay()===5?'Jumu’ah':n;
export const clk={hOff:0}; // 1 after Maghrib: the Islamic day has already turned over
const eff=()=>addDays(new Date(),clk.hOff);
export {calc,fmt,pt,eff,lab,fa,atan2,sin,cos};
