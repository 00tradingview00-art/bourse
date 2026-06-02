# Bourse — Project Context & Claude Code Brief
*Generated from full conversation on 1 June 2026*

---

## 1. Who is building this

**Prabal Kapoor** — Senior Wealth Manager at ET Money (360 ONE Wealth), Gurgaon.
- GitHub: `00tradingview00-art`
- Built: BhaavBrief (bhaavbrief.in) — live commodity intelligence platform on Next.js 15
- Built: JARVIS, VOLSCAN, sector rotation bot (Kite Connect), BottomStreet
- Mac M2 Air, Zerodha YU9878
- Long-term goal: relocate to Netherlands → build pan-European fintech

---

## 2. What Bourse is

**Bourse** is a pan-European financial research and intelligence platform targeting the gap between what US-centric tools offer (Seeking Alpha, TradingView) and what European retail and expat investors actually need.

### The core insight
- EU household wealth in equities: only **17%** vs 43% in the US → massive headroom
- 600k+ expats in Netherlands alone, none served in English with AEX-native intelligence
- **Zero** English-first, AI-native, Euronext-native research platforms exist
- IEX.nl (dominant) has 1.5M Dutch users — Dutch only, legacy editorial, no AI, no screener
- EU Retail Investment Strategy (RIS) is EU policy actively pushing more retail participation
- MiFID II compliant positioning: **research and data platform**, NOT investment advice

### Regulatory note (critical)
- Do NOT use language like "AI-native intelligence" or "AI-powered research" — MiFID II flag
- Safe framing: "independent research", "data-driven analysis", "market intelligence"
- Same principle as SEBI content guidelines Prabal already navigated for BhaavBrief

---

## 3. Current state of the codebase

### Repository
- GitHub: `https://github.com/00tradingview00-art/bourse.git`
- Local: `~/Documents/bourse` (or `~/Downloads/bourse`)
- Stack: **Next.js 16.2.6**, TypeScript, Tailwind CSS, Turbopack
- Deployed: Vercel (deployment in progress as of this brief)

### File structure (already built)
```
bourse/
├── app/
│   ├── layout.tsx              ← metadata, fonts, root HTML shell
│   ├── page.tsx                ← homepage assembly — imports all sections
│   ├── globals.css             ← CSS variables, animations (font import MUST come first)
│   └── components/
│       ├── Ticker.tsx          ← scrolling live market bar (AEX, DAX, CAC, EUR/USD etc)
│       ├── Navbar.tsx          ← sticky nav with Subscribe CTA
│       ├── HeroLeft.tsx        ← headline + stats (client component)
│       ├── TodaysBrief.tsx     ← today's edition card with market mini-strip
│       ├── MarketDashboard.tsx ← 6-exchange performance strip with hover
│       ├── FeaturesGrid.tsx    ← 6 feature cells in grid
│       ├── BriefsArchive.tsx   ← scrollable list of recent editions
│       ├── CoverageSection.tsx ← exchanges + dark performance bar chart
│       ├── Newsletter.tsx      ← email capture with confirmation state
│       └── Footer.tsx
├── lib/
│   └── data.ts                 ← ALL content in one place: market data, briefs, exchanges, features
└── types/
    └── index.ts                ← TypeScript interfaces: MarketData, Brief, Exchange, Feature
```

