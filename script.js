const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Remove navigation controls and visible section numbering while preserving the archive flow.
document.querySelectorAll('.section-number, .section-next').forEach((element) => element.remove());

// Restore the horizontal editorial composition and use the unused canvas for extra information layers.
const styleMeta = {
  brutalism: ['HARD EDGES', 'RAW MATERIAL', 'DIRECT IMPACT'],
  maximalism: ['COLOR STACK', 'VISUAL EXCESS', 'MORE IS MORE'],
  minimalism: ['NEGATIVE SPACE', 'QUIET SYSTEMS', 'LESS / BETTER'],
  glassmorphism: ['LIGHT LAYERS', 'DEPTH + BLUR', 'TRANSPARENT UI'],
  skeuomorphism: ['TACTILE UI', 'FAMILIAR OBJECTS', 'PRESS / FEEL'],
  neobrutalism: ['BOLD BORDERS', 'FRIENDLY CHAOS', 'UTILITY + JOY'],
  y2k: ['CHROME FUTURE', 'PIXEL MEMORY', 'LOADING...'],
  editorial: ['TYPE AS VOICE', 'VISUAL RHYTHM', 'CULTURE / FORM'],
  organic: ['SOFT SYSTEMS', 'NATURAL MOTION', 'GROW / FLOW'],
  cyberpunk: ['SIGNAL / NOISE', 'ACCESS GRANTED', 'BREAK THE GRID'],
  aurora: ['LIGHT FIELD', 'SLOW WONDER', 'DREAM IN COLOR'],
  index: ['12 LANGUAGES', 'ONE CANVAS', 'CHOOSE A MOOD']
};

document.querySelectorAll('.style-section').forEach((section) => {
  const key = section.dataset.style;
  const meta = styleMeta[key] || [];
  const grid = section.querySelector('.section-grid');
  if (!grid || !meta.length) return;
  const detailRail = document.createElement('div');
  detailRail.className = 'style-detail-rail reveal';
  detailRail.innerHTML = meta.map((item, index) => `<span><b>0${index + 1}</b>${item}</span>`).join('');
  section.appendChild(detailRail);
  const trace = document.createElement('div');
  trace.className = 'style-trace';
  trace.innerHTML = `<span>${key.toUpperCase()} / VISUAL STUDY</span><i></i><span>SCROLL TO OBSERVE</span>`;
  section.appendChild(trace);
});

