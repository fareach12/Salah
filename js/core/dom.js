export const $=id=>document.getElementById(id);
export const pad=n=>String(n).padStart(2,'0');
export const addDays=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n,12);
export const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
