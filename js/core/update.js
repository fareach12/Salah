import {tx} from './i18n.js';
// "New version available" banner. The service worker downloads a new version in the background and takes over by itself;
// the page that is already open keeps running the old code, so this tells the person to refresh once.
let shown=false,gone=false;
function banner(){if(shown||gone)return;shown=true;
 const b=document.createElement('div'),t=document.createElement('button'),x=document.createElement('button');
 b.setAttribute('role','status');
 b.style.cssText='position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:98;max-width:456px;margin:0 auto;display:flex;align-items:center;gap:8px;padding:12px 14px;border-radius:14px;background:var(--ac);color:var(--on);font-weight:600;box-shadow:0 4px 16px #0006';
 t.type='button';t.style.cssText='flex:1;text-align:start;background:none;border:0;color:inherit;font:inherit;padding:0;cursor:pointer';
 t.innerHTML='<div>New version available</div><div style="font-size:.8rem;font-weight:400;opacity:.9">Tap to refresh</div>';
 t.onclick=()=>location.reload();
 x.type='button';x.textContent='\u2715';x.setAttribute('aria-label','Dismiss');x.style.cssText='flex:none;background:none;border:0;color:inherit;font:inherit;padding:4px 8px;cursor:pointer;opacity:.85';
 x.onclick=()=>{gone=true;b.remove()};
 b.append(t,x);document.body.appendChild(b);tx(b)}
export function watchUpdates(){
 if(!('serviceWorker' in navigator))return;
 const had=!!navigator.serviceWorker.controller; // false on the very first visit: nothing to update yet
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had)banner()});
 addEventListener('load',()=>navigator.serviceWorker.register('sw.js').then(reg=>{
  let last=Date.now();const chk=()=>{last=Date.now();try{reg.update().catch(()=>{})}catch(e){}};
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-last>6e5)chk()}); // coming back to the app: look for a new version
  setInterval(()=>{if(!document.hidden)chk()},18e5); // and every 30 minutes while it stays open
 }).catch(()=>{}));
}
