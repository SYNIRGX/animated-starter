const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion) revealItems.forEach((item) => item.classList.add('visible'));
else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}

const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let ringX = 0; let ringY = 0; let mouseX = 0; let mouseY = 0;
if (!reduceMotion && dot && ring) {
  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX; mouseY = event.clientY;
    dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
  });
  const follow = () => {
    ringX += (mouseX - ringX) * 0.13; ringY += (mouseY - ringY) * 0.13;
    ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
    requestAnimationFrame(follow);
  };
  follow();
  document.querySelectorAll('a, button, .experiment-card').forEach((target) => {
    target.addEventListener('mouseenter', () => { ring.style.width = '52px'; ring.style.height = '52px'; ring.style.background = 'rgba(217,255,72,.2)'; });
    target.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.background = 'transparent'; });
  });
}

document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('mousemove', (event) => {
    if (reduceMotion) return;
    const box = element.getBoundingClientRect();
    const x = (event.clientX - box.left - box.width / 2) * 0.15;
    const y = (event.clientY - box.top - box.height / 2) * 0.15;
    element.style.transform = `translate(${x}px, ${y}px)`;
  });
  element.addEventListener('mouseleave', () => { element.style.transform = ''; });
});

const field = document.querySelector('#playfield');
const glow = document.querySelector('.field-glow');
const fieldWord = document.querySelector('.field-word');
const coordX = document.querySelector('#coord-x');
const coordY = document.querySelector('#coord-y');
const velocity = document.querySelector('#velocity');
let lastX = 0; let lastY = 0; let lastTime = performance.now();
if (field) {
  field.addEventListener('pointermove', (event) => {
    const box = field.getBoundingClientRect();
    const x = event.clientX - box.left; const y = event.clientY - box.top;
    const now = performance.now(); const distance = Math.hypot(x - lastX, y - lastY);
    const speed = Math.min(99.9, distance / Math.max(1, now - lastTime) * 10);
    lastX = x; lastY = y; lastTime = now;
    glow.style.left = `${x}px`; glow.style.top = `${y}px`;
    coordX.textContent = String(Math.round(x)).padStart(3, '0');
    coordY.textContent = String(Math.round(y)).padStart(3, '0');
    velocity.textContent = speed.toFixed(1).padStart(4, '0');
    if (!reduceMotion) fieldWord.style.transform = `translate(${(x / box.width - .5) * -24}px, ${(y / box.height - .5) * -18}px)`;
  });
  field.addEventListener('pointerleave', () => {
    if (!reduceMotion) fieldWord.style.transform = '';
    velocity.textContent = '00.0';
  });
}

document.querySelector('.reset-button')?.addEventListener('click', () => {
  if (!field) return;
  fieldWord.style.transform = ''; glow.style.left = '50%'; glow.style.top = '50%';
  coordX.textContent = '000'; coordY.textContent = '000'; velocity.textContent = '00.0';
});

window.addEventListener('scroll', () => {
  const stage = document.querySelector('.hero-stage');
  if (stage && !reduceMotion) stage.style.transform = `rotate(${-18 + window.scrollY * .025}deg) translateY(${window.scrollY * .12}px)`;
}, { passive: true });
