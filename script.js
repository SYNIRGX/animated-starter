const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  if (orbit && !reduceMotion) orbit.style.animationPlayState = 'paused', orbit.style.transform = `translate(-50%,-50%) rotate(${scroll * .08}deg)`;
  lastScroll = scroll;
}, { passive: true });

const sections = [...document.querySelectorAll('.style-section')];
const status = document.querySelector('.top-status');
const names = { brutalism:'BRUTALISM', maximalism:'MAXIMALISM', minimalism:'MINIMALISM', glassmorphism:'GLASSMORPHISM', skeuomorphism:'SKEUOMORPHISM', neobrutalism:'NEOBRUTALISM', y2k:'Y2K', editorial:'EDITORIAL', organic:'ORGANIC', cyberpunk:'CYBERPUNK', aurora:'AURORA', index:'FORM / INDEX' };
const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting && status) { const name = entry.target.dataset.style; status.innerHTML = `<i></i> ${entry.target.dataset.index} / 12 — ${names[name]}`; } }), { threshold: .55 });
sections.forEach((section) => sectionObserver.observe(section));

const parallaxItems = document.querySelectorAll('.brute-poster,.glass-card,.skeuo-device,.neo-card,.organic-note,.aurora-card');
window.addEventListener('pointermove', (event) => {
  if (reduceMotion || window.innerWidth < 800) return;
  parallaxItems.forEach((item) => { const box = item.getBoundingClientRect(); if (box.top < innerHeight && box.bottom > 0) { const x = (event.clientX / innerWidth - .5) * 8; const y = (event.clientY / innerHeight - .5) * -8; item.style.setProperty('--mx', `${x}px`); item.style.setProperty('--my', `${y}px`); } });
}, { passive: true });
