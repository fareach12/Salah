// One store for the whole app (prayer settings, reminders, saved people and the Quran log).
const QK='salah.quran.v1'; // legacy separate Quran key, migrated below
const S={city:'Borama (Awdal)',lat:9.9361,lng:43.1828,me:'MWL',as:1,fm:'12'};
try{Object.assign(S,JSON.parse(localStorage.getItem('pt')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('pt',JSON.stringify(S))}catch(e){}};
const M={MWL:[18,17],ISNA:[15,15],Egypt:[19.5,17.5],Makkah:[18.5,'90'],Karachi:[18,18]};
const THEMES=['auto','light','sand','dark','midnight','amethyst','espresso','black'];
import {CT} from '../data/cities.js';
if(S.tz===undefined){const c=CT.find(x=>x.n===S.city&&Math.abs(x.a-S.lat)<.02&&Math.abs(x.b-S.lng)<.02);S.tz=c?c.z:''} // older saved settings: take the zone of the saved city
if(!M[S.me])S.me='MWL';
if(!THEMES.includes(S.th))S.th='auto';
S.adj=S.adj||{};S.iq=S.iq||{Fajr:20,Dhuhr:15,Asr:15,Maghrib:5,Isha:15};S.rem=S.rem||[];S.rf=S.rf||{};S.ad=S.ad||{};S.af=S.af||{};S.adf=S.adf||'';
try{const o=localStorage.getItem(QK);if(o){if(!S.q)S.q=JSON.parse(o);localStorage.setItem('pt',JSON.stringify(S));localStorage.removeItem(QK)}}catch(e){}
export {S,save,M,THEMES};
