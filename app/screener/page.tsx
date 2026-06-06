import { readFile } from 'fs/promises'
import { join } from 'path'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ScreenerClient from './ScreenerClient'

export const revalidate = 3600

export interface ScreenerStock {
  type: 'stock'
  ticker: string
  name: string
  exchange: 'AEX' | 'DAX' | 'CAC' | 'FTSE' | 'IBEX' | 'FTSE_MIB' | 'OMX'
  sector: string
  price: number
  change: number
  changePct: number
  peRatio: number | null
  dividendYield: number | null
  marketCapB: number | null
  analystGrade: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | null
  week52High: number | null
  week52Low: number | null
  relativeStrength: number | null
  rsi: number | null
  rsiSignal: 'oversold' | 'neutral' | 'overbought' | 'unknown'
  macdTrend: 'bullish' | 'bearish' | null
  macdHist: number | null
  macdCross: 'cross-up' | 'cross-down' | null
  supertrend: 'bullish' | 'bearish' | null
  volumeSignal: 'surge' | 'high' | 'normal' | 'low'
  volumeRatio: number | null
}

export interface ScreenerETF {
  type: 'etf'
  ticker: string
  name: string
  exchange: 'EURONEXT' | 'XETRA' | 'LSE'
  indexTracked: string
  category: string
  ter: number
  aumB: number
  domicile: 'IE' | 'LU' | 'DE'
  accumulating: boolean
  sfdr: 'Art.6' | 'Art.8' | 'Art.9'
  replication: 'physical' | 'synthetic'
  brokerBadges: string[]
  qualityScore: number
  price: number
  changePct: number
  week52High: number | null
  week52Low: number | null
  rsi: number | null
  rsiSignal: 'oversold' | 'neutral' | 'overbought' | 'unknown'
}

interface ScreenerData {
  updatedAt: string
  stockCount?: number
  etfCount?: number
  stocks?: ScreenerStock[]
  etfs?: ScreenerETF[]
  // backward compat with older instruments format
  instruments?: (ScreenerStock | { type?: string })[]
}

async function loadScreenerData(): Promise<{
  stocks: ScreenerStock[]
  etfs: ScreenerETF[]
  stockCount: number
  etfCount: number
  updatedAt: string
}> {
  try {
    const raw  = await readFile(join(process.cwd(), 'data', 'screener.json'), 'utf8')
    const data: ScreenerData = JSON.parse(raw)

    if (data.stocks && data.etfs) {
      return {
        stocks:     data.stocks,
        etfs:       data.etfs,
        stockCount: data.stockCount ?? data.stocks.length,
        etfCount:   data.etfCount   ?? data.etfs.length,
        updatedAt:  data.updatedAt  ?? '',
      }
    }

    // Backward compat: single instruments array
    const instruments = data.instruments ?? []
    const stocks = instruments.filter(i => i.type === 'stock' || !('type' in i)) as ScreenerStock[]
    const etfs   = instruments.filter(i => i.type === 'etf') as ScreenerETF[]
    return {
      stocks,
      etfs,
      stockCount: data.stockCount ?? stocks.length,
      etfCount:   data.etfCount   ?? etfs.length,
      updatedAt:  data.updatedAt  ?? '',
    }
  } catch {
    return { stocks: [], etfs: [], stockCount: 0, etfCount: 0, updatedAt: '' }
  }
}

export default async function ScreenerPage() {
  const { stocks, etfs, stockCount, etfCount, updatedAt } = await loadScreenerData()

  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam',
      }) + ' CET'
    : null

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px 36px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Intelligence Layer
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '12px', lineHeight: 1.15 }}>
              European Screener
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--ink-3)', maxWidth: '640px', lineHeight: 1.65 }}>
              {stockCount > 0 ? stockCount : '180+'} stocks across AEX, DAX, CAC 40, FTSE 100, IBEX 35, FTSE MIB and OMX — screened on fundamentals and technicals. Plus {etfCount > 0 ? etfCount : '22'} UCITS ETFs with quality scores and broker badges.
            </p>
            {updatedLabel && (
              <p style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '12px' }}>
                Data as of {updatedLabel}
              </p>
            )}
          </div>
        </div>

        {/* Screener — client component handles filters + sort */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 96px' }}>
          {stocks.length === 0 && etfs.length === 0 ? (
            <EmptyState />
          ) : (
            <ScreenerClient
              stocks={stocks}
              etfs={etfs}
              updatedAt={updatedAt}
              stockCount={stockCount}
              etfCount={etfCount}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 32px', color: 'var(--ink-3)' }}>
      <div style={{ fontSize: '32px', marginBottom: '16px' }}>📊</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
        Screener data updating
      </h2>
      <p style={{ fontSize: '14px', lineHeight: 1.65, maxWidth: '360px', margin: '0 auto' }}>
        Market data is fetched after each European market close (18:30 CET). Check back after the first automated run.
      </p>
    </div>
  )
}
