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

const YAHOO_SYMBOLS = [
  '^AEX', '^GDAXI', '^FCHI', '^FTSE', '^IBEX',
  'EURUSD=X', 'EURINR=X', 'EURGBP=X',
  'BZ=F', 'GC=F',
  'ASML.AS', 'ADYEN.AS', 'SHELL.AS',
]

const SYMBOL_NAMES = {
  '^AEX': 'AEX', '^GDAXI': 'DAX', '^FCHI': 'CAC 40', '^FTSE': 'FTSE 100', '^IBEX': 'IBEX 35',
  'EURUSD=X': 'EUR/USD', 'EURINR=X': 'EUR/INR', 'EURGBP=X': 'EUR/GBP',
  'BZ=F': 'Brent Crude', 'GC=F': 'Gold',
  'ASML.AS': 'ASML', 'ADYEN.AS': 'Adyen', 'SHELL.AS': 'Shell',
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

function formatMarketSummary(data) {
  const indices = ['^AEX', '^GDAXI', '^FCHI', '^FTSE'].map(s => data[s]).filter(Boolean)
  const fx = ['EURUSD=X', 'EURINR=X'].map(s => data[s]).filter(Boolean)
  const commodities = ['BZ=F', 'GC=F'].map(s => data[s]).filter(Boolean)
  const stocks = ['ASML.AS', 'ADYEN.AS', 'SHELL.AS'].map(s => data[s]).filter(Boolean)
  return {
    indicesSummary: indices.map(m => `${m.name}: ${m.price.toFixed(1)} (${m.changePct >= 0 ? '+' : ''}${m.changePct.toFixed(2)}%)`).join(', '),
    fxSummary: fx.map(m => `${m.name}: ${m.price.toFixed(4)} (${m.changePct >= 0 ? '+' : ''}${m.changePct.toFixed(2)}%)`).join(', '),
    commoditySummary: commodities.map(m => `${m.name}: $${m.price.toFixed(2)} (${m.changePct >= 0 ? '+' : ''}${m.changePct.toFixed(2)}%)`).join(', '),
    stocksSummary: stocks.map(m => `${m.name}: €${m.price.toFixed(2)} (${m.changePct >= 0 ? '+' : ''}${m.changePct.toFixed(2)}%)`).join(', '),
    aex: data['^AEX'],
    brent: data['BZ=F'],
    eurUsd: data['EURUSD=X'],
  }
}

function deriveTags(aex, brent, eurUsd) {
  const tags = []
  if (aex) {
    if (aex.changePct > 0.5) tags.push({ label: 'AEX', variant: 'green' })
    else if (aex.changePct < -0.5) tags.push({ label: 'AEX', variant: 'red' })
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
    const editions = files
      .filter(f => f.match(/^edition-(\d+)\.mdx$/))
      .map(f => parseInt(f.match(/edition-(\d+)/)[1]))
    return Math.max(0, ...editions) + 1
  } catch {
    return 1
  }
}

async function callClaude(client, prompt, maxTokens = 200) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens,
        system: `You are a financial journalist writing for institutional and retail investors in Europe.
Use declarative sentences. Cite specific numbers from the data provided.
Do not use phrases like "it's worth noting", "as we can see", or "AI-powered".
FT editorial tone. European market focus. No padding or fluff.
Never use the words "AI-generated" or "AI-powered" in any context.`,
        messages: [{ role: 'user', content: prompt }],
      })
      return msg.content[0].text.trim()
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

  console.log('→ Fetching market data from Yahoo Finance...')
  const data = await fetchAllMarkets()
  const symbolCount = Object.keys(data).length
  console.log(`  Got data for ${symbolCount}/${YAHOO_SYMBOLS.length} symbols`)
  if (symbolCount < 4) throw new Error('Insufficient market data — aborting')

  const { indicesSummary, fxSummary, commoditySummary, stocksSummary, aex, brent, eurUsd } = formatMarketSummary(data)

  const client = new Anthropic()
  const edition = await getNextEdition()
  const slug = `edition-${String(edition).padStart(3, '0')}`
  const today = new Date()
  const { date, dateShort } = formatDate(today)

  console.log(`→ Generating brief #${edition} for ${dateShort}...`)

  // Call 1: Market summary (Opening section)
  console.log('  Claude call 1/4: Opening...')
  const opening = await callClaude(client,
    `Write the Opening section of a European market intelligence brief. 2-3 sentences.
Indices today: ${indicesSummary}
FX: ${fxSummary}
Highlight the single most significant market move and why it matters for European investors.`,
    250
  )
  await delay(3500)

  // Call 2: Commodity and macro
  console.log('  Claude call 2/4: Commodities & macro...')
  const commoditySection = await callClaude(client,
    `Write 1-2 sentences on commodities and macro context for a European market brief.
Data: ${commoditySummary}
ECB rate: 2.00%, next meeting June 11, 25bp hike 90% priced.
Connect the data to European equities impact.`,
    180
  )
  await delay(3500)

  // Call 3: Key stock move
  console.log('  Claude call 3/4: Key stock move...')
  const stockSection = await callClaude(client,
    `Write 1-2 sentences on the key AEX stock move today for a European market brief.
Data: ${stocksSummary}
Name the biggest mover and give brief context.`,
    150
  )
  await delay(3500)

  // Call 4: What to watch
  console.log('  Claude call 4/4: What to watch...')
  const watchSection = await callClaude(client,
    `Write a "What to watch today" section for a European market brief. 2-3 bullet points.
Current context: ECB June 11 meeting approaching, Brent at ${brent?.price?.toFixed(2) ?? 'elevated'}, EUR/USD at ${eurUsd?.price?.toFixed(4) ?? 'current levels'}.
Format as plain sentences without bullet characters.`,
    200
  )

  // Derive tags from market data (no Claude involved)
  const tags = deriveTags(aex, brent, eurUsd)

  // Estimate read time (250 words/min, rough content estimate)
  const readTime = 4

  // Extract headline from opening (first sentence)
  const headline = opening.split('.')[0].replace(/^[^A-Z]*/, '').trim().slice(0, 110)

  // Excerpt from opening paragraph
  const excerpt = opening.slice(0, 200).trim() + (opening.length > 200 ? '…' : '')

  // Write .edition_tmp for the commit message step in CI
  await writeFile(join(__dirname, '..', '.edition_tmp'), String(edition))

  // Compose MDX
  const mdx = `export const metadata = {
  edition: ${edition},
  date: '${date}',
  dateShort: '${dateShort}',
  headline: '${headline.replace(/'/g, "\\'")}',
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
