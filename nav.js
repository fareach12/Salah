import {emit} from './bus.js';
import {tabEls,tx} from './i18n.js';
import {$} from './dom.js';
export const ui={tab:'home'};
const NB=[...document.querySelectorAll('#nav button')];
export function showTab(t){ui.tab=t;emit('tab',t);
 tabEls().forEach(k=>{k.style.display=k.dataset.tab===t?'':'none'});
 NB.forEach(b=>b.classList.toggle('on',b.dataset.t===t));tx();scrollTo(0,0)}
$('nav').addEventListener('click',e=>{const b=e.target.closest('button');if(b)showTab(b.dataset.t)});
