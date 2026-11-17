/* Shared behaviour for inner pages */
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lang = document.documentElement.lang === 'he' ? 'he' : 'en';
try { localStorage.setItem('adx-lang', lang); } catch(e){}
const WA = '19179758217';

/* nav */
const nav = document.getElementById('nav'); let lastY = 0;
addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('hide', y > lastY && y > 300 && !document.body.classList.contains('menu-open')); lastY = y; }, {passive:true});
const burger = document.querySelector('.burger');
burger.addEventListener('click', () => { const o = document.body.classList.toggle('menu-open'); burger.setAttribute('aria-expanded', o); });
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.1, rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
requestAnimationFrame(() => setTimeout(() => document.body.classList.add('ready'), 60));

/* card glow */
document.querySelectorAll('.feat>div').forEach(el => el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx',(e.clientX-r.left)+'px'); el.style.setProperty('--my',(e.clientY-r.top)+'px'); }));

/* steps progress */
const steps = [...document.querySelectorAll('.isteps')];
const upd = () => steps.forEach(s => { const r = s.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight*.8 - r.top) / (r.height + innerHeight*.3))); s.style.setProperty('--p', p); const it = s.querySelectorAll('.istep'); it.forEach((x,i) => x.classList.toggle('lit', p >= i/it.length + .02)); });
addEventListener('scroll', upd, {passive:true}); upd();

/* spotlight headline */
document.querySelectorAll('.spot').forEach(el => {
  if (reduce) return;
  let tx=.5,ty=.5,x=.5,y=.5,r=0,tr=0;
  el.addEventListener('pointermove', e => { const b = el.getBoundingClientRect(); tx=(e.clientX-b.left)/b.width; ty=(e.clientY-b.top)/b.height; tr=1; });
  el.addEventListener('pointerleave', () => tr=0);
  (function loop(){ const s=Math.max(150, el.offsetHeight*.6); x+=(tx-x)*.1; y+=(ty-y)*.1; r+=(tr*s-r)*.09; el.style.setProperty('--mx',x*100+'%'); el.style.setProperty('--my',y*100+'%'); el.style.setProperty('--r',r+'px'); requestAnimationFrame(loop); })();
});

/* forms -> WhatsApp, then thank-you page */
document.querySelectorAll('form[data-wa]').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  const lines = [f.dataset.wa, ''];
  f.querySelectorAll('[data-q]').forEach(el => {
    let v = '';
    if (el.matches('.needs,.qopts')) v = [...el.querySelectorAll('input:checked')].map(i => i.value).join(', ');
    else v = el.value.trim();
    if (v) lines.push(el.dataset.q + ': ' + v);
  });
  const text = lines.join('\n');
  if (lang === 'he') window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  else location.href = 'mailto:info@adverix.co?subject=' + encodeURIComponent(f.dataset.wa) + '&body=' + encodeURIComponent(text);
  setTimeout(() => { location.href = f.dataset.thanks; }, 600);
}));

/* filter chips (work + blog) */
document.querySelectorAll('[data-filter]').forEach(group => {
  const target = document.querySelector(group.dataset.filter);
  group.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    group.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    target.querySelectorAll('[data-cat]').forEach(c => c.hidden = b.dataset.v !== 'all' && !c.dataset.cat.split(' ').includes(b.dataset.v));
  }));
});

/* cursor */
const cur = document.querySelector('.cur');
if (cur && matchMedia('(hover:hover)').matches && !reduce) {
  let cx=0,cy=0,x=0,y=0;
  addEventListener('pointermove', e => { cx=e.clientX; cy=e.clientY; cur.style.opacity=1; });
  document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a,button,summary,label')));
  (function loop(){ x+=(cx-x)*.2; y+=(cy-y)*.2; cur.style.transform=`translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
}
})();
