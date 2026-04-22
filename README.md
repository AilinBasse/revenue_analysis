# Revenue Analytics — A BI Portfolio Project

A data storytelling portfolio site by **Ailin Alvarez**. Scroll-driven narrative with live Metabase dashboard embeds, the SQL behind them, and written analysis.

**Stack:** MySQL + Docker + Metabase + ngrok + GitHub Pages.
**Code:** plain HTML, CSS, vanilla JS. No build step, no frameworks.

🔗 Live site (after GH Pages enabled): `https://ailinbasse.github.io/revenue_analysis`

---

## Files

```
/
├── index.html          Main page + all 12 story sections
├── styles.css          Dark theme, teal accent, alternating layout
├── script.js           Embed config, scroll anim, nav dots, SQL toggle/copy
├── assets/
│   └── profile.jpg     (add your photo here — optional)
├── instructions.md     Original agent spec
└── README.md           This file
```

## Updating Metabase embed URLs

All URLs live in one config object at the top of `script.js`:

```js
const METABASE_BASE = 'https://REPLACE-ME.ngrok.io'; // update when ngrok restarts

const EMBEDS = {
  totalRevenue: `${METABASE_BASE}/public/question/REPLACE-WITH-UUID`,
  // … 12 total
};
```

When ngrok restarts, change **only** `METABASE_BASE`. Commit + push. GitHub Pages redeploys in ~60s.

## Local preview

Any static server works. Simplest:

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy

See `instructions.md` → *GitHub Pages Deployment Instructions*.
