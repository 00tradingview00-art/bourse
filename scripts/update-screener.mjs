/**
 * update-screener.mjs
 * Fetches 3 months of daily OHLCV from Yahoo Finance for ~50 European stocks,
 * computes RSI(14), MACD(12,26,9), SuperTrend(10,3), and volume signal,
 * then writes data/screener.json.
 *
 * Run: node scripts/update-screener.mjs
 * No API key required. Runs after European market close (18:30 UTC weekdays).
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT       = join(__dirname, '..')
const OUTPUT     = join(ROOT, 'data', 'screener.json')

// ── Stock universe ────────────────────────────────────────────────
const STOCKS = [
  // AEX — Euronext Amsterdam
  { ticker: 'ASML.AS',   name: 'ASML',            exchange: 'AEX', sector: 'Technology' },
  { ticker: 'SHELL.AS',  name: 'Shell',            exchange: 'AEX', sector: 'Energy' },
  { ticker: 'ADYEN.AS',  name: 'Adyen',            exchange: 'AEX', sector: 'Financials' },
  { ticker: 'INGA.AS',   name: 'ING',              exchange: 'AEX', sector: 'Financials' },
  { ticker: 'ABN.AS',    name: 'ABN AMRO',         exchange: 'AEX', sector: 'Financials' },
  { ticker: 'HEIA.AS',   name: 'Heineken',         exchange: 'AEX', sector: 'Consumer' },
  { ticker: 'WKL.AS',    name: 'Wolters Kluwer',   exchange: 'AEX', sector: 'Technology' },
  { ticker: 'MT.AS',     name: 'ArcelorMittal',    exchange: 'AEX', sector: 'Materials' },
  { ticker: 'PHIA.AS',   name: 'Philips',          exchange: 'AEX', sector: 'Healthcare' },
  { ticker: 'NN.AS',     name: 'NN Group',         exchange: 'AEX', sector: 'Financials' },
  { ticker: 'AKZA.AS',   name: 'Akzo Nobel',       exchange: 'AEX', sector: 'Materials' },
  { ticker: 'STLAM.AS',  name: 'Stellantis',       exchange: 'AEX', sector: 'Autos' },
  { ticker: 'URW.AS',    name: 'Unibail-Rodamco',  exchange: 'AEX', sector: 'Real Estate' },
  { ticker: 'RAND.AS',   name: 'Randstad',         exchange: 'AEX', sector: 'Industrials' },

  // DAX — Xetra Frankfurt
  { ticker: 'SAP.DE',    name: 'SAP',              exchange: 'DAX', sector: 'Technology' },
  { ticker: 'SIE.DE',    name: 'Siemens',          exchange: 'DAX', sector: 'Industrials' },
  { ticker: 'ALV.DE',    name: 'Allianz',          exchange: 'DAX', sector: 'Financials' },
  { ticker: 'MBG.DE',    name: 'Mercedes-Benz',    exchange: 'DAX', sector: 'Autos' },
  { ticker: 'BMW.DE',    name: 'BMW',              exchange: 'DAX', sector: 'Autos' },
  { ticker: 'DTE.DE',    name: 'Deutsche Telekom', exchange: 'DAX', sector: 'Telecoms' },
  { ticker: 'RWE.DE',    name: 'RWE',              exchange: 'DAX', sector: 'Energy' },
  { ticker: 'BAYN.DE',   name: 'Bayer',            exchange: 'DAX', sector: 'Healthcare' },
  { ticker: 'BAS.DE',    name: 'BASF',             exchange: 'DAX', sector: 'Materials' },
  { ticker: 'IFX.DE',    name: 'Infineon',         exchange: 'DAX', sector: 'Technology' },
  { ticker: 'DBK.DE',    name: 'Deutsche Bank',    exchange: 'DAX', sector: 'Financials' },
  { ticker: 'VOW3.DE',   name: 'Volkswagen',       exchange: 'DAX', sector: 'Autos' },
  { ticker: 'LIN.DE',    name: 'Linde',            exchange: 'DAX', sector: 'Materials' },
  { ticker: 'MRK.DE',    name: 'Merck',            exchange: 'DAX', sector: 'Healthcare' },

  // CAC 40 — Euronext Paris
  { ticker: 'MC.PA',     name: 'LVMH',             exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'TTE.PA',    name: 'TotalEnergies',    exchange: 'CAC', sector: 'Energy' },
  { ticker: 'BNP.PA',    name: 'BNP Paribas',      exchange: 'CAC', sector: 'Financials' },
  { ticker: 'AIR.PA',    name: 'Airbus',           exchange: 'CAC', sector: 'Industrials' },
  { ticker: 'SAN.PA',    name: 'Sanofi',           exchange: 'CAC', sector: 'Healthcare' },
  { ticker: 'OR.PA',     name: "L'Oréal",          exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'GLE.PA',    name: 'Société Générale', exchange: 'CAC', sector: 'Financials' },
  { ticker: 'SU.PA',     name: 'Schneider Electric', exchange: 'CAC', sector: 'Industrials' },
  { ticker: 'ACA.PA',    name: 'Crédit Agricole',  exchange: 'CAC', sector: 'Financials' },
  { ticker: 'CS.PA',     name: 'AXA',              exchange: 'CAC', sector: 'Financials' },
  { ticker: 'KER.PA',    name: 'Kering',           exchange: 'CAC', sector: 'Consumer' },
  { ticker: 'BN.PA',     name: 'Danone',           exchange: 'CAC', sector: 'Consumer' },

  // FTSE 100 — London Stock Exchange
  { ticker: 'HSBA.L',    name: 'HSBC',             exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'BP.L',      name: 'BP',               exchange: 'FTSE', sector: 'Energy' },
  { ticker: 'AZN.L',     name: 'AstraZeneca',      exchange: 'FTSE', sector: 'Healthcare' },
  { ticker: 'GSK.L',     name: 'GSK',              exchange: 'FTSE', sector: 'Healthcare' },
  { ticker: 'RIO.L',     name: 'Rio Tinto',        exchange: 'FTSE', sector: 'Materials' },
  { ticker: 'ULVR.L',    name: 'Unilever',         exchange: 'FTSE', sector: 'Consumer' },
  { ticker: 'REL.L',     name: 'RELX',             exchange: 'FTSE', sector: 'Technology' },
  { ticker: 'BA.L',      name: 'BAE Systems',      exchange: 'FTSE', sector: 'Defence' },
  { ticker: 'LLOY.L',    name: 'Lloyds',           exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'BARC.L',    name: 'Barclays',         exchange: 'FTSE', sector: 'Financials' },
  { ticker: 'VOD.L',     name: 'Vodafone',         exchange: 'FTSE', sector: 'Telecoms' },
  { ticker: 'SHEL.L',    name: 'Shell (LSE)',       exchange: 'FTSE', sector: 'Energy' },
]

// ── Yahoo Finance fetch ───────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms))

async function fetchHistory(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=3mo`
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const result = json?.chart?.result?.[0]
      if (!result) throw new Error('No result in response')

      const meta      = result.meta
      const timestamps = result.timestamp ?? []
      const quote     = result.indicators?.quote?.[0] ?? {}
      const closes    = (quote.close  ?? []).map(v => v ?? null)
      const highs     = (quote.high   ?? []).map(v => v ?? null)
      const lows      = (quote.low    ?? []).map(v => v ?? null)
      const volumes   = (quote.volume ?? []).map(v => v ?? null)

      // Remove nulls (non-trading days) — keep aligned arrays
      const valid = timestamps.map((_, i) => closes[i] != null && highs[i] != null && lows[i] != null)
      const c = closes.filter((_, i) => valid[i])
      const h = highs.filter((_, i)  => valid[i])
      const l = lows.filter((_, i)   => valid[i])
      const v = volumes.filter((_, i) => valid[i])

      return {
        price:     meta.regularMarketPrice,
        prevClose: meta.chartPreviousClose,
        closes: c, highs: h, lows: l, volumes: v,
      }
    } catch (err) {
      if (attempt === 3) return null
      await delay(800 * attempt)
    }
  }
  return null
}

// ── Technical indicators ──────────────────────────────────────────

function computeRSI(closes, period = 14) {
  if (closes.length < period + 1) return null
  let gains = 0, losses = 0
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1]
    if (diff > 0) gains += diff
    else losses -= diff
  }
  // Wilder smoothing: seed with simple avg over first period, then smooth
  const seed = closes.slice(-(period + 1))
  let avgGain = 0, avgLoss = 0
  for (let i = 1; i <= period; i++) {
    const d = seed[i] - seed[i - 1]
    if (d > 0) avgGain += d; else avgLoss -= d
  }
  avgGain /= period
  avgLoss /= period
  // Apply Wilder smoothing for remaining bars
  for (let i = closes.length - period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1]
    const g = d > 0 ? d : 0
    const ls = d < 0 ? -d : 0
    avgGain = (avgGain * (period - 1) + g) / period
    avgLoss = (avgLoss * (period - 1) + ls) / period
  }
  if (avgLoss === 0) return 100
  return parseFloat((100 - 100 / (1 + avgGain / avgLoss)).toFixed(1))
}

function emaArray(data, period) {
  const k = 2 / (period + 1)
  const result = new Array(data.length)
  result[0] = data[0]
  for (let i = 1; i < data.length; i++) result[i] = data[i] * k + result[i - 1] * (1 - k)
  return result
}

function computeMACD(closes, fast = 12, slow = 26, signal = 9) {
  if (closes.length < slow + signal + 1) return null
  const ema12 = emaArray(closes, fast)
  const ema26 = emaArray(closes, slow)
  const macdLine   = ema12.map((v, i) => v - ema26[i])
  const signalLine = emaArray(macdLine, signal)
  const histogram  = macdLine.map((v, i) => v - signalLine[i])
  const n = histogram.length
  const hist     = parseFloat(histogram[n - 1].toFixed(4))
  const prevHist = parseFloat(histogram[n - 2].toFixed(4))
  let crossover = null
  if (hist > 0 && prevHist <= 0) crossover = 'cross-up'
  else if (hist < 0 && prevHist >= 0) crossover = 'cross-down'
  return {
    value:     parseFloat(macdLine[n - 1].toFixed(4)),
    signal:    parseFloat(signalLine[n - 1].toFixed(4)),
    histogram: hist,
    trend:     hist > 0 ? 'bullish' : 'bearish',
    crossover,
  }
}

function computeSuperTrend(highs, lows, closes, period = 10, multiplier = 3) {
  if (closes.length < period + 2) return null
  // True Range
  const tr = closes.map((c, i) => {
    if (i === 0) return highs[0] - lows[0]
    return Math.max(highs[i] - lows[i], Math.abs(highs[i] - closes[i - 1]), Math.abs(lows[i] - closes[i - 1]))
  })
  // Wilder ATR
  let atr = tr.slice(0, period).reduce((a, b) => a + b, 0) / period
  const atrs = [atr]
  for (let i = period; i < tr.length; i++) {
    atr = (atr * (period - 1) + tr[i]) / period
    atrs.push(atr)
  }

  let trend = 1, upperBand = 0, lowerBand = 0
  for (let i = 0; i < atrs.length; i++) {
    const ci  = i + period - 1
    const hl2 = (highs[ci] + lows[ci]) / 2
    const rawUpper = hl2 + multiplier * atrs[i]
    const rawLower = hl2 - multiplier * atrs[i]
    if (i === 0) {
      upperBand = rawUpper; lowerBand = rawLower
      trend = closes[ci] >= hl2 ? 1 : -1
    } else {
      // Bands only tighten, never widen mid-trend
      upperBand = rawUpper < upperBand || closes[ci - 1] > upperBand ? rawUpper : upperBand
      lowerBand = rawLower > lowerBand || closes[ci - 1] < lowerBand ? rawLower : lowerBand
      trend = trend === 1
        ? (closes[ci] < lowerBand ? -1 : 1)
        : (closes[ci] > upperBand ? 1 : -1)
    }
  }
  return trend === 1 ? 'bullish' : 'bearish'
}

function computeVolumeSignal(volumes, lookback = 20) {
  if (volumes.length < lookback + 1) return { signal: 'normal', ratio: null }
  const recent  = volumes[volumes.length - 1]
  const avg     = volumes.slice(-lookback - 1, -1).reduce((a, b) => a + b, 0) / lookback
  const ratio   = avg > 0 ? parseFloat((recent / avg).toFixed(2)) : null
  let signal = 'normal'
  if (ratio !== null) {
    if (ratio >= 2.0) signal = 'surge'
    else if (ratio >= 1.5) signal = 'high'
    else if (ratio <= 0.5) signal = 'low'
  }
  return { signal, ratio }
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log(`Updating screener — ${STOCKS.length} stocks`)
  const results = []
  let ok = 0, failed = 0

  for (let i = 0; i < STOCKS.length; i++) {
    const stock = STOCKS[i]
    process.stdout.write(`  [${i + 1}/${STOCKS.length}] ${stock.ticker.padEnd(12)}`)
    const data = await fetchHistory(stock.ticker)

    if (!data || data.closes.length < 30) {
      console.log('✗ insufficient data')
      failed++
      await delay(300)
      continue
    }

    const price     = data.price
    const prevClose = data.prevClose
    const change    = price - prevClose
    const changePct = parseFloat(((change / prevClose) * 100).toFixed(2))

    const rsi        = computeRSI(data.closes)
    const macd       = computeMACD(data.closes)
    const supertrend = computeSuperTrend(data.highs, data.lows, data.closes)
    const vol        = computeVolumeSignal(data.volumes)

    const rsiSignal = rsi == null ? 'unknown'
      : rsi < 30 ? 'oversold'
      : rsi > 70 ? 'overbought'
      : 'neutral'

    results.push({
      ticker:      stock.ticker,
      name:        stock.name,
      exchange:    stock.exchange,
      sector:      stock.sector,
      price:       parseFloat(price.toFixed(2)),
      change:      parseFloat(change.toFixed(2)),
      changePct,
      rsi,
      rsiSignal,
      macdTrend:   macd?.trend ?? null,
      macdHist:    macd?.histogram ?? null,
      macdCross:   macd?.crossover ?? null,
      supertrend,
      volumeSignal:  vol.signal,
      volumeRatio:   vol.ratio,
    })

    console.log(`✓  price=${price.toFixed(1)} rsi=${rsi ?? '?'} macd=${macd?.trend ?? '?'} st=${supertrend ?? '?'} vol=${vol.signal}`)
    ok++
    await delay(350) // throttle Yahoo Finance
  }

  const output = {
    updatedAt: new Date().toISOString(),
    count: results.length,
    stocks: results.sort((a, b) => a.exchange.localeCompare(b.exchange) || a.name.localeCompare(b.name)),
  }

  if (!existsSync(join(ROOT, 'data'))) await mkdir(join(ROOT, 'data'), { recursive: true })
  await writeFile(OUTPUT, JSON.stringify(output, null, 2), 'utf8')
  console.log(`\n✓ Screener updated — ${ok} stocks, ${failed} failed → data/screener.json`)
}

main().catch(err => { console.error('Screener update failed:', err.message); process.exit(1) })
