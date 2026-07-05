/**
 * generate-brief.mjs
 * Fetches European market data from Yahoo Finance, generates a daily brief
 * using Claude API, and writes it as an MDX file to content/briefs/.
 *
 * Usage: node scripts/generate-brief.mjs
 * Requires: ANTHROPIC_API_KEY in environment
 */

import { readdir, writeFile, readFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BRIEFS_DIR = join(__dirname, '..', 'content', 'briefs')

// ─── European market holiday guard ───────────────────────────────
// European markets are closed on these fixed dates. Briefs are skipped.
const EU_HOLIDAYS = [
  '01-01', // New Year's Day
  '05-01', // Labour Day
  '12-25', // Christmas Day
  '12-26', // Boxing Day
]

function isEuHoliday(d) {
  const mmdd = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return EU_HOLIDAYS.includes(mmdd)
}

// ─── Duplicate guard ─────────────────────────────────────────────
// Replaces the old UTC time-window guard. GitHub Actions can run
// 30–60+ minutes late, so a rigid time window causes false failures.
// Instead: skip if a brief for today's CET date already exists.
async function checkAlreadyRun() {
  if (process.env.FORCE_RUN === '1') return
  const today = new Date()
  if (isEuHoliday(today)) {
    console.log(`✓ European market holiday — skipping brief.`)
    process.exit(0)
  }
  const todayStr = toDateStr(today)  // YYYY-MM-DD in CET
  let files = []
  try { files = await readdir(BRIEFS_DIR) } catch {}
  if (files.some(f => f.startsWith(todayStr))) {
    console.log(`✓ Brief for ${todayStr} already exists — skipping.`)
    process.exit(0)
  }
}

// ─── Slug generation ─────────────────────────────────────────────
const SLUG_STOP = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','has','have','had',
  'as','its','near','into','after','over','that','this','not','no',
])

function makeSlug(dateStr, headline) {
  const words = headline
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !SLUG_STOP.has(w))
    .slice(0, 6)
  const raw = `${dateStr}-${words.join('-')}`
  if (raw.length <= 70) return raw
  const cut = raw.slice(0, 70)
  return cut.slice(0, cut.lastIndexOf('-'))
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─── Claude output validation ────────────────────────────────────
const REFUSAL_PATTERNS = [
  /^skip\b/i,
  /i('m| am) (not able|unable) to/i,
  /i cannot/i,
  /as an ai/i,
]

function stripCodeFences(text) {
  return text
    .replace(/^```[a-z]*\r?\n?/gm, '')
    .replace(/^```\s*$/gm, '')
    .trim()
}

function validateClaudeOutput(text, label) {
  const cleaned = stripCodeFences(text)
  if (cleaned.length < 30) throw new Error(`Claude output too short for "${label}": ${JSON.stringify(cleaned)}`)
  for (const pattern of REFUSAL_PATTERNS) {
    if (pattern.test(cleaned)) throw new Error(`Claude refused to generate "${label}": ${cleaned.slice(0, 80)}`)
  }
  return cleaned
}

const YAHOO_SYMBOLS = [
  '^AEX', '^GDAXI', '^FCHI', '^FTSE', '^IBEX', '^FTMIB', '^OMX',
  'EURUSD=X', 'EURINR=X', 'EURGBP=X',
  'BZ=F', 'GC=F',
  // AEX
  'ASML.AS', 'ADYEN.AS', 'SHELL.AS',
  // DAX
  'SAP.DE', 'SIE.DE',
  // CAC 40
  'MC.PA', 'TTE.PA',
  // FTSE 100
  'AZN.L', 'SHEL.L',
  // IBEX 35
  'ITX.MC', 'IBE.MC',
  // FTSE MIB
  'ENEL.MI', 'UCG.MI',
  // OMX Nordic
  'ERIC-B.ST', 'VOLV-B.ST',
]

const SYMBOL_NAMES = {
  '^AEX': 'AEX', '^GDAXI': 'DAX', '^FCHI': 'CAC 40', '^FTSE': 'FTSE 100', '^IBEX': 'IBEX 35', '^FTMIB': 'FTSE MIB', '^OMX': 'OMX Nordic',
  'EURUSD=X': 'EUR/USD', 'EURINR=X': 'EUR/INR', 'EURGBP=X': 'EUR/GBP',
  'BZ=F': 'Brent Crude', 'GC=F': 'Gold',
  'ASML.AS': 'ASML', 'ADYEN.AS': 'Adyen', 'SHELL.AS': 'Shell',
  'SAP.DE': 'SAP', 'SIE.DE': 'Siemens',
  'MC.PA': 'LVMH', 'TTE.PA': 'TotalEnergies',
  'AZN.L': 'AstraZeneca', 'SHEL.L': 'Shell (UK)',
  'ITX.MC': 'Inditex', 'IBE.MC': 'Iberdrola',
  'ENEL.MI': 'Enel', 'UCG.MI': 'UniCredit',
  'ERIC-B.ST': 'Ericsson', 'VOLV-B.ST': 'Volvo',
}

const delay = ms => new Promise(r => setTimeout(r, ms))

async function fetchChart(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const meta = json?.chart?.result?.[0]?.meta
      if (!meta) throw new Error('No meta in response')
      const price = meta.regularMarketPrice
      const prev = meta.chartPreviousClose
      const change = price - prev
      const changePct = (change / prev) * 100
      return { symbol, name: SYMBOL_NAMES[symbol] ?? symbol, price, change, changePct, prev }
    } catch (err) {
      if (attempt === 3) {
        console.error(`Failed to fetch ${symbol} after 3 attempts:`, err.message)
        return null
      }
      await delay(2000 * attempt)
    }
  }
}

