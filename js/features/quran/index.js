import {on} from '../../core/bus.js';
// The Quran tab is a normal tab of the app; its code loads the first time the tab opens.
on('tab',t=>{if(t==='quran')import('./ui.js').then(m=>m.show())});