### Design system (preserve these)
- **Colour palette**: ink (#0f0f0f), paper (#fafaf7), accent (#1a4a2e — dark forest green), gold (#b8922a), red (#c0392b)
- **Fonts**: Libre Baskerville (serif, headings) + DM Sans (sans, body)
- **Border**: #e0e0d8 — warm grey, not cold
- **Aesthetic**: European editorial minimalism — think FT / Economist, not Bloomberg terminal
- **All CSS via CSS variables in globals.css** — not Tailwind classes for core design

### Known issues fixed
- `@import url(Google Fonts)` must come BEFORE `@import "tailwindcss"` in globals.css ✅

---

## 4. Exchanges and data covered

| Exchange | Index | Country | Priority |
|---|---|---|---|
| Euronext Amsterdam | AEX · AMX · AScX | 🇳🇱 Netherlands | Phase 1 |
| Xetra / Frankfurt | DAX 40 · MDAX | 🇩🇪 Germany | Phase 1 |
| Euronext Paris | CAC 40 · SBF 120 | 🇫🇷 France | Phase 1 |
| London Stock Exchange | FTSE 100 · AIM | 🇬🇧 UK | Phase 1 |
| Euronext Milan | FTSE MIB | 🇮🇹 Italy | Phase 2 |
| Nasdaq Nordic | Stockholm · Helsinki | 🇸🇪🇫🇮 Nordics | Phase 2 |
| SIX Swiss Exchange | SMI | 🇨🇭 Switzerland | Phase 2 |

**Key tickers to track** (Yahoo Finance compatible):
- `^AEX` `^GDAXI` `^FCHI` `^FTSE` `^IBEX` `FTSEMIB.MI`
- `EURUSD=X` `EURINR=X` `EURGBP=X`
- `ASML.AS` `ADYEN.AS` `SHELL.AS` `ING.AS` `UNA.AS`
- `BZ=F` (Brent) `GC=F` (Gold) `NG=F` (Natural Gas)

---

## 5. Competitive landscape (do not replicate these gaps)

| Competitor | Gap we exploit |
|---|---|
| IEX.nl | Dutch only, no English, no AI |
| Seeking Alpha | US-centric, poor Euronext coverage |
| SimplyWall.st | No screener, no daily brief, no macro lens |
| TradingView | Charts only, not Euronext-native, no brief |
| Fiscal.ai | Fundamentals only, no screener, no brief, no community |
| Motley Fool UK | UK only, no pan-European, no screener |

**Our moat**: English-first + Euronext-native + daily macro brief + screener + expat investor layer (Box 3, 30% ruling context)

---

## 6. Product roadmap

### Phase 1 — MVP (NOW, 0–3 months)
- [x] Landing page with ticker, hero, brief card, market dashboard, features, archive, newsletter
- [ ] Connect real Yahoo Finance data to replace static data in `lib/data.ts`
- [ ] GitHub Actions pipeline: generate daily brief at 6:30 AM CET using Claude API
- [ ] Brevo email delivery for daily brief subscribers
- [ ] Individual brief pages (`/briefs/[slug]`) with full content
- [ ] Working `/briefs` archive page

### Phase 2 — Screener (3–6 months)
- [ ] `/screener` page — AEX/AMX/DAX/CAC stocks
- [ ] Filters: RSI, MACD, SuperTrend, volume shock, earnings proximity, Fib breakout
- [ ] Euronext-native ticker universe (not retrofitted global tool)
- [ ] Free: basic filters. Premium: real-time + alerts

### Phase 3 — Intelligence Layer (6–18 months)
- [ ] Per-stock summary pages (fundamentals + technicals merged)
- [ ] ECB calendar and rate path tracker
- [ ] Sector rotation map (European sectors)
- [ ] Box 3 / 30% ruling tax context layer for Dutch expat investors
- [ ] Euronext options flow tracker
- [ ] Contributor analysis (Seeking Alpha model)

### Phase 4 — B2B (12–24 months)
- [ ] White-label daily brief API for DEGIRO, Trade Republic, Scalable Capital, ABN AMRO
- [ ] Data licensing to wealth managers and hedge funds
- [ ] Institutional research packages

---

## 7. Data pipeline architecture (mirror BhaavBrief)

```
Yahoo Finance (free tier, delayed)
    ↓
GitHub Actions (cron: 30 5 * * 1-5  → 6:30 AM CET = 5:30 AM UTC)
    ↓
Claude API (claude-sonnet-4-6) — generate daily brief
    [IMPORTANT: stagger API calls sequentially, 3–4s delay between calls]
    [Keep prompts under 100 tokens, add status indicators]
    [Never use Promise.all for Anthropic API calls]
    ↓
Next.js — write brief to /briefs/[date].json or MDX
    ↓
Brevo — email delivery to subscriber list
    ↓
Auto-commit to main branch → Vercel redeploys
```

---

## 8. Monetisation strategy

| Stream | Model | Timeline |
|---|---|---|
| Free → Premium | Freemium. Free: daily brief + basic screener. Premium: €9.99–19.99/mo real-time + alerts | Phase 2 |
| B2B white-label | Brief + screener embedded in brokers. €5–20k/mo per partner | Phase 3–4 |
| Broker affiliate | €50–150 per funded account referral (DEGIRO, IBKR, Trade Republic) | Phase 2 |
| Data licensing | Screener signals API to quant shops / wealth managers | Phase 4 |

**Target**: 10,000 paying users = €1.2–2.4M ARR. B2B partnership = fastest path to €300k+ ARR.

---

## 9. Immediate next tasks for Claude Code

In priority order:

### Task 1 — Live market data
Replace static data in `lib/data.ts` with real Yahoo Finance fetches.
- Create `lib/fetchMarkets.ts` — server-side fetch of Yahoo Finance quotes
- Use Next.js route handlers or server components with `cache: 'no-store'` for live data
- Fallback to static data if fetch fails
- Key endpoint: `https://query1.finance.yahoo.com/v8/finance/quote?symbols=^AEX,^GDAXI,^FCHI,^FTSE,EURUSD=X,EURINR=X,BZ=F,GC=F`

### Task 2 — Brief pages
- Create `app/briefs/page.tsx` — full archive page
- Create `app/briefs/[slug]/page.tsx` — individual brief page
- Store briefs as MDX or JSON in `content/briefs/`
- Add reading progress indicator

### Task 3 — GitHub Actions daily brief pipeline
- Create `.github/workflows/daily-brief.yml`
- Cron: `30 5 * * 1-5` (6:30 AM CET, weekdays only)
- Script: fetch Yahoo Finance data → call Claude API → write MDX → commit → push
- Mirror the BhaavBrief GitHub Actions pattern exactly
- Add Brevo email send step after commit

### Task 4 — Newsletter backend
- Replace the frontend-only form with a real API route
- `app/api/subscribe/route.ts` — POST handler
- Connect to Brevo API (same as BhaavBrief)
- Store subscribers, send welcome email

### Task 5 — Screener foundation
- Create `app/screener/page.tsx`
- Build filter UI: RSI range, MACD signal, volume threshold, exchange selector
- Initial data: static universe of AEX 30 + AMX 25 + DAX 40 stocks
- Compute basic technicals client-side from OHLCV data

---

## 10. Environment variables needed

```env
ANTHROPIC_API_KEY=         # Claude API — for brief generation
BREVO_API_KEY=             # Email delivery
NEXT_PUBLIC_SITE_URL=      # https://bourse.io (or vercel URL for now)
```

---

## 11. Brand and naming

- **Name**: Bourse (beurs = stock exchange in Dutch/French — every European knows it)
- **Tagline**: "European market intelligence. In plain English."
- **Domain targets**: bourse.io / getbourse.com / boursebrief.com (check availability)
- **Tone**: FT editorial meets independent research analyst — authoritative, not chatty
- **Logo**: `Bourse.` — serif wordmark with accent-coloured full stop

---

## 12. Prabal's broader context (for continuity)

- **BhaavBrief** (bhaavbrief.in) — live Indian commodity intelligence platform, same tech stack. GitHub: `00tradingview00-art/Bhaavbrief`. Pending: commodity price conversion bug (USDINR showing 96.33 incorrectly), auto-commit to main.
- **Trading book**: ~₹29–30L, 80% cash after exiting on macro read. Re-entry signal: RBI rate cut + two consecutive weeks net FII buying. Active F&O and MCX book on Zerodha YU9878.
- **Netherlands relocation**: Long-term goal. UAE staging post first for capital accumulation. Capital floor: €400–500k for self-employment NL route.
- **Job search**: Targeting Delhi/Noida research/advisory roles at ICRA, CRISIL, FactSet, BlackRock Gurgaon, S&P Global.
- **Conglomerate vision**: Bourse is not just a side project — it is the information arbitrage and content asset layer of a long-term capital + operations conglomerate.

---

## 13. How to continue in Claude Code

```bash
# Navigate to project
cd ~/Documents/bourse   # or ~/Downloads/bourse

# Start dev server
npm run dev

# Open in editor
code .
```

Then in Claude Code, run:

```
claude
```

And paste the CLAUDE_CODE_PROMPT below, or reference this file:

```bash
claude --context BOURSE_PROJECT_CONTEXT.md
```

