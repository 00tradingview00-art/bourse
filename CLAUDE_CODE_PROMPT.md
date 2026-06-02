# Claude Code Prompt — Bourse Project

Paste this into Claude Code (`claude`) when starting a new session on the Bourse project.

---

## Prompt to paste into Claude Code:

```
You are the lead engineer on Bourse — a pan-European financial research and intelligence platform built with Next.js 16, TypeScript, and Tailwind CSS. The codebase is at ~/Documents/bourse (or ~/Downloads/bourse). Read BOURSE_PROJECT_CONTEXT.md in the project root for full context.

Here is what Bourse is and what you need to know before touching any code:

WHAT IT IS:
- Pan-European market intelligence platform — daily brief + stock screener + expat investor layer
- Targeting English-speaking investors and expats across Europe who are underserved by Dutch-only IEX.nl and US-centric Seeking Alpha
- MiFID II compliant framing: "independent research" and "data-driven analysis" — NEVER "AI-powered" or "AI-native" (regulatory risk)
- Tech stack mirrors BhaavBrief (bhaavbrief.in) — same GitHub Actions + Claude API + Brevo pipeline, retargeted for European markets

DESIGN SYSTEM (never break these):
- CSS vars in globals.css: --ink (#0f0f0f), --paper (#fafaf7), --accent (#1a4a2e), --gold (#b8922a), --red (#c0392b), --border (#e0e0d8)
- Fonts: Libre Baskerville (serif headings) + DM Sans (sans body)
- Aesthetic: FT editorial minimalism — not Bloomberg terminal, not startup SaaS
- Google Fonts @import MUST come before @import "tailwindcss" in globals.css

CURRENT STATE:
- Landing page fully built and deployed on Vercel
- All data is static in lib/data.ts — needs to become live
- Components: Ticker, Navbar, HeroLeft, TodaysBrief, MarketDashboard, FeaturesGrid, BriefsArchive, CoverageSection, Newsletter, Footer

YOUR FIRST TASK — pick one and execute fully:

TASK A (Live Data): Replace static market data in lib/data.ts with real Yahoo Finance fetches.
Create lib/fetchMarkets.ts as a server-side fetcher using:
https://query1.finance.yahoo.com/v8/finance/quote?symbols=^AEX,^GDAXI,^FCHI,^FTSE,^IBEX,EURUSD=X,EURINR=X,BZ=F,GC=F,ASML.AS,ADYEN.AS
Use Next.js server components with revalidate: 300 (5 min cache). Fallback to static data if fetch fails. Update MarketDashboard and Ticker to consume live data.

TASK B (Brief Pages): Build the brief content system.
- Create content/briefs/ directory for MDX brief files
- Create app/briefs/page.tsx — full archive with pagination
- Create app/briefs/[slug]/page.tsx — individual brief with reading progress bar
- Style consistent with landing page design system

TASK C (GitHub Actions Pipeline): Wire up the daily brief generation.
- Create .github/workflows/daily-brief.yml
- Cron: 30 5 * * 1-5 (6:30 AM CET weekdays)
- Steps: fetch Yahoo Finance → call Claude API (claude-sonnet-4-6) → write MDX to content/briefs/ → git commit → push → triggers Vercel redeploy
- IMPORTANT: stagger all Anthropic API calls sequentially with 3-4s delays, never Promise.all, keep prompts under 100 tokens

TASK D (Newsletter API): Make the email signup functional.
- Create app/api/subscribe/route.ts — POST handler
- Connect to Brevo API (same key as BhaavBrief)
- Store subscriber, send welcome email, return success/error JSON
- Update Newsletter.tsx to call the API route

Tell me which task you're starting, then proceed. Ask no unnecessary questions — read the codebase and execute.
```

---

## Quick reference commands

```bash
# Run dev server
cd ~/Documents/bourse && npm run dev

# Check what's built
ls app/components/

# See all data (market data, briefs, exchanges)
cat lib/data.ts

# See design tokens
head -60 app/globals.css

# Deploy manually
vercel --prod

# Check GitHub remote
git remote -v
```

## Key files to read first

1. `lib/data.ts` — all static content
2. `types/index.ts` — TypeScript interfaces
3. `app/globals.css` — design system variables
4. `app/page.tsx` — how sections connect

## Environment variables to set in Vercel + .env.local

```
ANTHROPIC_API_KEY=
BREVO_API_KEY=
NEXT_PUBLIC_SITE_URL=https://bourse.vercel.app
```

