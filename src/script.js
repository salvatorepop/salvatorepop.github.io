/* ─────────────────────────────────────────────
   script.js — Emmanuel Rivera Portfolio
───────────────────────────────────────────── */

/* ── Theme toggle ── */
const root        = document.documentElement;
const themeBtn    = document.getElementById('theme-toggle');
const THEME_KEY   = 'er-portfolio-theme';

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

/* Leer preferencia guardada o usar preferencia del SO */
const saved = localStorage.getItem(THEME_KEY);
if (saved) {
  applyTheme(saved);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

themeBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ── NAV scroll effect ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Active nav link on scroll ── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const observerNav = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => observerNav.observe(s));

/* ── Reveal on scroll ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ── Project filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards  = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.style.transition = 'opacity .3s ease, transform .3s ease';
      if (match) {
        card.style.opacity   = '1';
        card.style.transform = 'scale(1)';
        card.classList.remove('hidden');
      } else {
        card.style.opacity   = '0';
        card.style.transform = 'scale(.96)';
        setTimeout(() => {
          if (card.dataset.cat !== btn.dataset.filter && btn.dataset.filter !== 'all') {
            card.classList.add('hidden');
          }
        }, 300);
      }
    });
  });
});

/* ── CV download ── */
const navCvBtn = document.getElementById('nav-cv-btn');
if (navCvBtn) {
  navCvBtn.addEventListener('click', () => {
     alert('¡Pronto disponible! Sube tu CV a /src/assets/cv/EmmanuelRivera-CV.pdf y actualiza este enlace.');
     //window.open('/src/assets/cv/Emmanuel Rivera MendozaCV', '_blank');
  });
}

/* ── Smooth anchor clicks ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 78;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Animated skill bars: retrigger when in view ── */
const skillBars = document.querySelectorAll('.level-fill');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = 'none';
      void e.target.offsetWidth; // force reflow
      e.target.style.animation = 'fill-bar 1.2s ease forwards';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
skillBars.forEach(b => barObs.observe(b));

/* ── Staggered card entrance ── */
function staggerCards(selector, delay = 80) {
  const container = document.querySelector(selector);
  if (!container) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const cards = e.target.querySelectorAll(':scope > *');
        cards.forEach((card, i) => {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(22px)';
          card.style.transition = `opacity .42s ease ${i * delay}ms, transform .42s ease ${i * delay}ms`;
          setTimeout(() => {
            card.style.opacity   = '1';
            card.style.transform = 'none';
          }, 80 + i * delay);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  obs.observe(container);
}
staggerCards('#lang-grid',  90);
staggerCards('#tools-grid', 70);
staggerCards('#proj-grid', 100);

/* ── Footer year ── */
const yearEl = document.querySelector('.footer-copy');
if (yearEl) {
  yearEl.textContent = yearEl.textContent.replace('2026', new Date().getFullYear());
}

/* ── Console signature ── */
console.log('%c ER.dev ', 'background:#6d9eeb;color:#0f172a;font-size:14px;font-weight:bold;border-radius:4px;padding:4px 8px;');
console.log('%c Emmanuel Rivera — Ingeniero Full Stack ', 'color:#93c5fd;font-size:11px;');