async function fetchAllMarkets() {
  const results = await Promise.all(YAHOO_SYMBOLS.map(fetchChart))
  const data = {}
  for (const r of results) {
    if (r) data[r.symbol] = r
  }
  return data
}

function formatStockLine(m) {
  if (!m) return null
  const price = m.price < 10 ? m.price.toFixed(3) : m.price.toFixed(2)
  return `${m.name}: ${price} (${m.changePct >= 0 ? '+' : ''}${m.changePct.toFixed(2)}%)`
}

function formatMarketSummary(data) {
  const indices = ['^AEX', '^GDAXI', '^FCHI', '^FTSE', '^IBEX', '^FTMIB', '^OMX'].map(s => data[s]).filter(Boolean)
  const fx = ['EURUSD=X', 'EURINR=X'].map(s => data[s]).filter(Boolean)
  const commodities = ['BZ=F', 'GC=F'].map(s => data[s]).filter(Boolean)
  const aexStocks   = ['ASML.AS', 'ADYEN.AS', 'SHELL.AS']
  const otherStocks = ['SAP.DE', 'SIE.DE', 'MC.PA', 'TTE.PA', 'AZN.L', 'ITX.MC', 'IBE.MC', 'ENEL.MI', 'UCG.MI', 'ERIC-B.ST', 'VOLV-B.ST']
  const allStocks = [...aexStocks, ...otherStocks].map(s => data[s]).filter(Boolean)
  // Pick the 5 biggest movers (absolute changePct) across all exchanges
  const topMovers = [...allStocks].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 5)
  return {
    indicesSummary: indices.map(m => `${m.name}: ${m.price.toFixed(1)} (${m.changePct >= 0 ? '+' : ''}${m.changePct.toFixed(2)}%)`).join(', '),
    fxSummary: fx.map(m => `${m.name}: ${m.price.toFixed(4)} (${m.changePct >= 0 ? '+' : ''}${m.changePct.toFixed(2)}%)`).join(', '),
    commoditySummary: commodities.map(m => `${m.name}: $${m.price.toFixed(2)} (${m.changePct >= 0 ? '+' : ''}${m.changePct.toFixed(2)}%)`).join(', '),
    stocksSummary: topMovers.map(formatStockLine).filter(Boolean).join(', '),
    aex: data['^AEX'],
    dax: data['^GDAXI'],
    cac: data['^FCHI'],
    ftse: data['^FTSE'],
    ibex: data['^IBEX'],
    ftmib: data['^FTMIB'],
    brent: data['BZ=F'],
    eurUsd: data['EURUSD=X'],
  }
}

function deriveTags(aex, brent, eurUsd, dax, cac, ftse, ibex, ftmib) {
  const tags = []
  // Pick the index with the largest absolute move for a tag
  const indexMoves = [
    { label: 'AEX', data: aex }, { label: 'DAX', data: dax }, { label: 'CAC 40', data: cac },
    { label: 'FTSE 100', data: ftse }, { label: 'IBEX 35', data: ibex }, { label: 'FTSE MIB', data: ftmib },
  ].filter(x => x.data).sort((a, b) => Math.abs(b.data.changePct) - Math.abs(a.data.changePct))
  if (indexMoves.length > 0) {
    const top = indexMoves[0]
    if (top.data.changePct > 0.5) tags.push({ label: top.label, variant: 'green' })
    else if (top.data.changePct < -0.5) tags.push({ label: top.label, variant: 'red' })
  }
  if (brent && brent.changePct > 1.0) tags.push({ label: 'Energy', variant: 'red' })
  if (brent && brent.changePct < -1.5) tags.push({ label: 'Energy', variant: 'green' })
  if (eurUsd && eurUsd.changePct > 0.3) tags.push({ label: 'EUR/USD', variant: 'green' })
  if (eurUsd && eurUsd.changePct < -0.3) tags.push({ label: 'EUR/USD', variant: 'red' })
  if (tags.length < 2) tags.push({ label: 'Macro', variant: 'default' })
  return tags
}

