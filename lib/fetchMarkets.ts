import { unstable_cache } from 'next/cache'
import { TICKER_ITEMS, DASHBOARD_MARKETS } from './data'
import type { MarketData } from '@/types'

// ─── Twelve Data — 8 European indices (verified against /indices endpoint) ──
// Free tier: 8 credits/minute, 800/day. Exactly 8 symbols fits the burst limit.
// Correct symbols sourced from: https://api.twelvedata.com/indices

const TD_META: Record<string, { name: string; country?: string; flag?: string; decimals: number }> = {
  'AEX':      { name: 'AEX',           country: 'NL', flag: '🇳🇱', decimals: 1 },
  'GDAXI':    { name: 'DAX',           country: 'DE', flag: '🇩🇪', decimals: 1 },
  'FCHI':     { name: 'CAC 40',        country: 'FR', flag: '🇫🇷', decimals: 1 },
  'FTSE':     { name: 'FTSE 100',      country: 'UK', flag: '🇬🇧', decimals: 1 },
  'IBEX':     { name: 'IBEX 35',       country: 'ES', flag: '🇪🇸', decimals: 1 },
  'FTSEMIB':  { name: 'FTSE MIB',      country: 'IT', flag: '🇮🇹', decimals: 0 },
  'STOXX50E': { name: 'Euro Stoxx 50', country: 'EU', flag: '🇪🇺', decimals: 1 },
  'STOXX':    { name: 'Stoxx 600',     country: 'EU', flag: '🇪🇺', decimals: 2 },
}

const TD_ALL_SYMBOLS = Object.keys(TD_META)  // exactly 8

// Twelve Data symbol → dashboard internal key
const TD_TO_INTERNAL: Record<string, string> = {
  'AEX': 'AEX', 'GDAXI': 'DAX', 'FCHI': 'CAC40', 'FTSE': 'FTSE100',
  'IBEX': 'IBEX35', 'FTSEMIB': 'FTSEMIB',
}

function tdToMarket(q: Record<string, string>, symbol: string): MarketData | null {
  const meta = TD_META[symbol]
  if (!meta) return null
  // `close` is null outside market hours — fall back to previous_close
  const rawPrice = q.close ?? q.previous_close
  const price = parseFloat(rawPrice)
  if (isNaN(price)) return null
  const change = parseFloat(q.change ?? '0')
  const pct = parseFloat(q.percent_change ?? '0')
  const { decimals } = meta
  const direction: MarketData['direction'] = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
  return {
    name: meta.name,
    ticker: symbol,
    value: price.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    change: isNaN(parseFloat(q.change)) ? '—' : `${change >= 0 ? '+' : ''}${change.toFixed(decimals)}`,
    changePct: isNaN(parseFloat(q.percent_change)) ? '—' : `${pct >= 0 ? '+' : '-'}${Math.abs(pct).toFixed(2)}%`,
    direction,
    country: meta.country,
    flag: meta.flag,
  }
}

async function fetchTwelveData(): Promise<Map<string, MarketData>> {
  const apiKey = process.env.TWELVE_DATA_API_KEY
  if (!apiKey) throw new Error('TWELVE_DATA_API_KEY not set')

  const url = `https://api.twelvedata.com/quote?symbol=${TD_ALL_SYMBOLS.join(',')}&apikey=${apiKey}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Twelve Data ${res.status}`)
  const json = await res.json()

  // Single symbol → object directly; multiple → { SYMBOL: object }
  const quotes: Record<string, Record<string, string>> =
    TD_ALL_SYMBOLS.length === 1 ? { [TD_ALL_SYMBOLS[0]]: json } : json

  const out = new Map<string, MarketData>()
  for (const sym of TD_ALL_SYMBOLS) {
    const q = quotes[sym]
    if (!q || (q as any).code === 400 || !q.close) continue
    const m = tdToMarket(q, sym)
    if (m) out.set(sym, m)
  }
  if (out.size < 4) throw new Error('Twelve Data: too few results')
  return out
}

// ─── Yahoo Finance — indices fallback + commodity futures ────────

