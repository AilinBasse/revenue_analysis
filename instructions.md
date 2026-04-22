# Portfolio BI Website — Agent Instructions

## Project Overview

This document provides complete instructions for an AI coding agent to build a data storytelling portfolio website. The site showcases a Business Intelligence project built on a local MySQL + Docker + Metabase stack. The website embeds live Metabase visualisations alongside SQL queries and narrative analysis, presented as a scroll-driven story.

Before writing any code, the agent must read this document in full and ask all clarifying questions listed in the **Pre-Build Questions** section. Do not begin coding until all required answers have been provided.

---

## Important Constraints

- The MySQL database and Metabase instance are running **locally on the author's machine** via Docker. They are not hosted on a remote server.
- Metabase must be exposed to the internet via **ngrok** for embeds to work. The agent must account for this in all embed-related instructions and code.
- The ngrok public URL changes every time it restarts. The site must make it easy to update embed URLs in one place.
- The site must be **completely free to host**. Use GitHub Pages as the primary hosting target.
- No backend, no database, no server-side code. This is a **fully static site** (HTML, CSS, vanilla JavaScript only). No React, no Next.js, no build tools that require Node.js to be installed unless the author confirms they are comfortable with that.
- The agent should prefer solutions that are easy for a Claude agent to help debug — meaning simple, readable, well-commented code over clever abstractions.

---

## Pre-Build Questions

The agent must ask the following before starting. Present them clearly and wait for answers.

### Author Information
1. What is your full name?
2. What is a one or two sentence description of yourself (e.g. background, current role or studies, location)?
3. Do you have a LinkedIn URL to include?
4. Do you have a GitHub profile URL to include?
5. Do you want a profile photo on the page? If yes, provide the filename — it will be placed in the `/assets` folder.

### Metabase Embed Setup
6. Have you enabled Public Sharing in Metabase? (Settings → Admin → Public Sharing → Enable). If not, the agent will provide instructions.
7. For each of the 10–12 dashboard questions, do you have a public embed iframe URL from Metabase? If not, the agent will walk you through generating them one by one.
8. What is your current ngrok public URL? (e.g. `https://abc123.ngrok.io`). This will be used as the base for all Metabase embed URLs. Note: this will need to be updated each time ngrok restarts.

### Hosting
9. Do you have a GitHub account?
10. What do you want the GitHub repository to be named? This determines your site URL: `https://yourusername.github.io/repo-name`
11. Do you want to use a custom domain? If yes, provide it. If no, the GitHub Pages default URL will be used.

### Content
12. What is the title of the project? (e.g. "Revenue Analytics — A BI Portfolio Project")
13. For each of the 10–12 scroll sections, the agent will need: the section title, a 2–3 sentence description of what the data shows and what conclusions can be drawn, and the Metabase embed iframe URL. The agent will prompt for these one section at a time if not provided upfront.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Hosting | GitHub Pages | Free, static, version controlled, easy to update |
| Language | HTML + CSS + Vanilla JS | No build step, easy for agent to debug, no dependencies |
| Scroll animation | Intersection Observer API (native browser API) | No library needed, well supported, performant |
| Syntax highlighting | highlight.js via CDN | Free, no install, renders SQL blocks beautifully |
| Fonts | Google Fonts via CDN | Free, no install |
| Icons | Lucide via CDN | Free, lightweight |
| Embeds | Metabase public iframe embeds | Built into Metabase, free |
| Tunnel | ngrok free tier | Exposes local Metabase to internet for embeds |

No npm, no bundler, no framework. The entire site is a single `index.html` file with one `styles.css` and one `script.js`. This makes it maximally easy for a Claude agent to read, edit, and debug in full.

---

## File Structure

```
/
├── index.html          ← Main page, all content lives here
├── styles.css          ← All styling
├── script.js           ← Scroll animations and embed URL management
├── assets/
│   └── profile.jpg     ← Author photo (optional)
├── instructions.md     ← This file
└── README.md           ← Brief project description for GitHub
```

---

## Look and Feel

