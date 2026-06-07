import { readFile } from 'fs/promises'
import { join } from 'path'
import Link from 'next/link'

interface Stock {
  type?: string
  ticker: string
  name: string
  exchange: string
  sector: string
  changePct: number
}

interface ScreenerData {
  updatedAt: string
  stockCount?: number
  instruments?: Stock[]
  stocks?: Stock[]
}

const EXCHANGE_FLAGS: Record<string, string> = {
  AEX: '🇳🇱', DAX: '🇩🇪', CAC: '🇫🇷', FTSE: '🇬🇧', IBEX: '🇪🇸', FTSE_MIB: '🇮🇹', OMX: '🇸🇪',
}
const EXCHANGE_LABELS: Record<string, string> = {
  AEX: 'AEX', DAX: 'DAX', CAC: 'CAC 40', FTSE: 'FTSE 100', IBEX: 'IBEX 35', FTSE_MIB: 'FTSE MIB', OMX: 'OMX',
}

async function loadScreener(): Promise<ScreenerData | null> {
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'screener.json'), 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function MoverRow({ s, variant }: { s: Stock; variant: 'gainer' | 'loser' }) {
  const sign = s.changePct >= 0 ? '+' : ''
  const color = variant === 'gainer' ? '#16a34a' : '#dc2626'
  const flag = EXCHANGE_FLAGS[s.exchange] ?? ''
  const label = EXCHANGE_LABELS[s.exchange] ?? s.exchange

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)', gap: '12px' }}>
      <div style={{ minWidth: 0 }}>
        <Link href={`/stocks/${s.ticker}`} style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', textDecoration: 'none', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {s.name}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
          <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{flag} {label}</span>
          <span style={{ fontSize: '10px', background: 'var(--paper-2)', color: 'var(--ink-4)', padding: '1px 6px', borderRadius: '2px', fontWeight: 500 }}>{s.sector}</span>
        </div>
      </div>
      <span style={{ fontSize: '15px', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
        {sign}{s.changePct.toFixed(2)}%
      </span>
    </div>
  )
}

export default async function ScreenerTeaser() {
  const data = await loadScreener()
  const all = data?.instruments ?? data?.stocks ?? []
  if (all.length === 0) return null

  const stocks = all.filter(s => s.type !== 'etf')
  const stockCount = data?.stockCount ?? stocks.length
  const sorted = [...stocks].sort((a, b) => b.changePct - a.changePct)
  const gainers = sorted.slice(0, 4)
  const losers  = sorted.slice(-4).reverse()

  if (gainers.length === 0 && losers.length === 0) return null

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
              Markets
            </div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              European Movers Today
            </h2>
          </div>
          <Link href="/screener" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid currentColor', paddingBottom: '1px' }}>
            Open full screener →
          </Link>
        </div>

        {/* Two-column movers grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Gainers */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', borderTop: '3px solid #16a34a' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>▲</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', letterSpacing: '0.02em' }}>Rising Today</span>
            </div>
            {gainers.map((s, i) => (
              <MoverRow key={s.ticker} s={s} variant="gainer" />
            ))}
          </div>

          {/* Losers */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', borderTop: '3px solid #dc2626' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: '#fff1f2', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>▼</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', letterSpacing: '0.02em' }}>Under Pressure</span>
            </div>
            {losers.map((s, i) => (
              <MoverRow key={s.ticker} s={s} variant="loser" />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--ink-4)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
          <span>{stockCount} stocks across AEX · DAX · CAC 40 · FTSE 100 · IBEX 35 · FTSE MIB</span>
          {updatedLabel && <span>Updated {updatedLabel} · prices may be delayed up to 15 min</span>}
        </div>
      </div>
    </section>
  )
}