const YAHOO_META: Record<string, { name: string; country?: string; flag?: string; prefix?: string; decimals: number }> = {
  // Indices (fallback when Twelve Data unavailable)
  '^AEX':       { name: 'AEX',           country: 'NL', flag: '🇳🇱', decimals: 1 },
  '^GDAXI':     { name: 'DAX',           country: 'DE', flag: '🇩🇪', decimals: 1 },
  '^FCHI':      { name: 'CAC 40',        country: 'FR', flag: '🇫🇷', decimals: 1 },
  '^FTSE':      { name: 'FTSE 100',      country: 'UK', flag: '🇬🇧', decimals: 1 },
  '^IBEX':      { name: 'IBEX 35',       country: 'ES', flag: '🇪🇸', decimals: 1 },
  'FTSEMIB.MI': { name: 'FTSE MIB',      country: 'IT', flag: '🇮🇹', decimals: 0 },
  '^SX5E':      { name: 'Euro Stoxx 50', country: 'EU', flag: '🇪🇺', decimals: 1 },
  '^SSMI':      { name: 'SMI',           country: 'CH', flag: '🇨🇭', decimals: 1 },
  '^GSPC':      { name: 'S&P 500',       country: 'US', flag: '🇺🇸', decimals: 1 },
  '^NDX':       { name: 'Nasdaq 100',    country: 'US', flag: '🇺🇸', decimals: 1 },
  'ASML.AS':    { name: 'ASML',          prefix: '€', decimals: 2 },
  'ADYEN.AS':   { name: 'Adyen',         prefix: '€', decimals: 0 },
  'SHELL.AS':   { name: 'Shell',         prefix: '€', decimals: 2 },
  // Commodities (always fetched from Yahoo — most reliable for futures)
  'BZ=F':       { name: 'Brent',         prefix: '$', decimals: 2 },
  'GC=F':       { name: 'Gold',          prefix: '$', decimals: 0 },
  'SI=F':       { name: 'Silver',        prefix: '$', decimals: 2 },
  'HG=F':       { name: 'Copper',        prefix: '$', decimals: 3 },
  'NG=F':       { name: 'Nat Gas',       prefix: '$', decimals: 3 },
  'CL=F':       { name: 'WTI',           prefix: '$', decimals: 2 },
}

const YAHOO_INDEX_SYMBOLS = [
  '^AEX', '^GDAXI', '^FCHI', '^FTSE', '^IBEX', 'FTSEMIB.MI',
  '^SX5E', '^SSMI', '^GSPC', '^NDX', 'ASML.AS', 'ADYEN.AS', 'SHELL.AS',
]
const YAHOO_COMMODITY_SYMBOLS = ['BZ=F', 'GC=F', 'SI=F', 'HG=F', 'NG=F', 'CL=F']

// Yahoo Finance internal key → TD internal key (for dashboardData lookup)
const YAHOO_TO_INTERNAL: Record<string, string> = {
  '^AEX': 'AEX', '^GDAXI': 'DAX', '^FCHI': 'CAC40', '^FTSE': 'FTSE100',
  '^IBEX': 'IBEX35', 'FTSEMIB.MI': 'FTSEMIB', '^SX5E': 'EU50', '^SSMI': 'SMI',
}