### Design Language
- **Dark theme** — dark navy or near-black background (`#0d1117` or similar). Data dashboards look better on dark backgrounds and it reads as professional and technical.
- **Accent colour** — a single accent colour used for highlights, headings, and hover states. Suggested: a muted teal (`#4ecdc4`) or soft blue (`#58a6ff`). The author can specify a preference.
- **Typography** — use two Google Fonts: a clean sans-serif for body text (Inter or DM Sans) and a monospace font for SQL code blocks (JetBrains Mono or Fira Code).
- **Minimalist** — no decorative elements, no gradients on backgrounds, no animations beyond the scroll fade. Let the data visualisations be the visual centrepiece.
- **Generous whitespace** — each scroll section takes up at least the full viewport height. Content never feels cramped.

### Layout — Hero Section
The first section of the page is full-viewport-height and contains:
- Project title (large, centred or left-aligned)
- One sentence project description
- Author name, photo (if provided), LinkedIn and GitHub links
- A brief paragraph about the project context (the Docker + MySQL + Metabase stack, what the data represents)
- A subtle "scroll to explore" indicator at the bottom

### Layout — Story Sections
Each subsequent section is a full-viewport-height two-column layout:

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   LEFT COLUMN       │   RIGHT COLUMN      │
│                     │                     │
│   Metabase embed    │   Section title     │
│   (iframe)          │                     │
│                     │   2-3 sentence      │
│   SQL code block    │   description       │
│   (collapsible)     │                     │
│                     │   Key insight       │
│                     │   callout box       │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

On mobile (under 768px), columns stack vertically with the title and description first, then the embed, then the SQL.

The left and right columns alternate sides every other section to create visual rhythm as the user scrolls:
- Section 1: embed left, text right
- Section 2: text left, embed right
- Section 3: embed left, text right
- etc.

### Scroll Animation
- Each section starts invisible (`opacity: 0`, `transform: translateY(30px)`)
- When the section enters the viewport (detected via Intersection Observer), it fades in and slides up smoothly (`opacity: 1`, `transform: translateY(0)`, `transition: 0.7s ease`)
- Sections fade back out when they leave the viewport (bidirectional)
- The SQL code block inside each section is collapsed by default with a "Show SQL" toggle button. Clicking it expands the block with a smooth height animation.

### SQL Code Blocks
- Rendered using `highlight.js` with a dark theme (atom-one-dark or github-dark)
- Collapsed by default, expandable with a toggle
- Copy-to-clipboard button in the top right corner of each code block
- Monospace font, line numbers optional

### Navigation
- Fixed top navigation bar with the project title on the left and dot navigation on the right (one dot per section, clicking a dot scrolls to that section)
- The active dot highlights as the user scrolls through sections
- Nav bar background becomes slightly opaque on scroll to remain readable

---

## Metabase Embed Setup Instructions

The agent must provide these instructions to the author before building if they have not already completed this setup.

### Step 1 — Enable public sharing in Metabase
1. Open Metabase at `http://localhost:3000`
2. Go to **Settings** (gear icon) → **Admin settings** → **Public sharing**
3. Toggle **Enable public sharing** on

### Step 2 — Start ngrok
```powershell
ngrok http 3000
```
Copy the public URL shown (e.g. `https://abc123.ngrok.io`). This is your Metabase public base URL.

### Step 3 — Get embed URL for each question
For each saved Metabase question:
1. Open the question
2. Click the **share** icon (arrow pointing out of a box)
3. Click **Public link** tab
4. Copy the iframe embed code — it will look like:
```html
<iframe src="http://localhost:3000/public/question/xxxx-xxxx-xxxx" ...></iframe>
```
5. Replace `http://localhost:3000` with your ngrok URL:
```html
<iframe src="https://abc123.ngrok.io/public/question/xxxx-xxxx-xxxx" ...></iframe>
```

### Step 4 — Centralise embed URLs in script.js
All embed URLs must be defined in a single config object at the top of `script.js` so they can be updated in one place when ngrok restarts:

