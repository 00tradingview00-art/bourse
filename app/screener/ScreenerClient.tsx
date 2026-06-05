'use client'

import { useState, useMemo } from 'react'
import type { ScreenerStock } from './page'

type Exchange = 'ALL' | 'AEX' | 'DAX' | 'CAC' | 'FTSE'
type RsiFilter = 'ALL' | 'oversold' | 'neutral' | 'overbought'
type TrendFilter = 'ALL' | 'bullish' | 'bearish'
type VolumeFilter = 'ALL' | 'surge' | 'high' | 'normal' | 'low'
type SortKey = 'name' | 'price' | 'changePct' | 'rsi' | 'macdHist' | 'volumeRatio'
type SortDir = 'asc' | 'desc'

const CHIP = {
  base: { fontSize: '12px', fontWeight: 500, padding: '5px 12px', borderRadius: '3px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s', display: 'inline-block' } as const,
  active: { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' } as const,
  inactive: { background: 'var(--paper)', color: 'var(--ink-3)', borderColor: 'var(--border)' } as const,
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ ...CHIP.base, ...(active ? CHIP.active : CHIP.inactive) }}>
      {label}
    </button>
  )
}

function RSIBar({ rsi }: { rsi: number | null }) {
  if (rsi == null) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  const color = rsi < 30 ? '#16a34a' : rsi > 70 ? 'var(--red, #dc2626)' : 'var(--ink-3)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '48px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, rsi)}%`, height: '100%', background: color, borderRadius: '2px' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>{rsi.toFixed(1)}</span>
    </div>
  )
}

function TrendBadge({ trend }: { trend: 'bullish' | 'bearish' | null }) {
  if (!trend) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  const bull = trend === 'bullish'
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '3px',
      color: bull ? '#16a34a' : 'var(--red, #dc2626)',
      background: bull ? '#dcfce7' : 'var(--red-light, #fee2e2)',
    }}>
      {bull ? '▲ Bull' : '▼ Bear'}
    </span>
  )
}

function VolBadge({ signal, ratio }: { signal: string; ratio: number | null }) {
  const map: Record<string, { color: string; label: string }> = {
    surge:  { color: '#7c3aed', label: `${ratio?.toFixed(1)}× surge` },
    high:   { color: '#2563eb', label: `${ratio?.toFixed(1)}× high` },
    normal: { color: 'var(--ink-4)', label: 'Normal' },
    low:    { color: 'var(--ink-4)', label: `${ratio?.toFixed(1)}× low` },
  }
  const { color, label } = map[signal] ?? { color: 'var(--ink-4)', label: '—' }
  return <span style={{ fontSize: '12px', color, fontWeight: signal === 'surge' ? 600 : 400 }}>{label}</span>
}

const SORT_LABELS: Record<SortKey, string> = {
  name: 'Name', price: 'Price', changePct: 'Change %', rsi: 'RSI', macdHist: 'MACD Hist', volumeRatio: 'Volume ×',
}

export default function ScreenerClient({ stocks }: { stocks: ScreenerStock[] }) {
  const [exchange, setExchange]   = useState<Exchange>('ALL')
  const [rsiFilter, setRsi]       = useState<RsiFilter>('ALL')
  const [macdFilter, setMacd]     = useState<TrendFilter>('ALL')
  const [stFilter, setSt]         = useState<TrendFilter>('ALL')
  const [volFilter, setVol]       = useState<VolumeFilter>('ALL')
  const [sortKey, setSortKey]     = useState<SortKey>('name')
  const [sortDir, setSortDir]     = useState<SortDir>('asc')

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    return stocks
      .filter(s => exchange === 'ALL' || s.exchange === exchange)
      .filter(s => rsiFilter === 'ALL' || s.rsiSignal === rsiFilter)
      .filter(s => macdFilter === 'ALL' || s.macdTrend === macdFilter)
      .filter(s => stFilter === 'ALL' || s.supertrend === stFilter)
      .filter(s => volFilter === 'ALL' || s.volumeSignal === volFilter)
      .sort((a, b) => {
        const av = a[sortKey] ?? (sortDir === 'asc' ? Infinity : -Infinity)
        const bv = b[sortKey] ?? (sortDir === 'asc' ? Infinity : -Infinity)
        if (typeof av === 'string' && typeof bv === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
        return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
      })
  }, [stocks, exchange, rsiFilter, macdFilter, stFilter, volFilter, sortKey, sortDir])

  function SortTh({ sk, children }: { sk: SortKey; children: React.ReactNode }) {
    const active = sortKey === sk
    return (
      <th
        onClick={() => toggleSort(sk)}
        style={{ textAlign: 'left', padding: '10px 14px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: active ? 'var(--accent)' : 'var(--ink-4)', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
      >
        {children}{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
      </th>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        {/* Exchange */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['ALL', 'AEX', 'DAX', 'CAC', 'FTSE'] as Exchange[]).map(e => (
            <Chip key={e} label={e === 'ALL' ? 'All exchanges' : e} active={exchange === e} onClick={() => setExchange(e)} />
          ))}
        </div>

        <div style={{ width: '1px', background: 'var(--border)' }} />

        {/* RSI */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--ink-4)', alignSelf: 'center', marginRight: '2px' }}>RSI</span>
          {(['ALL', 'oversold', 'neutral', 'overbought'] as RsiFilter[]).map(r => (
            <Chip key={r} label={r === 'ALL' ? 'Any' : r === 'oversold' ? '&lt;30' : r === 'overbought' ? '&gt;70' : '30–70'} active={rsiFilter === r} onClick={() => setRsi(r)} />
          ))}
        </div>

        <div style={{ width: '1px', background: 'var(--border)' }} />

        {/* MACD */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--ink-4)', alignSelf: 'center', marginRight: '2px' }}>MACD</span>
          {(['ALL', 'bullish', 'bearish'] as TrendFilter[]).map(m => (
            <Chip key={m} label={m === 'ALL' ? 'Any' : m} active={macdFilter === m} onClick={() => setMacd(m)} />
          ))}
        </div>

        <div style={{ width: '1px', background: 'var(--border)' }} />

        {/* SuperTrend */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--ink-4)', alignSelf: 'center', marginRight: '2px' }}>ST</span>
          {(['ALL', 'bullish', 'bearish'] as TrendFilter[]).map(st => (
            <Chip key={st} label={st === 'ALL' ? 'Any' : st} active={stFilter === st} onClick={() => setSt(st)} />
          ))}
        </div>

        <div style={{ width: '1px', background: 'var(--border)' }} />

        {/* Volume */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--ink-4)', alignSelf: 'center', marginRight: '2px' }}>Vol</span>
          {(['ALL', 'surge', 'high', 'normal', 'low'] as VolumeFilter[]).map(v => (
            <Chip key={v} label={v === 'ALL' ? 'Any' : v} active={volFilter === v} onClick={() => setVol(v)} />
          ))}
        </div>
      </div>

      {/* Result count */}
      <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginBottom: '16px' }}>
        {filtered.length} stock{filtered.length !== 1 ? 's' : ''} shown
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '4px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper)' }}>
            <tr>
              <SortTh sk="name">Name</SortTh>
              <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Exchange</th>
              <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Sector</th>
              <SortTh sk="price">Price</SortTh>
              <SortTh sk="changePct">Chg %</SortTh>
              <SortTh sk="rsi">RSI(14)</SortTh>
              <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>MACD</th>
              <th style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>SuperTrend</th>
              <SortTh sk="volumeRatio">Volume</SortTh>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: 'var(--ink-4)', fontSize: '14px' }}>
                  No stocks match the current filters
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => (
                <tr
                  key={s.ticker}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--paper)' : '#fff' }}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{s.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', fontFamily: 'monospace', marginTop: '2px' }}>{s.ticker}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, background: 'var(--accent-light, #e8f0ec)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '3px' }}>{s.exchange}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--ink-3)', fontSize: '12px' }}>{s.sector}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                    {s.price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: s.changePct >= 0 ? '#16a34a' : 'var(--red, #dc2626)' }}>
                    {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                  </td>
                  <td style={{ padding: '12px 14px' }}><RSIBar rsi={s.rsi} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <TrendBadge trend={s.macdTrend} />
                      {s.macdCross && (
                        <span style={{ fontSize: '10px', fontWeight: 600, color: s.macdCross === 'cross-up' ? '#16a34a' : 'var(--red, #dc2626)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {s.macdCross === 'cross-up' ? '⚡ Cross-up' : '⚡ Cross-down'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}><TrendBadge trend={s.supertrend} /></td>
                  <td style={{ padding: '12px 14px' }}><VolBadge signal={s.volumeSignal} ratio={s.volumeRatio} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '11px', color: 'var(--ink-4)' }}>
        <span><strong>RSI</strong> &lt;30 oversold · &gt;70 overbought</span>
        <span><strong>MACD</strong> histogram sign = trend; ⚡ = recent crossover</span>
        <span><strong>SuperTrend</strong>(10,3) price vs adaptive ATR band</span>
        <span><strong>Vol surge</strong> ≥2× 20-day avg · <strong>high</strong> ≥1.5×</span>
        <span style={{ marginLeft: 'auto', color: 'var(--ink-4)' }}>Not investment advice · Data may be delayed</span>
      </div>
    </div>
  )
}
