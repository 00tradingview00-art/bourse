import { unstable_cache } from 'next/cache'
import { TICKER_ITEMS, DASHBOARD_MARKETS } from './data'
import type { MarketData } from '@/types'

const YF_META: Record<string, {
  name: string; country?: string; flag?: string; prefix?: string; decimals: number
}> = {
  '^AEX':       { name: 'AEX',      country: 'NL', flag: '🇳🇱', decimals: 1 },
  '^GDAXI':     { name: 'DAX',      country: 'DE', flag: '🇩🇪', decimals: 1 },
  '^FCHI':      { name: 'CAC 40',   country: 'FR', flag: '🇫🇷', decimals: 1 },
  '^FTSE':      { name: 'FTSE 100', country: 'UK', flag: '🇬🇧', decimals: 1 },
  '^IBEX':      { name: 'IBEX 35',  country: 'ES', flag: '🇪🇸', decimals: 1 },
  'FTSEMIB.MI': { name: 'FTSE MIB', country: 'IT', flag: '🇮🇹', decimals: 0 },
  'BZ=F':       { name: 'Brent',    prefix: '$', decimals: 2 },
  'GC=F':       { name: 'Gold',     prefix: '$', decimals: 0 },
  'ASML.AS':    { name: 'ASML',     prefix: '€', decimals: 2 },
  'ADYEN.AS':   { name: 'Adyen',    prefix: '€', decimals: 0 },
  'SHELL.AS':   { name: 'Shell',    prefix: '€', decimals: 2 },
}

const DASHBOARD_SYMBOLS = ['^AEX', '^GDAXI', '^FCHI', '^FTSE', '^IBEX', 'FTSEMIB.MI']
const YF_TICKER_SYMBOLS = ['^AEX', '^FCHI', '^GDAXI', '^FTSE', '^IBEX', 'ASML.AS', 'ADYEN.AS', 'SHELL.AS', 'BZ=F', 'GC=F']
const ALL_YF = [...new Set([...DASHBOARD_SYMBOLS, ...YF_TICKER_SYMBOLS])]

export const ECB_STATIC: MarketData = {
  name: 'ECB Rate',
  ticker: '',
  value: '2.00%',
  change: 'Jun 11',
  changePct: '↔ Hold',
  direction: 'flat',
}

async function fetchYFChart(symbol: string, v7 = false): Promise<Record<string, unknown> | null> {
  const host = v7 ? 'query2' : 'query1'
  const ver  = v7 ? 'v7'     : 'v8'
  const url = `https://${host}.finance.yahoo.com/${ver}/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
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
    return json?.chart?.result?.[0]?.meta ?? null
  } catch {
    return null
  }
}

async function fetchChart(symbol: string): Promise<Record<string, unknown> | null> {
  return (await fetchYFChart(symbol)) ?? fetchYFChart(symbol, true)
}

function yfToMarketData(meta: Record<string, unknown>, symbol: string): MarketData | null {
  const m = YF_META[symbol]
  if (!m || !meta) return null
  const price    = meta.regularMarketPrice as number
  const prevClose = meta.chartPreviousClose as number
  if (price == null || prevClose == null) return null
  const change    = price - prevClose
  const changePct = (change / prevClose) * 100
  const direction: 'up' | 'down' | 'flat' = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
  const { prefix = '', decimals } = m
  const valueStr  = price.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return {
    name:      m.name,
    ticker:    symbol,
    value:     `${prefix}${valueStr}`,
    change:    `${change >= 0 ? '+' : ''}${change.toFixed(decimals)}`,
    changePct: `${changePct >= 0 ? '+' : '-'}${Math.abs(changePct).toFixed(2)}%`,
    direction,
    country:   m.country,
    flag:      m.flag,
  }
}

async function fetchFXRates(): Promise<MarketData[]> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD,INR', { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json() as { rates: Record<string, number> }
    const fx: MarketData[] = []
    if (data.rates.USD) fx.push({ name: 'EUR/USD', ticker: 'EUR/USD', value: data.rates.USD.toFixed(4), change: '—', changePct: '—', direction: 'flat' })
    if (data.rates.INR) fx.push({ name: 'EUR/INR', ticker: 'EUR/INR', value: `₹${data.rates.INR.toFixed(2)}`, change: '—', changePct: '—', direction: 'flat' })
    return fx
  } catch {
    return []
  }
}

async function _fetchMarkets(): Promise<{ tickerData: MarketData[]; dashboardData: MarketData[]; fetchedAt: string }> {
  const [metaResults, fxRates] = await Promise.all([
    Promise.all(ALL_YF.map(sym => fetchChart(sym))),
    fetchFXRates(),
  ])

  const bySymbol: Record<string, Record<string, unknown>> = {}
  ALL_YF.forEach((sym, i) => { if (metaResults[i]) bySymbol[sym] = metaResults[i]! })
  if (!Object.keys(bySymbol).length) throw new Error('All Yahoo Finance requests failed')

  const tickerData: MarketData[] = [
    ...YF_TICKER_SYMBOLS.map(sym => yfToMarketData(bySymbol[sym] ?? {}, sym)).filter((x): x is MarketData => x !== null),
    ...fxRates,
    ECB_STATIC,
  ]
  const dashboardData: MarketData[] = DASHBOARD_SYMBOLS
    .map(sym => yfToMarketData(bySymbol[sym] ?? {}, sym))
    .filter((x): x is MarketData => x !== null)

  if (!dashboardData.length) throw new Error('No dashboard data returned')

  const fetchedAt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date()) + ' CET'

  return { tickerData, dashboardData, fetchedAt }
}

// 10-minute cache — halves Yahoo Finance request frequency vs. 5-minute
export const fetchMarkets = unstable_cache(
  _fetchMarkets,
  ['market-data'],
  { revalidate: 600, tags: ['market-data'] }
)

export function getStaticMarkets() {
  const fetchedAt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date()) + ' CET (delayed)'
  return { tickerData: TICKER_ITEMS, dashboardData: DASHBOARD_MARKETS, fetchedAt }
}
