<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Working rules for this repo

Standards borrowed from the sister site BhaavBrief. Follow them in every session.

### Data and content integrity
- **No fake or incomplete data.** If a value is unavailable, omit it or label it as reference data. Never show a made-up number, a hardcoded fallback that looks live, or a dash where a metric should be.
- **Describe what a metric means, never how it is calculated.** No formulas or thresholds on public pages.
- **Prices are shown in the listing's own currency** (`lib/currency.ts`): euros, pence (GBp) for London, SEK for Stockholm. Never prefix a raw price with a euro sign.
- **Say what the data is.** Stock, ETF, index and screener pages are end-of-day closes (`lib/dataFreshness.ts`); only the homepage and macro-bridge use the near-live Yahoo feed.
- **One source per fact.** ECB rate, rate history and meeting dates come from `lib/fetchEcbRates.ts`. Do not hardcode them anywhere else.
- Every call to an outside service needs a timeout (`AbortSignal.timeout`). A hung feed once failed a deploy.

### The content gate is sacred
- `scripts/lib/contentChecks.mjs` decides whether AI-written briefs and flash items may publish. Never bypass it or weaken a check to get one item through. If a check is wrong, fix it in its own commit with a test.
- Exit codes in `scripts/generate-brief.mjs`: `0` published, `1` output rejected (nothing is written and the failure alert fires), `2` the gate itself crashed.
- Blocking checks: advisory wording (MiFID II), broken output (`undefined`, `NaN`), empty sections, wrong weekday label; for flash items also any percentage, basis-point or price figure that is not in the source headline (the model only sees the headline). Figure mismatches in briefs only warn until real runs show they are reliable.

### Working conventions
- One defect per commit. Run `npx tsc --noEmit`, `npm test` and `npm run build` before opening a PR.
- After opening a PR, check `gh pr view --json files` to confirm it contains what you intended.
- The content bots commit to `main` directly. Everything else goes through a pull request.
- `AGENTS.md` and `CLAUDE.md` must not diverge; `CLAUDE.md` imports this file.
