// Bump VERSION on every release: old caches are deleted on activate.
const VERSION='salah-v11';
const SHELL=[
  "./css/base.css",
  "./css/home.css",
  "./css/layout.css",
  "./css/quran.css",
  "./css/theme.css",
  "./css/tools.css",
  "./index.html",
  "./js/core/bus.js",
  "./js/core/dom.js",
  "./js/core/hijri.js",
  "./js/core/i18n.js",
  "./js/core/nav.js",
  "./js/core/prayer.js",
  "./js/core/render.js",
  "./js/core/store.js",
  "./js/data/cities.js",
  "./js/features/adhan.js",
  "./js/features/age.js",
  "./js/features/calendar.js",
  "./js/features/home.js",
  "./js/features/qibla.js",
  "./js/features/quran/data.js",
  "./js/features/quran/index.js",
  "./js/features/quran/math.js",
  "./js/features/quran/state.js",
  "./js/features/quran/ui.js",
  "./js/features/reminders.js",
  "./js/features/settings.js",
  "./js/features/timetable.js",
  "./js/main.js",
  "./manifest.json",
  "./icon-192.png",
  "./audio/adhan.mp3"
];
self.addEventListener('install',e=>{
  // addAll is atomic; the optional files are added one by one so a missing icon or adhan file never blocks install
  e.waitUntil(caches.open(VERSION).then(async c=>{
    await c.addAll(SHELL.filter(u=>!/manifest|icon-|audio\//.test(u)));
    await Promise.all(SHELL.filter(u=>/manifest|icon-|audio\//.test(u)).map(u=>c.add(u).catch(()=>{})));
  }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==VERSION).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
// Cache first, refresh in the background (stale-while-revalidate); offline navigations fall back to the shell.
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res.ok)caches.open(VERSION).then(c=>c.put(r,res.clone()));return res}).catch(()=>hit||(r.mode==='navigate'?caches.match('./index.html'):undefined));
    return hit||net;
  }));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window'}).then(w=>w.length?w[0].focus():self.clients.openWindow('./')));
});