async function fetchYahoo(symbols: string[]): Promise<Map<string, MarketData>> {
  const url = `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${symbols.join(',')}`
  const fallbackUrl = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}`

  let json: any = null
  for (const endpoint of [url, fallbackUrl]) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      })
      if (!res.ok) continue
      json = await res.json()
      break
    } catch {
      continue
    }
  }

  const out = new Map<string, MarketData>()
  const results = json?.quoteResponse?.result ?? json?.chart?.result ?? []
  for (const q of results) {
    const sym = q.symbol
    const meta = YAHOO_META[sym]
    if (!meta) continue
    const price = q.regularMarketPrice ?? q.meta?.regularMarketPrice
    const prevClose = q.regularMarketPreviousClose ?? q.meta?.chartPreviousClose
    if (price == null || prevClose == null) continue
    const change = price - prevClose
    const pct = (change / prevClose) * 100
    const { prefix = '', decimals } = meta
    const direction: MarketData['direction'] = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
    out.set(sym, {
      name: meta.name,
      ticker: sym,
      value: `${prefix}${price.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`,
      change: `${change >= 0 ? '+' : ''}${change.toFixed(decimals)}`,
      changePct: `${pct >= 0 ? '+' : '-'}${Math.abs(pct).toFixed(2)}%`,
      direction,
      country: meta.country,
      flag: meta.flag,
    })
  }
  return out
}

// ─── Frankfurter — official ECB FX rates ────────────────────────

const FX_META: Record<string, { name: string; prefix?: string; decimals: number }> = {
  'USD': { name: 'EUR/USD', decimals: 4 },
  'GBP': { name: 'EUR/GBP', decimals: 4 },
  'CHF': { name: 'EUR/CHF', decimals: 4 },
  'INR': { name: 'EUR/INR', prefix: '₹', decimals: 2 },
}

async function fetchFrankfurter(): Promise<MarketData[]> {
  try {
    const res = await fetch('https://api.frankfurter.dev/v2/latest?base=EUR&symbols=USD,GBP,CHF,INR', {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const json = await res.json()
    const rates: Record<string, number> = json.rates ?? {}
    return Object.entries(rates).flatMap(([ccy, rate]): MarketData[] => {
      const meta = FX_META[ccy]
      if (!meta) return []
      const { prefix = '', decimals } = meta
      return [{
        name: meta.name,
        ticker: `EUR${ccy}`,
        value: `${prefix}${rate.toFixed(decimals)}`,
        change: '—',
        changePct: '—',
        direction: 'flat' as const,
      }]
    })
  } catch {
    return []
  }
}

// ─── ECB rate — static, updated at ECB meetings ─────────────────

export const ECB_STATIC: MarketData = {
  name: 'ECB Rate', ticker: '', value: '2.00%', change: 'Jun 11', changePct: '▲ +25bp', direction: 'up',
}

// ─── Dashboard index order ───────────────────────────────────────

const DASHBOARD_KEYS = ['AEX', 'DAX', 'CAC40', 'FTSE100', 'IBEX35', 'FTSEMIB']

// ─── Main fetch ──────────────────────────────────────────────────

async function _fetchMarkets(): Promise<{
  tickerData: MarketData[]
  dashboardData: MarketData[]
  fetchedAt: string
}> {
  // Run all three fetches in parallel
  const [tdResult, yahooResult, commodityResult, fxItems] = await Promise.all([
    fetchTwelveData().catch(() => new Map<string, MarketData>()),
    fetchYahoo(YAHOO_INDEX_SYMBOLS),
    fetchYahoo(YAHOO_COMMODITY_SYMBOLS),
    fetchFrankfurter(),
  ])

  const hasTD = tdResult.size >= 4

  // European indices: prefer Twelve Data, fall back per-symbol to Yahoo Finance
  // Internal key map used for dashboardData lookup
  const internalMap = new Map<string, MarketData>()

  if (hasTD) {
    for (const [tdSym, m] of tdResult) {
      const key = TD_TO_INTERNAL[tdSym] ?? tdSym
      internalMap.set(key, m)
    }
  } else {
    for (const [yahoSym, m] of yahooResult) {
      const key = YAHOO_TO_INTERNAL[yahoSym] ?? yahoSym
      internalMap.set(key, m)
    }
  }

  if (internalMap.size < 2 && yahooResult.size < 2) {
    throw new Error('No market data from any source')
  }

  // Ticker order: European indices → global → Amsterdam stocks → commodities → FX → ECB
  const europeanIndexItems: MarketData[] = hasTD
    ? TD_ALL_SYMBOLS.map(k => tdResult.get(k)).filter((x): x is MarketData => x != null)
    : ['^AEX', '^GDAXI', '^FCHI', '^FTSE', '^IBEX', 'FTSEMIB.MI', '^SX5E']
        .map(k => yahooResult.get(k)).filter((x): x is MarketData => x != null)

  const globalAndStockItems: MarketData[] = ['^GSPC', '^NDX', 'ASML.AS', 'ADYEN.AS', 'SHELL.AS']
    .map(k => yahooResult.get(k)).filter((x): x is MarketData => x != null)

  const commodityItems: MarketData[] = YAHOO_COMMODITY_SYMBOLS
    .map(k => commodityResult.get(k)).filter((x): x is MarketData => x != null)

  const tickerData: MarketData[] = [
    ...europeanIndexItems,
    ...globalAndStockItems,
    ...commodityItems,
    ...fxItems,
    ECB_STATIC,
  ]

  // Dashboard: 6 core European indices (internal keys)
  const dashboardData: MarketData[] = DASHBOARD_KEYS
    .map(k => internalMap.get(k))
    .filter((x): x is MarketData => x != null)

  if (!dashboardData.length) throw new Error('No dashboard data')

  const fetchedAt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date()) + ' CET'

  return { tickerData, dashboardData, fetchedAt }
}

export const fetchMarkets = unstable_cache(
  _fetchMarkets,
  ['market-data'],
  { revalidate: 1200, tags: ['market-data'] },  // 20 min — fits Twelve Data free tier
)

export function getStaticMarkets() {
  const fetchedAt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date()) + ' CET (delayed)'
  return { tickerData: TICKER_ITEMS, dashboardData: DASHBOARD_MARKETS, fetchedAt }
}