const visualFixes = document.createElement('style');
visualFixes.textContent = `
  .style-section { isolation: isolate; }
  .style-section .section-grid { grid-template-columns: 9% minmax(0, 47%) minmax(330px, 44%); column-gap: 2vw; align-items: center; }
  .style-header { position: relative; z-index: 8; min-width: 0; max-width: 680px; }
  .style-header h2 { position: relative; z-index: 9; max-width: 100%; overflow-wrap: normal; word-break: normal; text-wrap: balance; font-size: clamp(52px, 7.1vw, 116px); }
  .style-header p:not(.kicker) { position: relative; z-index: 9; max-width: 390px; text-shadow: 0 1px 12px rgba(0,0,0,.12); }
  .brutalism .style-header, .maximalism .style-header, .neobrutalism .style-header { text-shadow: 2px 2px 0 rgba(255,255,255,.2); }
  .glassmorphism .style-header, .y2k .style-header, .cyberpunk .style-header, .aurora .style-header { text-shadow: 0 2px 18px rgba(0,0,0,.4); }
  .style-section > .style-bg-word, .style-section > .max-sun, .style-section > .max-sticker, .style-section > .glass-blob, .style-section > .neo-star, .style-section > .y2k-grid, .style-section > .cyber-scan, .style-section > .aurora-wave, .style-section > .organic-shape { z-index: -1; }
  .style-detail-rail { position: absolute; left: 8vw; right: 8vw; bottom: 12%; display: flex; justify-content: space-between; gap: 18px; z-index: 4; border-top: 1px solid currentColor; padding-top: 13px; opacity: .76; }
  .style-detail-rail span { flex: 1; font: 10px var(--mono); letter-spacing: .08em; display: flex; gap: 9px; align-items: center; }
  .style-detail-rail b { color: var(--acid); font-weight: 400; }
  .style-trace { position: absolute; right: 8vw; bottom: 5%; display: flex; align-items: center; gap: 12px; font: 9px var(--mono); letter-spacing: .1em; opacity: .6; }
  .style-trace i { display: block; width: 70px; height: 1px; background: currentColor; position: relative; }
  .style-trace i:after { content: ''; position: absolute; right: 0; top: -3px; width: 6px; height: 6px; border-radius: 50%; background: var(--acid); animation: tracePulse 1.7s ease-in-out infinite; }
  .style-section:after { content: ''; position: absolute; width: 22vw; height: 22vw; border: 1px solid currentColor; border-radius: 50%; right: -9vw; bottom: -12vw; opacity: .12; animation: slowDrift 12s ease-in-out infinite; pointer-events: none; }
  .glassmorphism .style-detail-rail, .y2k .style-detail-rail, .cyberpunk .style-detail-rail, .aurora .style-detail-rail { text-shadow: 0 2px 12px rgba(0,0,0,.6); }
  .style-detail-rail.reveal { transform: translateY(18px); }
  .style-detail-rail.reveal.visible { transform: none; }
  @keyframes tracePulse { 0%,100% { transform: scale(.6); opacity: .5; } 50% { transform: scale(1.4); opacity: 1; } }
  @keyframes slowDrift { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(-25px,-18px) rotate(25deg); } }
  @media (max-width: 800px) {
    .style-section { min-height: 150vh; }
    .style-section .section-grid { display: flex; gap: 42px; }
    .style-header { max-width: 100%; }
    .style-header h2 { font-size: clamp(52px, 15vw, 94px); line-height: .86; overflow-wrap: anywhere; }
    .style-detail-rail { left: 6vw; right: 6vw; bottom: 7%; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .style-detail-rail span:last-child { grid-column: 1 / -1; }
    .style-trace { right: 6vw; bottom: 2.5%; }
  }
`;
document.head.appendChild(visualFixes);

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion) revealItems.forEach((item) => item.classList.add('visible'));
else {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.1 });
  revealItems.forEach((item) => observer.observe(item));
}

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0; let mouseY = 0; let ringX = 0; let ringY = 0;
if (!reduceMotion && dot && ring) {
  window.addEventListener('pointermove', (event) => { mouseX = event.clientX; mouseY = event.clientY; dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`; });
  const follow = () => { ringX += (mouseX - ringX) * .14; ringY += (mouseY - ringY) * .14; ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`; requestAnimationFrame(follow); }; follow();
  document.querySelectorAll('a,button,.glass-card,.neo-card,.brute-poster,.organic-note').forEach((element) => {
    element.addEventListener('mouseenter', () => { ring.style.width = '52px'; ring.style.height = '52px'; ring.style.background = 'rgba(217,255,67,.2)'; });
    element.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.background = 'transparent'; });
  });
}

document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => { if (reduceMotion) return; const box = element.getBoundingClientRect(); element.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * .2}px,${(event.clientY - box.top - box.height / 2) * .2}px)`; });
  element.addEventListener('pointerleave', () => { element.style.transform = ''; });
});

const orbit = document.querySelector('.central-orbit');
window.addEventListener('scroll', () => {
  if (orbit && !reduceMotion) { orbit.style.animationPlayState = 'paused'; orbit.style.transform = `translate(-50%,-50%) rotate(${window.scrollY * .08}deg)`; }
}, { passive: true });

const sections = [...document.querySelectorAll('.style-section')];
const status = document.querySelector('.top-status');
const names = { brutalism:'BRUTALISM', maximalism:'MAXIMALISM', minimalism:'MINIMALISM', glassmorphism:'GLASSMORPHISM', skeuomorphism:'SKEUOMORPHISM', neobrutalism:'NEOBRUTALISM', y2k:'Y2K', editorial:'EDITORIAL', organic:'ORGANIC', cyberpunk:'CYBERPUNK', aurora:'AURORA', index:'FORM / INDEX' };
const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting && status) status.innerHTML = `<i></i> ${names[entry.target.dataset.style]}`;
}), { threshold: .55 });
sections.forEach((section) => sectionObserver.observe(section));

const parallaxItems = document.querySelectorAll('.brute-poster,.glass-card,.skeuo-device,.neo-card,.organic-note,.aurora-card');
window.addEventListener('pointermove', (event) => {
  if (reduceMotion || window.innerWidth < 800) return;
  parallaxItems.forEach((item) => { const box = item.getBoundingClientRect(); if (box.top < innerHeight && box.bottom > 0) { item.style.setProperty('--mx', `${(event.clientX / innerWidth - .5) * 8}px`); item.style.setProperty('--my', `${(event.clientY / innerHeight - .5) * -8}px`); } });
}, { passive: true });
