/* ═══════════════════════════════════════════════════════════════
   DIOGO COELHO — PORTFOLIO
   js/main.js

   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── CONFIGURAÇÕES ─────────────────────────────────────────────
const TYPED_STRINGS = [
    'python dev & automação',
    'bots que trabalham por você',
    'python + n8n + llm',
    'processos manuais? nunca mais.',
    'rio de janeiro, rj',
];

const TYPED_SPEED = 70;   // ms por letra (digitando)
const ERASE_SPEED = 35;   // ms por letra (apagando)
const PAUSE_AFTER = 2200; // ms de pausa após digitar
const PAUSE_BEFORE = 500;  // ms de pausa antes de digitar

// ──────────────────────────────────────────────────────────────

/* ── 1. NAV: scrolled class + mobile toggle ── */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 40
        ? 'rgba(30,42,56,.9)'
        : 'rgba(30,42,56,.5)';
}, { passive: true });

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
});

// Fechar menu ao clicar num link (mobile)
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
    });
});


/* ── 2. ACTIVE NAV LINK ao scroll ── */
const sections = document.querySelectorAll('section[id]');

const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.toggle(
                'active',
                a.getAttribute('href') === '#' + entry.target.id
            );
        });
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observerNav.observe(s));


/* ── 3. SCROLL REVEAL ── */
const observerReveal = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // Pequeno delay escalonado para cards em grid
        const delay = entry.target.closest('.proj-grid, .skills-grid, .cert-grid, .sobre-stats')
            ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
            : 0;
        setTimeout(() => {
            entry.target.classList.add('visible');
            observerReveal.unobserve(entry.target);
        }, delay);
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observerReveal.observe(el));


/* ── 4. SKILL BARS: animar quando visível ── */
const observerBars = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
            const target = fill.style.width;
            fill.style.width = '0';
            requestAnimationFrame(() => {
                setTimeout(() => { fill.style.width = target; }, 150);
            });
        });
        observerBars.unobserve(entry.target);
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-group').forEach(g => observerBars.observe(g));


/* ── 5. TYPED ANIMATION no hero ── */
(function typedEffect() {
    const el = document.getElementById('typedText');
    if (!el) return;

    let strIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    function tick() {
        const current = TYPED_STRINGS[strIndex];

        if (!isErasing) {
            // Digitando
            el.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                // Fim da string — pausa e começa a apagar
                isErasing = true;
                setTimeout(tick, PAUSE_AFTER);
                return;
            }
            setTimeout(tick, TYPED_SPEED + Math.random() * 30);
        } else {
            // Apagando
            el.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                // Apagou tudo — próxima string
                isErasing = false;
                strIndex = (strIndex + 1) % TYPED_STRINGS.length;
                setTimeout(tick, PAUSE_BEFORE);
                return;
            }
            setTimeout(tick, ERASE_SPEED);
        }
    }

    setTimeout(tick, 800);
})();


/* ── 6. SMOOTH SCROLL com offset do nav fixo ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});


/* ── 7. COUNTERS animados nas estatísticas ── */
function animateCounter(el, target, suffix = '') {
    const duration = 1500;
    const start = performance.now();
    const isFloat = String(target).includes('.');
    const numeric = parseFloat(target);

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const value = numeric * eased;
        el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const observerCounters = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.stat-n').forEach(el => {
            const raw = el.textContent.trim();          // ex: "2+"
            const suffix = raw.replace(/[\d.]/g, '');      // ex: "+"
            const numeric = raw.replace(/[^0-9.]/g, '');    // ex: "2"
            if (numeric) animateCounter(el, numeric, suffix);
        });
        observerCounters.unobserve(entry.target);
    });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.sobre-stats');
if (statsEl) observerCounters.observe(statsEl);


/* ── 8. ACTIVE NAV style ── */
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active { color: var(--green) !important; }
`;
document.head.appendChild(style);
