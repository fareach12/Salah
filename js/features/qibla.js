import {atan2,cos,fa,sin} from '../core/prayer.js';
import {S} from '../core/store.js';
import {$} from '../core/dom.js';
import {on} from '../core/bus.js';
let hd=null,rot=null;
const diff=(a,b)=>((a-b+540)%360+360)%360-180; // shortest signed turn from b to a, in degrees
const PTS=['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
function qUpd(){const q=fa(atan2(sin(39.8262-S.lng)*cos(21.4225),cos(S.lat)*sin(21.4225)-sin(S.lat)*cos(21.4225)*cos(39.8262-S.lng)));
 $('qd').textContent=Math.round(q)+'\u00b0 \u00b7 '+PTS[Math.round(q/22.5)%16];
 const t=hd===null?q:q-hd;rot=rot===null?t:rot+diff(t,rot); // keep turning the short way, never a full spin at 0/360
 $('arr').style.transform='rotate('+rot.toFixed(1)+'deg)';
 if(hd!==null)$('qh').textContent='Turn until the Kaaba icon points straight up.';else if(!$('qh').textContent)$('qh').textContent='Showing the direction from north. Enable the compass to point your phone.'}
$('qc').onclick=async()=>{try{if(typeof DeviceOrientationEvent!=='undefined'&&DeviceOrientationEvent.requestPermission){const r=await DeviceOrientationEvent.requestPermission();if(r!=='granted'){$('qh').textContent='Compass permission was denied.';return}}
 const h=e=>{let v=e.webkitCompassHeading;if(v==null&&e.alpha!=null&&(e.absolute||e.type==='deviceorientationabsolute'))v=360-e.alpha;if(v!=null){if(hd===null)hd=v;else{const d=diff(v,hd);if(Math.abs(d)<1.5)return;hd=((hd+d*.25)%360+360)%360}qUpd()}};
 addEventListener('deviceorientationabsolute',h,true);addEventListener('deviceorientation',h,true);
 $('qc').style.display='none';setTimeout(()=>{if(hd===null)$('qh').textContent='No compass data. Open this page directly in your phone browser, not in a preview.'},2500)}catch(x){$('qh').textContent='Compass is not available here.'}};
if(typeof DeviceOrientationEvent==='undefined')$('qc').style.display='none';
on('render',qUpd);
