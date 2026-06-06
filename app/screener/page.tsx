import { readFile } from 'fs/promises'
import { join } from 'path'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ScreenerClient from './ScreenerClient'

export const revalidate = 3600

export interface ScreenerStock {
  type: 'stock' | 'etf'
  ticker: string
  name: string
  exchange: 'AEX' | 'DAX' | 'CAC' | 'FTSE' | 'IBEX' | 'FTSE_MIB' | 'XETRA' | 'LSE' | 'EURONEXT'
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
  stockCount?: number
  etfCount?: number
  count?: number
  instruments?: ScreenerStock[]
  stocks?: ScreenerStock[]
}

async function loadScreenerData(): Promise<{ instruments: ScreenerStock[]; stockCount: number; etfCount: number; updatedAt: string }> {
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'screener.json'), 'utf8')
    const data: ScreenerData = JSON.parse(raw)
    const instruments = data.instruments ?? data.stocks ?? []
    const stockCount = data.stockCount ?? instruments.filter(i => i.type === 'stock' || !i.type).length
    const etfCount   = data.etfCount   ?? instruments.filter(i => i.type === 'etf').length
    return { instruments, stockCount, etfCount, updatedAt: data.updatedAt ?? '' }
  } catch {
    return { instruments: [], stockCount: 0, etfCount: 0, updatedAt: '' }
  }
}

export default async function ScreenerPage() {
  const { instruments, stockCount, etfCount, updatedAt } = await loadScreenerData()

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
            <p style={{ fontSize: '15px', color: 'var(--ink-3)', maxWidth: '600px', lineHeight: 1.65 }}>
              AEX, DAX, CAC 40, FTSE 100, IBEX 35 and FTSE MIB — {stockCount > 0 ? `${stockCount} stocks` : 'stocks'}{etfCount > 0 ? ` and ${etfCount} ETFs` : ''} screened daily for RSI, MACD, SuperTrend and volume signals.
            </p>
            {updatedLabel && (
              <p style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '12px' }}>
                Data as of {updatedLabel} · {stockCount} stocks · {etfCount} ETFs
              </p>
            )}
          </div>
        </div>

        {/* Screener table — client component handles filters + sort */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 96px' }}>
          {instruments.length === 0 ? (
            <EmptyState />
          ) : (
            <ScreenerClient
              stocks={instruments}
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
        Market data is fetched and indicators computed after each European market close (18:30 CET). Check back after the first automated run.
      </p>
    </div>
  )
}