async function getNextEdition() {
  try {
    const files = await readdir(BRIEFS_DIR)
    const mdxFiles = files.filter(f => f.endsWith('.mdx'))
    const editions = await Promise.all(
      mdxFiles.map(async f => {
        try {
          const content = await readFile(join(BRIEFS_DIR, f), 'utf8')
          const m = content.match(/edition:\s*(\d+)/)
          return m ? parseInt(m[1]) : 0
        } catch { return 0 }
      })
    )
    return Math.max(0, ...editions) + 1
  } catch {
    return 1
  }
}

async function callClaude(client, prompt, label, maxTokens = 200) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system: `You are a financial journalist writing for institutional and retail investors in Europe.
Use declarative sentences. Cite specific numbers from the data provided.
Do not use phrases like "it's worth noting", "as we can see", or "AI-powered".
FT editorial tone. European market focus. No padding or fluff.
Never use the words "AI-generated" or "AI-powered" in any context.
If you cannot produce quality output for any reason, respond with exactly: SKIP`,
        messages: [{ role: 'user', content: prompt }],
      })
      const raw = msg.content[0].text.trim()
      return validateClaudeOutput(raw, label)
    } catch (err) {
      if (attempt === 3) throw err
      const backoff = 3500 * attempt
      console.log(`  Retrying in ${backoff}ms...`)
      await delay(backoff)
    }
  }
}