```javascript
const METABASE_BASE = 'https://abc123.ngrok.io'; // Update this when ngrok restarts

const EMBEDS = {
  totalRevenue:        `${METABASE_BASE}/public/question/xxxx`,
  revenueByYear:       `${METABASE_BASE}/public/question/xxxx`,
  revenueByStatus:     `${METABASE_BASE}/public/question/xxxx`,
  topCustomers:        `${METABASE_BASE}/public/question/xxxx`,
  revenueByRegion:     `${METABASE_BASE}/public/question/xxxx`,
  revenueByIndustry:   `${METABASE_BASE}/public/question/xxxx`,
  topProducts:         `${METABASE_BASE}/public/question/xxxx`,
  avgDealSize:         `${METABASE_BASE}/public/question/xxxx`,
  topSalesReps:        `${METABASE_BASE}/public/question/xxxx`,
  discountVsRevenue:   `${METABASE_BASE}/public/question/xxxx`,
  repeatCustomers:     `${METABASE_BASE}/public/question/xxxx`,
  productMix:          `${METABASE_BASE}/public/question/xxxx`,
};
```

When ngrok restarts, the author only needs to update `METABASE_BASE`.

---

## GitHub Pages Deployment Instructions

The agent must walk the author through this after the site is built.

### Step 1 — Create a GitHub repository
1. Go to github.com and create a new **public** repository
2. Name it whatever you chose in the pre-build questions
3. Do not initialise with a README (you will push your own files)

### Step 2 — Push the site files
```powershell
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Your site will be live at `https://yourusername.github.io/your-repo-name` within a few minutes

### Step 4 — Updating the site
Whenever you update files locally, push again:
```powershell
git add .
git commit -m "Update embed URLs" 
git push
```
GitHub Pages will redeploy automatically within ~60 seconds.

### Updating ngrok URLs
When ngrok restarts and your URL changes:
1. Open `script.js`
2. Update the `METABASE_BASE` value at the top
3. Push to GitHub
4. The live site will update within 60 seconds

---

## Content Structure — The 12 Sections

The agent should use the following section titles and descriptions as placeholders. Replace with author-provided content where given.

| # | Title | Description placeholder |
|---|---|---|
| 1 | Total Revenue to Date | The headline number. What has the business generated in total completed revenue since inception? |
| 2 | Revenue Growth Year Over Year | Is the business growing? This chart reveals the annual trajectory and where growth may be plateauing. |
| 3 | Revenue by Order Status | Not all booked revenue is realised. This breaks down completed, pending, and cancelled orders to show what is truly in the bank. |
| 4 | Top 10 Customers by Revenue | A small number of customers often drive a disproportionate share of revenue. Who are our most valuable relationships? |
| 5 | Revenue by Region | Where in the country is revenue coming from? This shapes where sales headcount should be allocated. |
| 6 | Revenue by Industry | Which industries have we penetrated most successfully and where is there untapped potential? |
| 7 | Best Selling Products | Are customers buying our core platform or our add-ons? The product mix tells the story of our go-to-market. |
| 8 | Average Deal Size by Industry | Some industries buy less often but spend more per order. This shapes pricing and targeting strategy. |
| 9 | Top Sales Reps by Revenue | Is performance distributed across the team or concentrated in one or two individuals? |
| 10 | Discount Rate vs Revenue per Rep | Are our top earners winning on value or buying deals with discounts? A pricing integrity question. |
| 11 | Repeat Customers and Lifetime Value | Repeat customers are the most efficient source of revenue. How many do we have and what are they worth? |
| 12 | Revenue by Product Category | Platform vs add-ons vs integrations vs services. What does the mix tell us about business model risk? |

---

## Agent Behaviour Guidelines

- Ask all pre-build questions before writing a single line of code.
- Build the site in this order: HTML structure → CSS styling → JavaScript scroll logic → embed integration → deployment instructions.
- After completing each major step, summarise what was built and ask if the author wants to review it before moving on.
- Never use React, Vue, or any frontend framework unless explicitly asked.
- Never use npm or any package manager. All dependencies load from CDN.
- Write comments in the code explaining what each section does. The author is learning.
- When the author hits an error, ask them to paste the full error message before suggesting a fix.
- If the ngrok URL needs updating, provide the exact lines to change and nothing else.
- Keep the entire site in three files maximum: `index.html`, `styles.css`, `script.js`.
