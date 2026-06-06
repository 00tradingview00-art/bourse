import { readFile } from 'fs/promises'
import { join } from 'path'
import Link from 'next/link'

interface ScreenerStock {
  type?: string
  ticker: string
  name: string
  exchange: string
  price: number
  changePct: number
  rsiSignal: string
  macdTrend: string | null
  supertrend: string | null
}

interface ScreenerData {
  updatedAt: string
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

function signalLabel(s: ScreenerStock): { text: string; color: string; bg: string } {
  const bull = [s.rsiSignal === 'oversold', s.macdTrend === 'bullish', s.supertrend === 'bullish'].filter(Boolean).length
  const bear = [s.rsiSignal === 'overbought', s.macdTrend === 'bearish', s.supertrend === 'bearish'].filter(Boolean).length
  if (bull >= 3) return { text: '▲▲ Strong Bull', color: '#166534', bg: '#dcfce7' }
  if (bull === 2) return { text: '▲ Bull',         color: '#16a34a', bg: '#f0fdf4' }
  if (bear === 2) return { text: '▼ Bear',         color: '#c0392b', bg: '#fff1f1' }
  if (bear >= 3)  return { text: '▼▼ Strong Bear', color: '#991b1b', bg: '#fee2e2' }
  return { text: '→ Neutral', color: 'var(--ink-4)', bg: 'var(--paper-2)' }
}

export default async function MarketMovers() {
  const data = await loadScreener()
  const all = data?.instruments ?? data?.stocks ?? []
  if (all.length === 0) return null

  // Show stocks only in market movers (not ETFs)
  const stocks = all.filter(s => s.type !== 'etf')
  const valid  = stocks.filter(s => Math.abs(s.changePct) < 50)
  const sorted = [...valid].sort((a, b) => b.changePct - a.changePct)
  const gainers = sorted.slice(0, 3)
  const losers  = sorted.slice(-3).reverse()

  const updatedLabel = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleString('en-GB', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
        timeZone: 'Europe/Amsterdam',
      }) + ' CET'
    : null

  function Row({ s, isGainer }: { s: ScreenerStock; isGainer: boolean }) {
    const sig = signalLabel(s)
    const exchangeLabel = s.exchange === 'FTSE_MIB' ? 'FTSE MIB' : s.exchange
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '1px' }}>
            <span style={{ fontFamily: 'monospace' }}>{s.ticker}</span>
            <span style={{ marginLeft: '6px', background: 'var(--accent-light)', color: 'var(--accent)', padding: '1px 5px', borderRadius: '2px', fontFamily: 'inherit' }}>{exchangeLabel}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: isGainer ? '#16a34a' : 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>
            {isGainer ? '+' : ''}{s.changePct.toFixed(2)}%
          </div>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '2px', background: sig.bg, color: sig.color, whiteSpace: 'nowrap' }}>
            {sig.text}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>Market Movers</div>
        <Link href="/screener" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
          Full screener →
        </Link>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ padding: '10px 0 4px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#16a34a' }}>
          Top Gainers
        </div>
        {gainers.map(s => <Row key={s.ticker} s={s} isGainer={true} />)}

        <div style={{ padding: '14px 0 4px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)' }}>
          Top Losers
        </div>
        {losers.map(s => <Row key={s.ticker} s={s} isGainer={false} />)}
      </div>

      {updatedLabel && (
        <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--ink-4)' }}>
          Yahoo Finance · {updatedLabel} · 15 min delay
        </div>
      )}
    </div>
  )
}
