/* ===================================================================
   Revenue Analytics — script.js
   1. METABASE_BASE + EMBEDS config (update here when ngrok restarts)
   2. Iframe src injection on load
   3. Intersection Observer → fade sections in/out
   4. Nav dots → generated, click-to-scroll, active on scroll
   5. SQL toggle + copy-to-clipboard
   6. highlight.js + lucide init
   =================================================================== */

/* -------------------------------------------------------------------
   1. METABASE EMBED CONFIG
   -------------------------------------------------------------------
   Update METABASE_BASE whenever ngrok restarts — it's the only line
   that needs to change. Each embed key maps to one <iframe data-embed-key>
   in index.html.

   To get each URL:
     Metabase → open question → Share icon → Public link tab
     Copy iframe src, replace http://localhost:3000 with METABASE_BASE.
------------------------------------------------------------------- */
const METABASE_BASE = 'https://oversweet-epidermal-spoon.ngrok-free.dev'; // ← change when ngrok restarts

const EMBEDS = {
  totalRevenue: `${METABASE_BASE}/public/question/cbb20f4a-672c-4000-8c14-7f3b53e81013`,
  revenueByYear: `${METABASE_BASE}/public/question/77b37950-90f4-4e4d-8311-277f613f25b7`,
  cohortRetention: `${METABASE_BASE}/public/question/b52e2908-19ad-4e96-bdbf-3fde3030c161`,
  topCustomers: `${METABASE_BASE}/public/question/e7836ce8-a536-4292-9a9d-97bb7e692ded`,
  revenueByRegion: `${METABASE_BASE}/public/question/4329c7d2-7354-40e4-8c51-b9d364193dd5`,
  repRampCurves: `${METABASE_BASE}/public/question/ea149862-5f36-4576-ad40-6bf40e2e0526`,
  topProducts: `${METABASE_BASE}/public/question/b54ef232-c486-4071-aa3c-5348f179d98d`,
  avgDealSize: `${METABASE_BASE}/public/question/ac4eda7b-6b75-4f3d-afcd-7e8eb5e737c1`,
  topSalesReps: `${METABASE_BASE}/public/question/dfe6038c-8a01-4ac1-9506-c6dbb7759736`,
  discountVsRevenue: `${METABASE_BASE}/public/question/06594329-f99b-479c-a462-9d499cb8ec34`,
  revenueAtRisk: `${METABASE_BASE}/public/question/a3425917-5de9-4338-8523-7e0769e12f24`,
  productMix: `${METABASE_BASE}/public/question/a6a00bad-9d1a-4fcf-a6d7-2bf903470a89`,
};

/* -------------------------------------------------------------------
   2. INJECT IFRAME SRCS
------------------------------------------------------------------- */
function loadEmbeds() {
  const iframes = document.querySelectorAll('iframe[data-embed-key]');
  iframes.forEach((frame) => {
    const key = frame.dataset.embedKey;
    const url = EMBEDS[key];
    if (!url) return;
    if (url.includes('REPLACE-ME') || url.includes('REPLACE-WITH-UUID')) return;
    frame.src = url;
  });
}

/* -------------------------------------------------------------------
   3. INTERSECTION OBSERVER — fade sections in/out as they enter/leave
------------------------------------------------------------------- */
function initScrollAnimations() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  sections.forEach((s) => observer.observe(s));
}

/* -------------------------------------------------------------------
   4. NAV DOTS — generate, click-to-scroll, active highlight on scroll
------------------------------------------------------------------- */
function initNavDots() {
  const navDots = document.getElementById('navDots');
  const sections = document.querySelectorAll('.section:not(.techstack)');
  if (!navDots || !sections.length) return;

  sections.forEach((sec, i) => {
    const btn = document.createElement('button');
    btn.className = 'nav-dot';
    btn.dataset.target = sec.id;
    btn.setAttribute(
      'aria-label',
      i === 0 ? 'Go to top' : `Go to section ${i}`
    );
    btn.addEventListener('click', () => {
      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
    });
    navDots.appendChild(btn);
  });

  const dots = navDots.querySelectorAll('.nav-dot');
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          dots.forEach((d) => {
            d.classList.toggle('active', d.dataset.target === id);
          });
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => activeObserver.observe(s));

  const topnav = document.getElementById('topnav');
  window.addEventListener('scroll', () => {
    topnav?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* -------------------------------------------------------------------
   5. SQL TOGGLE + COPY
------------------------------------------------------------------- */
function initSqlBlocks() {
  document.querySelectorAll('.sql-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.toggleTarget;
      const body = document.getElementById(targetId);
      if (!body) return;
      const collapsed = body.classList.toggle('collapsed');
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.textContent = collapsed ? 'Show SQL' : 'Hide SQL';
    });
  });

  document.querySelectorAll('.sql-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.dataset.copyTarget;
      const body = document.getElementById(targetId);
      if (!body) return;
      const text = body.innerText.trim();
      try {
        await navigator.clipboard.writeText(text);
        flashCopyState(btn, 'Copied!');
      } catch (err) {
        console.error('Clipboard write failed:', err);
        flashCopyState(btn, 'Failed');
      }
    });
  });
}

function flashCopyState(btn, msg) {
  const label = btn.querySelector('span');
  if (!label) return;
  const original = label.textContent;
  label.textContent = msg;
  setTimeout(() => { label.textContent = original; }, 1500);
}

/* -------------------------------------------------------------------
   6. INIT EVERYTHING ON DOM READY
   -------------------------------------------------------------------
   The icon retry handles a known race: the Lucide CDN script may not
   have finished loading by DOMContentLoaded, especially on slower
   connections. We attempt creation immediately and retry up to 4 times
   if window.lucide isn't available yet.
------------------------------------------------------------------- */
function renderLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
    return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  loadEmbeds();
  initScrollAnimations();
  initNavDots();
  initSqlBlocks();

  // highlight.js for SQL blocks
  if (window.hljs) {
    document.querySelectorAll('pre code.language-sql').forEach((el) => {
      window.hljs.highlightElement(el);
    });
  }

  // Lucide icons — try immediately, retry if CDN hasn't loaded yet.
  if (!renderLucideIcons()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      if (renderLucideIcons() || attempts >= 4) {
        clearInterval(interval);
      }
    }, 200);
  }
});
