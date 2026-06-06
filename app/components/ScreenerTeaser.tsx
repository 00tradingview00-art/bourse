import { readFile } from 'fs/promises'
import { join } from 'path'
import Link from 'next/link'

interface ScreenerStock {
  type?: string
  ticker: string
  name: string
  exchange: string
  rsi: number | null
  rsiSignal: string
  macdTrend: string | null
  supertrend: string | null
  changePct: number
}

interface ScreenerData {
  updatedAt: string
  stockCount?: number
  instruments?: ScreenerStock[]
  stocks?: ScreenerStock[]
}

async function loadScreener(): Promise<ScreenerData | null> {
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'screener.json'), 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function RSIMini({ rsi }: { rsi: number | null }) {
  if (rsi == null) return <span style={{ color: 'var(--ink-4)', fontSize: '13px' }}>—</span>
  const numColor = rsi < 30 ? '#16a34a' : rsi > 70 ? '#dc2626' : 'var(--ink-3)'
  const pct = Math.min(100, Math.max(0, rsi))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: '56px', height: '6px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: '30%', height: '100%', background: '#bbf7d0', borderRadius: '3px 0 0 3px' }} />
        <div style={{ position: 'absolute', left: '30%', top: 0, width: '40%', height: '100%', background: '#e5e7eb' }} />
        <div style={{ position: 'absolute', left: '70%', top: 0, width: '30%', height: '100%', background: '#fecaca', borderRadius: '0 3px 3px 0' }} />
        <div style={{ position: 'absolute', left: `${pct}%`, top: '-3px', transform: 'translateX(-50%)', width: '2px', height: '12px', background: '#111', borderRadius: '1px' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 700, color: numColor, fontVariantNumeric: 'tabular-nums', minWidth: '32px' }}>
        {rsi.toFixed(1)}
      </span>
    </div>
  )
}

function TrendPill({ trend }: { trend: string | null }) {
  if (!trend) return <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>—</span>
  const bull = trend === 'bullish'
  return (
    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '2px', color: bull ? '#16a34a' : '#dc2626', background: bull ? '#dcfce7' : '#fee2e2' }}>
      {bull ? '▲ Bull' : '▼ Bear'}
    </span>
  )
}

export default async function ScreenerTeaser() {
  const data = await loadScreener()
  const all = data?.instruments ?? data?.stocks ?? []
  if (all.length === 0) return null

  // Show stocks only in teaser
  const stocks = all.filter(s => s.type !== 'etf')
  const stockCount = data?.stockCount ?? stocks.length

  const oversold   = stocks.filter(s => s.rsiSignal === 'oversold').sort((a, b) => (a.rsi ?? 99) - (b.rsi ?? 99)).slice(0, 3)
  const overbought = stocks.filter(s => s.rsiSignal === 'overbought').sort((a, b) => (b.rsi ?? 0) - (a.rsi ?? 0)).slice(0, 3)
  const highlights = [...oversold, ...overbought]

  if (highlights.length === 0) return null

  const updatedLabel = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        timeZone: 'Europe/Amsterdam',
      }) + ' CET'
    : null

  return (
    <section style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Signal Watch
            </div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              RSI Extremes Today
            </h2>
          </div>
          <Link href="/screener" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid currentColor', paddingBottom: '1px' }}>
            Open full screener →
          </Link>
        </div>

        {/* Table */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 110px 110px 90px', gap: '0', padding: '10px 20px', background: 'var(--paper)', borderBottom: '1px solid var(--border)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
            <div>Stock</div>
            <div>RSI(14)</div>
            <div>MACD</div>
            <div>SuperTrend</div>
            <div style={{ textAlign: 'right' }}>Change</div>
          </div>

          {highlights.map((s, i) => {
            const zone = s.rsiSignal === 'oversold' ? { label: 'Oversold', bg: '#f0fdf4', border: '#16a34a' } : { label: 'Overbought', bg: '#fff1f1', border: '#dc2626' }
            const exchangeLabel = s.exchange === 'FTSE_MIB' ? 'FTSE MIB' : s.exchange
            return (
              <div
                key={s.ticker}
                style={{ display: 'grid', gridTemplateColumns: '1fr 120px 110px 110px 90px', gap: '0', padding: '12px 20px', borderBottom: i < highlights.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center', background: zone.bg }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}>{s.name}</span>
                    <span style={{ fontSize: '11px', background: 'var(--accent-light)', color: 'var(--accent)', padding: '1px 6px', borderRadius: '2px', fontWeight: 500 }}>{exchangeLabel}</span>
                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '2px', background: 'transparent', color: zone.border, border: `1px solid ${zone.border}` }}>
                      {zone.label}
                    </span>
                  </div>
                </div>
                <div><RSIMini rsi={s.rsi} /></div>
                <div><TrendPill trend={s.macdTrend} /></div>
                <div><TrendPill trend={s.supertrend} /></div>
                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '14px', color: s.changePct >= 0 ? '#16a34a' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
                  {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--ink-4)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
          <span>RSI(14) · MACD(12,26,9) · SuperTrend(10,3) · {stockCount} stocks screened</span>
          {updatedLabel && <span>Updated {updatedLabel} · prices may be delayed</span>}
        </div>
      </div>
    </section>
  )
}
