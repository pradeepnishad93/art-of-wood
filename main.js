/* ============================================================
   ART OF WOOD — Shared JavaScript
   ============================================================ */

/* ── Active nav link ── */
(function markActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .drawer a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html') ||
        (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Sticky header ── */
const hdr = document.getElementById('header');
function onScroll() {
  if (window.scrollY > 40) hdr.classList.add('scrolled');
  else hdr.classList.remove('scrolled');
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Hamburger / Drawer ── */
const burger  = document.getElementById('burger');
const drawer  = document.getElementById('drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll-reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('in'), +delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = el.dataset.delay || 0;
  revealObserver.observe(el);
});

/* ── Animated number counters ── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target  = +el.dataset.count;
    const suffix  = el.dataset.suffix || '';
    const dur     = 1800;
    const start   = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
const statsSection = document.querySelector('.stats');
if (statsSection) {
  let counted = false;
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      animateCounters();
      statsObs.disconnect();
    }
  }, { threshold: 0.3 });
  statsObs.observe(statsSection);
}

/* ── Testimonial slider ── */
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.testi-dots button');
let current  = 0, timerID;
function showSlide(n) {
  slides[current].classList.remove('active');
  dots[current]?.classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current]?.classList.add('active');
}
if (slides.length) {
  showSlide(0);
  timerID = setInterval(() => showSlide(current + 1), 4800);
  dots.forEach((d, i) => d.addEventListener('click', () => {
    clearInterval(timerID);
    showSlide(i);
    timerID = setInterval(() => showSlide(current + 1), 4800);
  }));
}
