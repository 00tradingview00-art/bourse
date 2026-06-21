#!/usr/bin/env node
/**
 * Boursee — European Market Flash Monitor
 * Runs every 30 min via flash-intelligence.yml during EU market hours.
 * Detects ECB decisions, eurozone CPI/PMI, major earnings, index moves.
 * Writes MDX flash articles to content/flash/.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const FLASH_DIR = path.join(ROOT, 'content/flash')
const SEEN_FILE = path.join(__dirname, 'seen-european.json')
const SEEN_TTL = 48 * 3600 * 1000

const envFile = path.join(ROOT, '.env.local')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const [k, ...v] = line.split('=')
    if (k?.trim() && v.length && !process.env[k.trim()])
      process.env[k.trim()] = v.join('=').trim()
  }
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const FEEDS = [
  // ECB & monetary policy
  { url: 'https://news.google.com/rss/search?q=ECB+rate+decision+European+Central+Bank+interest&hl=en&gl=IE&ceid=IE:en', source: 'ECB' },
  { url: 'https://news.google.com/rss/search?q=ECB+rate+cut+hike+Christine+Lagarde+deposit+rate&hl=en&gl=DE&ceid=DE:en', source: 'ECB' },
  // Eurozone macro data
  { url: 'https://news.google.com/rss/search?q=eurozone+CPI+inflation+eurostat+flash+estimate&hl=en&gl=IE&ceid=IE:en', source: 'Macro' },
  { url: 'https://news.google.com/rss/search?q=eurozone+PMI+flash+manufacturing+services+composite&hl=en&gl=IE&ceid=IE:en', source: 'Macro' },
  { url: 'https://news.google.com/rss/search?q=Germany+GDP+IFO+ZEW+business+climate+confidence&hl=en&gl=DE&ceid=DE:en', source: 'Macro' },
  // Major European earnings
  { url: 'https://news.google.com/rss/search?q=ASML+earnings+results+revenue+quarterly&hl=en&gl=NL&ceid=NL:en', source: 'Earnings' },
  { url: 'https://news.google.com/rss/search?q=LVMH+Shell+SAP+Unilever+AstraZeneca+earnings+results&hl=en&gl=IE&ceid=IE:en', source: 'Earnings' },
  { url: 'https://news.google.com/rss/search?q=Airbus+Siemens+BNP+Paribas+Santander+ING+results&hl=en&gl=IE&ceid=IE:en', source: 'Earnings' },
  // European markets & index moves
  { url: 'https://news.google.com/rss/search?q=AEX+DAX+CAC+FTSE+European+equities+rally+selloff+today&hl=en&gl=IE&ceid=IE:en', source: 'Markets' },
  // BTP-Bund spread / sovereign stress
  { url: 'https://news.google.com/rss/search?q=BTP+Bund+spread+Italy+sovereign+bond+yield&hl=en&gl=IE&ceid=IE:en', source: 'Bonds' },
]

// Primary signals — at least one must match
const EU_SIGNALS = [
  'ecb', 'european central bank', 'rate decision', 'rate cut', 'rate hike', 'lagarde',
  'deposit facility rate', 'ecb meeting',
  'eurozone cpi', 'eurozone inflation', 'eurostat', 'flash cpi', 'flash pmi', 'composite pmi',
  'eurozone pmi', 'manufacturing pmi', 'services pmi',
  'germany gdp', 'germany ifo', 'zew survey', 'ifo business climate',
  'asml earnings', 'asml results', 'lvmh earnings', 'lvmh results', 'shell earnings',
  'sap earnings', 'unilever earnings', 'astrazeneca earnings', 'airbus earnings',
  'siemens earnings', 'bnp paribas results', 'beats estimates', 'misses estimates',
  'beats expectations', 'misses expectations', 'profit warning',
  'btp bund', 'btp-bund', 'italian bonds', 'sovereign spread',
]

// Must also have European market relevance
const EU_LINK = [
  'euro', 'eur', 'european', 'eurozone', 'aex', 'dax', 'cac', 'ftse', 'ibex', 'mib',
  'ecb', 'asml', 'lvmh', 'shell', 'sap', 'unilever', 'bank', 'stocks', 'equities',
  'yield', 'spread', 'inflation', 'pmi', 'gdp',
]

function cleanTitle(raw) {
  return raw.replace(/\s+-\s+[^-]{2,50}$/, '').trim()
}

function isEUEvent(title) {
  const t = title.toLowerCase()
  return EU_SIGNALS.some(s => t.includes(s)) && EU_LINK.some(s => t.includes(s))
}

function categorize(title) {
  const t = title.toLowerCase()
  if (/ecb|european central bank|lagarde|deposit.facility/.test(t)) return 'ecb'
  if (/earnings|results|revenue|beat|miss|profit.warning/.test(t)) return 'earnings'
  if (/btp.bund|btp-bund|sovereign|spread/.test(t)) return 'bonds'
  if (/cpi|inflation|pmi|gdp|ifo|zew/.test(t)) return 'macro'
  if (/aex|dax|cac|ftse|ibex|mib|equities|stocks/.test(t)) return 'markets'
  return 'macro'
}

function mapToSectors(title) {
  const t = title.toLowerCase()
  const s = []
  if (/ecb|rate.cut|rate.hike|deposit.rate/.test(t)) s.push('Banks', 'REITs', 'Utilities', 'Growth stocks')
  if (/cpi|inflation/.test(t)) s.push('Consumer staples', 'Retailers', 'ECB rate path')
  if (/pmi/.test(t)) s.push('Industrials', 'Cyclicals', 'Autos')
  if (/asml/.test(t)) s.push('ASML', 'Semiconductors', 'AEX')
  if (/lvmh|herm/.test(t)) s.push('LVMH', 'Luxury goods', 'CAC 40')
  if (/shell/.test(t)) s.push('Shell', 'Energy', 'Upstream oil')
  if (/sap/.test(t)) s.push('SAP', 'Enterprise software', 'DAX')
  if (/unilever/.test(t)) s.push('Unilever', 'Consumer staples', 'FTSE 100')
  if (/btp.bund|italy|sovereign/.test(t)) s.push('Italian banks', 'FTSE MIB', 'BTP spread')
  if (/dax/.test(t)) s.push('DAX', 'German industrials', 'Exporters')
  return [...new Set(s)].join(', ') || 'European equities'
}

// ── Seen state ─────────────────────────────────────────────────────────────────

function loadSeen() {
  try {
    const raw = JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8'))
    const cutoff = Date.now() - SEEN_TTL
    return raw.filter(e => new Date(e.seenAt).getTime() > cutoff)
  } catch { return [] }
}

function saveSeen(entries) {
  fs.writeFileSync(SEEN_FILE, JSON.stringify(entries.slice(-500), null, 2), 'utf8')
}

// ── RSS fetch ──────────────────────────────────────────────────────────────────

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 Boursee/1.0' },
      signal: AbortSignal.timeout(8000),
    })
    const xml = await res.text()
    const items = []
    const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/g) ?? []
    for (const block of itemBlocks.slice(0, 8)) {
      const titleM = block.match(/<title><!\[CDATA\[(.+?)\]\]><\/title>/) ??
                     block.match(/<title>([^<]{10,200})<\/title>/)
      const dateM  = block.match(/<pubDate>([^<]+)<\/pubDate>/)
      const linkM  = block.match(/<link>([^<]+)<\/link>/) ??
                     block.match(/<link[^>]*href="([^"]+)"/)
      if (!titleM) continue
      const title = cleanTitle((titleM[1] ?? '').trim())
      const pubDate = dateM ? new Date(dateM[1]) : new Date()
      const url = linkM ? linkM[1].trim() : feed.url
      if (Date.now() - pubDate.getTime() > 4 * 3600 * 1000) continue
      items.push({ title, url, source: feed.source, pubDate })
    }
    return items
  } catch (e) {
    console.warn(`Feed failed (${feed.source}):`, e.message)
    return []
  }
}

// ── AI generation ──────────────────────────────────────────────────────────────

async function generateFlash(event, sectors, category) {
  const prompt = `You are Boursee's European market intelligence analyst. A significant European market event has been detected.

EVENT: "${event.title}"
AFFECTED SECTORS/STOCKS: ${sectors}
CATEGORY: ${category}

Write a flash intelligence article for European equity investors (AEX, DAX, CAC 40, FTSE 100). Use this exact format:

HEADLINE: [Boursee-framed headline showing the market impact, under 75 chars, no source names]
EXCERPT: [One sentence summary for the article card, under 120 chars]
TAGS: [Comma-separated list of 2-3 tags — pick from: ECB, Rates, Macro, CPI, PMI, Earnings, ASML, LVMH, Shell, SAP, Unilever, Banks, REITs, Utilities, Luxury, Energy, AEX, DAX, CAC 40, FTSE, Bonds, BTP-Bund]

## What Happened

One sentence. The specific data point, decision, or move — the number, the direction, vs expectations. Facts only.

## What It Means

2-3 sentences. Name the transmission mechanism and the specific European stocks or sectors affected. E.g. "A 25bp ECB rate cut compresses net interest margins for **ING**, **BNP Paribas** and **Santander** while lowering the discount rate for **ASML** and **SAP** — lifting growth stock valuations mechanically." Be specific about causation, not just direction.

## Who Is Affected

2 sentences. First: name the institutional investors, fund managers, and corporate actors with direct exposure. Second: name the retail investors and end consumers who feel the downstream effect.

## What to Watch

1-2 sentences. The next specific data release, ECB speech, or earnings date that will extend or reverse this move.

CRITICAL GATE — check this FIRST:
If the event is minor market noise (small intraday fluctuation, routine analyst note, non-material company update) with no clear sector-level repricing — respond with exactly: SKIP

RULES:
- MiFID II compliant: educational analysis only, not personalised investment advice
- Bold key data points, stock names on first mention, critical thresholds using **bold**
- Never name news sources
- Write for an English-speaking European investor (Netherlands, Germany, France)
- Total article body 200-250 words
- End with: Source: Boursee European Intelligence | boursee.com`

  const r = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  })
  if (r.content[0].type !== 'text') return null

  const raw = r.content[0].text.trim()
  if (/^SKIP\s*$/i.test(raw)) return null

  const headlineMatch = raw.match(/^HEADLINE:\s*(.+)/m)
  const excerptMatch  = raw.match(/^EXCERPT:\s*(.+)/m)
  const tagsMatch     = raw.match(/^TAGS:\s*(.+)/m)

  const headline = headlineMatch ? headlineMatch[1].trim() : event.title
  const excerpt  = excerptMatch  ? excerptMatch[1].trim()  : ''
  const tagsRaw  = tagsMatch     ? tagsMatch[1].trim()     : 'Macro'
  const body     = raw
    .replace(/^HEADLINE:.*\n?/m, '')
    .replace(/^EXCERPT:.*\n?/m, '')
    .replace(/^TAGS:.*\n?/m, '')
    .trim()

  return { headline, excerpt, tagsRaw, body }
}

// ── Save flash article ─────────────────────────────────────────────────────────

function slugify(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/-$/, '')
}

const TAG_VARIANT_MAP = {
  'ecb': 'gold', 'rates': 'gold', 'luxury': 'gold',
  'btp-bund': 'red',
  'earnings': 'green', 'asml': 'green', 'lvmh': 'green', 'shell': 'green',
  'sap': 'green', 'unilever': 'green',
}

function parseTags(tagsRaw) {
  return tagsRaw.split(',').slice(0, 3).map(t => {
    const label = t.trim()
    const variant = TAG_VARIANT_MAP[label.toLowerCase()] ?? 'default'
    return { label, variant }
  })
}

function formatDate(d) {
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return {
    date: `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_FULL[d.getMonth()]} ${d.getFullYear()}`,
    dateShort: `${DAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  }
}

function getPublishedHeadlines(datePrefix) {
  if (!fs.existsSync(FLASH_DIR)) return new Set()
  return new Set(
    fs.readdirSync(FLASH_DIR)
      .filter(f => f.startsWith(datePrefix) && f.endsWith('.mdx'))
      .map(f => {
        try {
          const m = fs.readFileSync(path.join(FLASH_DIR, f), 'utf8').match(/headline:\s*"(.+)"/)
          return m ? m[1].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40) : ''
        } catch { return '' }
      })
      .filter(Boolean)
  )
}

function saveFlashArticle(event, headline, excerpt, tagsRaw, body, category) {
  const now = new Date()
  const datePrefix = now.toISOString().slice(0, 10)
  const timePrefix = now.toISOString().slice(11, 16).replace(':', '-')
  const slug = `${datePrefix}-${timePrefix}-${slugify(headline)}`
  const fname = `${slug}.mdx`
  const fpath = path.join(FLASH_DIR, fname)

  if (fs.existsSync(fpath)) return null

  const existingHeadlines = getPublishedHeadlines(datePrefix)
  const newKey = headline.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40)
  if (existingHeadlines.has(newKey)) {
    console.log(`    Duplicate headline detected, skipping`)
    return null
  }

  const tags = parseTags(tagsRaw)
  const { date, dateShort } = formatDate(now)

  const mdx = `export const metadata = {
  headline: ${JSON.stringify(headline)},
  excerpt: ${JSON.stringify(excerpt)},
  date: ${JSON.stringify(date)},
  dateShort: ${JSON.stringify(dateShort)},
  tags: ${JSON.stringify(tags)},
  readTime: 2,
  slug: ${JSON.stringify(slug)},
  category: ${JSON.stringify(category)},
  generationMethod: "flash",
  generatedAt: ${JSON.stringify(now.toISOString())},
}

${body}
`.trim()

  fs.writeFileSync(fpath, mdx, 'utf8')
  return fname
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('ANTHROPIC_API_KEY not set — skipping European flash monitor')
    return
  }

  if (!fs.existsSync(FLASH_DIR)) fs.mkdirSync(FLASH_DIR, { recursive: true })

  const seen = loadSeen()
  const seenIds = new Set(seen.map(e => e.id))

  const feedResults = await Promise.all(FEEDS.map(fetchFeed))
  const allItems = feedResults.flat()

  const newEvents = []
  for (const item of allItems) {
    const id = item.title.slice(0, 80)
    if (seenIds.has(id)) continue
    if (!isEUEvent(item.title)) continue
    newEvents.push({ ...item, id })
    seenIds.add(id)
  }

  console.log(`European monitor: ${allItems.length} items fetched, ${newEvents.length} new events`)

  let published = 0
  for (const event of newEvents.slice(0, 2)) {  // max 2 per run
    const sectors = mapToSectors(event.title)
    const category = categorize(event.title)
    console.log(`  → [${category}] ${event.title.slice(0, 80)}`)
    try {
      const result = await generateFlash(event, sectors, category)
      if (!result) {
        console.log(`    Skipped (minor event or no EU market angle)`)
        continue
      }
      const { headline, excerpt, tagsRaw, body } = result
      const fname = saveFlashArticle(event, headline, excerpt, tagsRaw, body, category)
      if (fname) {
        console.log(`    ✓ Published: ${fname}`)
        published++
      }
    } catch (e) {
      console.warn(`    ⚠  Failed: ${e.message}`)
    }
  }

  const now = new Date().toISOString()
  const updatedSeen = [
    ...seen,
    ...newEvents.map(e => ({ id: e.id, seenAt: now })),
  ]
  saveSeen(updatedSeen)

  console.log(`European monitor done — ${published} articles published`)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
