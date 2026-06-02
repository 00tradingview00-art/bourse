import { unstable_cache } from 'next/cache'
import { TICKER_ITEMS, DASHBOARD_MARKETS } from './data'
import type { MarketData } from '@/types'

const SYMBOL_META: Record<string, {
  name: string
  country?: string
  flag?: string
  prefix?: string
  decimals: number
}> = {
  '^AEX':       { name: 'AEX',       country: 'NL', flag: '🇳🇱', decimals: 1 },
  '^GDAXI':     { name: 'DAX',       country: 'DE', flag: '🇩🇪', decimals: 1 },
  '^FCHI':      { name: 'CAC 40',    country: 'FR', flag: '🇫🇷', decimals: 1 },
  '^FTSE':      { name: 'FTSE 100',  country: 'UK', flag: '🇬🇧', decimals: 1 },
  '^IBEX':      { name: 'IBEX 35',   country: 'ES', flag: '🇪🇸', decimals: 1 },
  'FTSEMIB.MI': { name: 'FTSE MIB',  country: 'IT', flag: '🇮🇹', decimals: 0 },
  'EURUSD=X':   { name: 'EUR/USD',   decimals: 4 },
  'EURINR=X':   { name: 'EUR/INR',   prefix: '₹', decimals: 2 },
  'EURGBP=X':   { name: 'EUR/GBP',   decimals: 4 },
  'BZ=F':       { name: 'Brent',     prefix: '$', decimals: 2 },
  'GC=F':       { name: 'Gold',      prefix: '$', decimals: 0 },
  'ASML.AS':    { name: 'ASML',      prefix: '€', decimals: 2 },
  'ADYEN.AS':   { name: 'Adyen',     prefix: '€', decimals: 0 },
  'SHELL.AS':   { name: 'Shell',     prefix: '€', decimals: 2 },
}

export const ECB_STATIC: MarketData = {
  name: 'ECB Rate',
  ticker: '',
  value: '2.00%',
  change: 'Jun 11',
  changePct: '▲ +25bp',
  direction: 'up',
}

const DASHBOARD_SYMBOLS = ['^AEX', '^GDAXI', '^FCHI', '^FTSE', '^IBEX', 'FTSEMIB.MI']
const TICKER_SYMBOLS = ['^AEX', '^FCHI', '^GDAXI', '^FTSE', '^IBEX', 'EURUSD=X', 'EURINR=X', 'ASML.AS', 'ADYEN.AS', 'SHELL.AS', 'BZ=F', 'GC=F']
const ALL_SYMBOLS = [...new Set([...DASHBOARD_SYMBOLS, ...TICKER_SYMBOLS])]

async function fetchChart(symbol: string): Promise<Record<string, unknown> | null> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = await res.json()
    const meta = json?.chart?.result?.[0]?.meta
    return meta ?? null
  } catch {
    return null
  }
}

function toMarketData(meta: Record<string, unknown>, symbol: string): MarketData | null {
  const symMeta = SYMBOL_META[symbol]
  if (!symMeta || !meta) return null
  const { prefix = '', decimals } = symMeta
  const price = meta.regularMarketPrice as number
  const prevClose = meta.chartPreviousClose as number
  if (price == null || prevClose == null) return null
  const change = price - prevClose
  const changePct = (change / prevClose) * 100
  const direction: 'up' | 'down' | 'flat' = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
  const valueStr = price.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  const changeSign = change >= 0 ? '+' : ''
  const pctSign = changePct >= 0 ? '+' : '-'
  return {
    name: symMeta.name,
    ticker: symbol,
    value: `${prefix}${valueStr}`,
    change: `${changeSign}${change.toFixed(decimals)}`,
    changePct: `${pctSign}${Math.abs(changePct).toFixed(2)}%`,
    direction,
    country: symMeta.country,
    flag: symMeta.flag,
  }
}

async function _fetchMarkets(): Promise<{
  tickerData: MarketData[]
  dashboardData: MarketData[]
  fetchedAt: string
}> {
  const metaResults = await Promise.all(ALL_SYMBOLS.map(sym => fetchChart(sym)))
  const bySymbol: Record<string, Record<string, unknown>> = {}
  for (let i = 0; i < ALL_SYMBOLS.length; i++) {
    const m = metaResults[i]
    if (m) bySymbol[ALL_SYMBOLS[i]] = m
  }
  if (!Object.keys(bySymbol).length) throw new Error('All Yahoo Finance requests failed')

  const tickerData: MarketData[] = [
    ...TICKER_SYMBOLS.map(sym => toMarketData(bySymbol[sym] ?? {}, sym)).filter((x): x is MarketData => x !== null),
    ECB_STATIC,
  ]
  const dashboardData: MarketData[] = DASHBOARD_SYMBOLS
    .map(sym => toMarketData(bySymbol[sym] ?? {}, sym))
    .filter((x): x is MarketData => x !== null)

  if (!dashboardData.length) throw new Error('No dashboard data returned')

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
  { revalidate: 300, tags: ['market-data'] }
)

export function getStaticMarkets() {
  const fetchedAt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date()) + ' CET (delayed)'
  return { tickerData: TICKER_ITEMS, dashboardData: DASHBOARD_MARKETS, fetchedAt }
}
