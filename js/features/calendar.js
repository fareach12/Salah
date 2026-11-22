import {HM,hp} from '../core/hijri.js';
import {$,addDays} from '../core/dom.js';
import {clk,eff} from '../core/prayer.js';
import {on} from '../core/bus.js';
let anchor=new Date(),lastDay='';
function renderCal(){
 const h=hp(anchor),start=addDays(anchor,-(h.day-1)),days=[];
 for(let i=0;i<31;i++){const d=addDays(start,i);if(hp(d).month!==h.month)break;days.push(d)}
 $('mt').textContent=`${HM[h.month-1]} ${h.year}`;
 const today=addDays(new Date(),clk.hOff),tk=today.toDateString();
 let html=['Sa','Su','Mo','Tu','We','Th','Fr'].map(x=>`<div class="dn">${x}</div>`).join('');
 html+='<div></div>'.repeat((days[0].getDay()+1)%7);
 html+=days.map((d,i)=>`<div class="d${d.toDateString()===tk?' t':''}">${i+1}<small>${d.getDate()}</small></div>`).join('');
 $('cal').innerHTML=html}
$('pv').onclick=()=>{const h=hp(anchor);anchor=addDays(anchor,-h.day);renderCal()};
$('nx').onclick=()=>{const h=hp(anchor);anchor=addDays(anchor,31-h.day);renderCal()};
on('render',()=>{const dk=new Date().toDateString()+clk.hOff;if(dk!==lastDay){lastDay=dk;anchor=eff();renderCal()}});
on('lang',renderCal);on('hijri',renderCal);
