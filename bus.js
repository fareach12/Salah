// Tiny pub/sub so features never import each other.
// Events: render (every tick/state change) · tab (tab shown) · lang (language changed) · hijri (Hijri adjustment changed)
const h={};
export const on=(e,f)=>(h[e]||(h[e]=[])).push(f);
export const emit=(e,a)=>(h[e]||[]).forEach(f=>f(a));
