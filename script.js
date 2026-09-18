const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Keep the visual archive focused on the design languages themselves.
document.querySelectorAll('.section-number, .section-next').forEach((element) => element.remove());

// Layout and contrast safeguards: long style names stay readable beside their artwork.
const visualFixes = document.createElement('style');
visualFixes.textContent = `
  .style-section .section-grid { grid-template-columns: 8% minmax(0, 1fr) minmax(300px, 38%); column-gap: 3vw; }
  .style-header { position: relative; z-index: 8; min-width: 0; max-width: 680px; }
  .style-header h2 { position: relative; z-index: 9; max-width: 100%; overflow-wrap: anywhere; text-wrap: balance; font-size: clamp(54px, 7.2vw, 116px); }
  .style-header p:not(.kicker) { position: relative; z-index: 9; text-shadow: 0 1px 12px color-mix(in srgb, currentColor 18%, transparent); }
  .brutalism .style-header, .maximalism .style-header, .neobrutalism .style-header { text-shadow: 2px 2px 0 rgba(255,255,255,.18); }
  .glassmorphism .style-header, .y2k .style-header, .cyberpunk .style-header, .aurora .style-header { text-shadow: 0 2px 18px rgba(0,0,0,.35); }
  .style-section > .style-bg-word, .style-section > .max-sun, .style-section > .max-sticker, .style-section > .glass-blob, .style-section > .neo-star, .style-section > .y2k-grid, .style-section > .cyber-scan, .style-section > .aurora-wave, .style-section > .organic-shape { z-index: 0; }
  .style-section .style-header + * { position: relative; z-index: 2; }
  @media (max-width: 800px) {
    .style-section .section-grid { display: flex; gap: 44px; }
    .style-header { max-width: 100%; }
    .style-header h2 { font-size: clamp(52px, 15vw, 94px); line-height: .86; }
    .style-header p:not(.kicker) { max-width: 34rem; }
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
  const follow = () => { ringX += (mouseX - ringX) * .14; ringY += (mouseY - ringY) * .14; ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`; requestAnimationFrame(follow); };
  follow();
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
  if (entry.isIntersecting && status) { status.innerHTML = `<i></i> ${names[entry.target.dataset.style]}`; }
}), { threshold: .55 });
sections.forEach((section) => sectionObserver.observe(section));

const parallaxItems = document.querySelectorAll('.brute-poster,.glass-card,.skeuo-device,.neo-card,.organic-note,.aurora-card');
window.addEventListener('pointermove', (event) => {
  if (reduceMotion || window.innerWidth < 800) return;
  parallaxItems.forEach((item) => { const box = item.getBoundingClientRect(); if (box.top < innerHeight && box.bottom > 0) { item.style.setProperty('--mx', `${(event.clientX / innerWidth - .5) * 8}px`); item.style.setProperty('--my', `${(event.clientY / innerHeight - .5) * -8}px`); } });
}, { passive: true });
