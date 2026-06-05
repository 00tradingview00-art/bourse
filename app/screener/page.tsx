import { readFile } from 'fs/promises'
import { join } from 'path'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ScreenerClient from './ScreenerClient'

export const revalidate = 3600 // re-render at most every hour; data updates daily

export interface ScreenerStock {
  ticker: string
  name: string
  exchange: 'AEX' | 'DAX' | 'CAC' | 'FTSE'
  sector: string
  price: number
  change: number
  changePct: number
  rsi: number | null
  rsiSignal: 'oversold' | 'neutral' | 'overbought' | 'unknown'
  macdTrend: 'bullish' | 'bearish' | null
  macdHist: number | null
  macdCross: 'cross-up' | 'cross-down' | null
  supertrend: 'bullish' | 'bearish' | null
  volumeSignal: 'surge' | 'high' | 'normal' | 'low'
  volumeRatio: number | null
}

interface ScreenerData {
  updatedAt: string
  count: number
  stocks: ScreenerStock[]
}

async function loadScreenerData(): Promise<ScreenerData> {
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'screener.json'), 'utf8')
    return JSON.parse(raw)
  } catch {
    return { updatedAt: '', count: 0, stocks: [] }
  }
}

export default async function ScreenerPage() {
  const data = await loadScreenerData()

  const updatedLabel = data.updatedAt
    ? new Date(data.updatedAt).toLocaleString('en-GB', {
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
            <p style={{ fontSize: '15px', color: 'var(--ink-3)', maxWidth: '540px', lineHeight: 1.65 }}>
              AEX, DAX, CAC and FTSE 100 stocks screened daily for RSI, MACD, SuperTrend and volume signals. Updated after each European close.
            </p>
            {updatedLabel && (
              <p style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '12px' }}>
                Data as of {updatedLabel} · {data.count} stocks
              </p>
            )}
          </div>
        </div>

        {/* Screener table — client component handles filters + sort */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 96px' }}>
          {data.stocks.length === 0 ? (
            <EmptyState />
          ) : (
            <ScreenerClient stocks={data.stocks} updatedAt={data.updatedAt} />
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
        Market data is fetched and indicators computed after each European market close (18:30 CET). Check back after the first automated run.
      </p>
    </div>
  )
}