function formatDate(d) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return {
    date: `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    dateShort: `${shortDays[d.getDay()]} ${d.getDate()} ${shortMonths[d.getMonth()]} ${d.getFullYear()}`,
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is required')
  }

  await checkAlreadyRun()

  console.log('→ Fetching market data from Yahoo Finance...')
  const data = await fetchAllMarkets()
  const symbolCount = Object.keys(data).length
  console.log(`  Got data for ${symbolCount}/${YAHOO_SYMBOLS.length} symbols`)
  // Require at least 5 indices to have data — guards against US holiday Yahoo Finance gaps
  const indexSymbols = ['^AEX', '^GDAXI', '^FCHI', '^FTSE', '^IBEX', '^FTMIB', '^OMX']
  const indexCount = indexSymbols.filter(s => data[s]).length
  if (indexCount < 3) {
    console.log(`Only ${indexCount} index symbols returned — likely a market holiday. Skipping.`)
    process.exit(0)
  }
  if (symbolCount < 4) throw new Error('Insufficient market data — aborting')

  const { indicesSummary, fxSummary, commoditySummary, stocksSummary, aex, dax, cac, ftse, ibex, ftmib, brent, eurUsd } = formatMarketSummary(data)

  const client = new Anthropic()
  const edition = await getNextEdition()
  const today = new Date()
  const { date, dateShort } = formatDate(today)

  console.log(`→ Generating brief #${edition} for ${dateShort}...`)

  // Call 1: Opening
  console.log('  Claude call 1/6: Opening...')
  const opening = await callClaude(client,
    `Write the Opening section of a European market intelligence brief. 2-3 sentences.
Indices today: ${indicesSummary}
FX: ${fxSummary}
Highlight the single most significant market move and why it matters for European investors.`,
    'opening', 250
  )
  await delay(3500)

  // Call 2: Commodities & macro
  console.log('  Claude call 2/6: Commodities & macro...')
  const commoditySection = await callClaude(client,
    `Write 1-2 sentences on commodities and macro context for a European market brief.
Data: ${commoditySummary}
Connect the data to European equities impact.`,
    'commodities', 180
  )
  await delay(3500)

  // Call 3: Key stock move
  console.log('  Claude call 3/6: Key stock move...')
  const stockSection = await callClaude(client,
    `Write 1-2 sentences on the key European stock move today for a market brief covering AEX, DAX, CAC 40, FTSE 100, IBEX 35, FTSE MIB, and OMX Nordic.
Data: ${stocksSummary}
Name the biggest mover and give brief context. Include exchange in parentheses if not obvious.`,
    'stocks', 160
  )
  await delay(3500)

  // Call 4: What to watch
  console.log('  Claude call 4/6: What to watch...')
  const watchSection = await callClaude(client,
    `Write a "What to watch today" section for a European market brief. 2-3 concise points.
Context: Brent at ${brent?.price?.toFixed(2) ?? 'current'}, EUR/USD at ${eurUsd?.price?.toFixed(4) ?? 'current'}.
Format as plain sentences, no bullet characters.`,
    'watch', 200
  )
  await delay(3500)

  // Call 5: Headline (original — never copy market data verbatim)
  console.log('  Claude call 5/6: Headline...')
  const rawHeadline = await callClaude(client,
    `Write a single newspaper headline (max 90 characters) for today's European market brief.
Key facts: ${indicesSummary}. ${commoditySummary}.
Rules: original wording (not copied from data), no quotes, no colon after first word, title case.
Respond with ONLY the headline text — nothing else.`,
    'headline', 60
  )
  await delay(3500)

  // Validate and truncate headline at word boundary
  const headlineRaw = rawHeadline.replace(/^["']|["']$/g, '').trim()
  const headlineTrunc = headlineRaw.length <= 90
    ? headlineRaw
    : headlineRaw.slice(0, 90).replace(/\s\S+$/, '')

  // Call 6: Macro–Equity Bridge
  console.log('  Claude call 6/7: Macro–Equity Bridge...')
  const bridgeSection = await callClaude(client,
    `Write a Macro–Equity Bridge for today's European market brief.

This section explicitly connects today's macro signals to specific European stocks and sectors.

Format: exactly 3-4 entries. Each entry is ONE line only:
**[Signal with value]** → [Specific European stock(s) in parentheses with ticker]: [mechanism, max 20 words]

Example format (do not copy these):
**Crude −1.2%** → Shell (SHELL.AS), TotalEnergies (TTE.PA): lower feedstock cost improves refining margins near-term
**EUR/USD +0.3% at 1.166** → ASML (ASML.AS), SAP (SAP.DE): euro strength trims dollar-revenue on repatriation
**ECB hold** → UniCredit (UCG.MI), ING (INGA.AS): flat short-end yield limits NII expansion this quarter
**IBEX +1.1%** → Inditex (ITX.MC), Iberdrola (IBE.MC): Spain outperforms as domestic consumer data beats

Use ONLY today's actual data — do not invent moves:
Indices: ${indicesSummary}
FX: ${fxSummary}
Commodities: ${commoditySummary}
Key stocks: ${stocksSummary}

Rules: name real tickers in parentheses — can include AEX (.AS), DAX (.DE), CAC (.PA), FTSE (.L), IBEX (.MC), FTSE MIB (.MI), OMX (.ST) stocks. Give the MECHANISM not just direction. Bold the signal. Each entry on its own line. No intro or outro text — entries only.`,
    'bridge', 400
  )
  await delay(3500)

  // Call 7: Excerpt
  console.log('  Claude call 7/7: Excerpt...')
  const excerptRaw = await callClaude(client,
    `Write a 1-sentence summary (max 160 characters) of today's European market brief for use as a preview snippet.
Key facts: ${indicesSummary}. ${commoditySummary}.
Respond with ONLY the sentence — nothing else.`,
    'excerpt', 80
  )

  const excerpt = excerptRaw.slice(0, 200).trim() + (excerptRaw.length > 200 ? '…' : '')

  // Derive tags from market data (rule engine — no Claude)
  const tags = deriveTags(aex, brent, eurUsd, dax, cac, ftse, ibex, ftmib)
  const readTime = 4

  // Date-based slug with word-boundary truncation
  const slug = makeSlug(toDateStr(today), headlineTrunc)

  // Write .edition_tmp for the commit message step in CI
  await writeFile(join(__dirname, '..', '.edition_tmp'), String(edition))

  // Compose MDX
  const mdx = `export const metadata = {
  edition: ${edition},
  date: '${date}',
  dateShort: '${dateShort}',
  headline: '${headlineTrunc.replace(/'/g, "\\'")}',
  excerpt: '${excerpt.replace(/'/g, "\\'")}',
  tags: ${JSON.stringify(tags, null, 2).split('\n').join('\n  ')},
  readTime: ${readTime},
  slug: '${slug}',
  generationMethod: 'automated-with-review',
  humanReviewed: false,
  generatedAt: '${new Date().toISOString()}',
}

## Opening

${opening}

${commoditySection}

## Key stock move

${stockSection}

## Macro–Equity Bridge

${bridgeSection}

## What to watch today

${watchSection}
`

  if (!existsSync(BRIEFS_DIR)) mkdirSync(BRIEFS_DIR, { recursive: true })
  const filePath = join(BRIEFS_DIR, `${slug}.mdx`)
  await writeFile(filePath, mdx, 'utf8')
  console.log(`✓ Written: content/briefs/${slug}.mdx`)
}

main().catch(err => {
  console.error('✗ Brief generation failed:', err.message)
  process.exit(1)
})
