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
  base: { fontSize: '13px', fontWeight: 500, padding: '6px 14px', borderRadius: '3px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s', display: 'inline-block' } as const,
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

// RSI zone track: three coloured bands (oversold/neutral/overbought) with a
// position tick showing where the current value falls.
function RSICell({ rsi }: { rsi: number | null }) {
  if (rsi == null) return <span style={{ color: 'var(--ink-4)', fontSize: '14px' }}>—</span>
  const numColor = rsi < 30 ? '#16a34a' : rsi > 70 ? '#dc2626' : 'var(--ink-2)'
  const pct = Math.min(100, Math.max(0, rsi))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Zone track — 90px wide so the tick is easy to read */}
      <div style={{ position: 'relative', width: '90px', height: '8px', flexShrink: 0 }}>
        {/* Oversold zone (0–30) */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '30%', height: '100%', background: '#bbf7d0', borderRadius: '4px 0 0 4px' }} />
        {/* Neutral zone (30–70) */}
        <div style={{ position: 'absolute', left: '30%', top: 0, width: '40%', height: '100%', background: '#e5e7eb' }} />
        {/* Overbought zone (70–100) */}
        <div style={{ position: 'absolute', left: '70%', top: 0, width: '30%', height: '100%', background: '#fecaca', borderRadius: '0 4px 4px 0' }} />
        {/* Position tick */}
        <div style={{
          position: 'absolute',
          left: `${pct}%`,
          top: '-3px',
          transform: 'translateX(-50%)',
          width: '3px',
          height: '14px',
          background: '#111',
          borderRadius: '2px',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.6)',
        }} />
      </div>
      <span style={{ fontSize: '14px', fontWeight: 700, color: numColor, fontVariantNumeric: 'tabular-nums', minWidth: '38px' }}>
        {rsi.toFixed(1)}
      </span>
    </div>
  )
}

function TrendBadge({ trend }: { trend: 'bullish' | 'bearish' | null }) {
  if (!trend) return <span style={{ color: 'var(--ink-4)', fontSize: '13px' }}>—</span>
  const bull = trend === 'bullish'
  return (
    <span style={{
      fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '3px',
      color: bull ? '#16a34a' : '#dc2626',
      background: bull ? '#dcfce7' : '#fee2e2',
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
  return <span style={{ fontSize: '13px', color, fontWeight: signal === 'surge' ? 600 : 400 }}>{label}</span>
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
        style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: active ? 'var(--accent)' : 'var(--ink-4)', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
      >
        {children}{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
      </th>
    )
  }

  const thStyle = { padding: '12px 16px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: 'var(--ink-4)' }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(['ALL', 'AEX', 'DAX', 'CAC', 'FTSE'] as Exchange[]).map(e => (
            <Chip key={e} label={e === 'ALL' ? 'All exchanges' : e} active={exchange === e} onClick={() => setExchange(e)} />
          ))}
        </div>

        <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 500 }}>RSI</span>
          {(['ALL', 'oversold', 'neutral', 'overbought'] as RsiFilter[]).map(r => (
            <Chip key={r} label={r === 'ALL' ? 'Any' : r === 'oversold' ? '<30' : r === 'overbought' ? '>70' : '30–70'} active={rsiFilter === r} onClick={() => setRsi(r)} />
          ))}
        </div>

        <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 500 }}>MACD</span>
          {(['ALL', 'bullish', 'bearish'] as TrendFilter[]).map(m => (
            <Chip key={m} label={m === 'ALL' ? 'Any' : m} active={macdFilter === m} onClick={() => setMacd(m)} />
          ))}
        </div>

        <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 500 }}>ST</span>
          {(['ALL', 'bullish', 'bearish'] as TrendFilter[]).map(st => (
            <Chip key={st} label={st === 'ALL' ? 'Any' : st} active={stFilter === st} onClick={() => setSt(st)} />
          ))}
        </div>

        <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 500 }}>Vol</span>
          {(['ALL', 'surge', 'high', 'normal', 'low'] as VolumeFilter[]).map(v => (
            <Chip key={v} label={v === 'ALL' ? 'Any' : v} active={volFilter === v} onClick={() => setVol(v)} />
          ))}
        </div>
      </div>

      {/* Result count */}
      <div style={{ fontSize: '13px', color: 'var(--ink-4)', marginBottom: '16px' }}>
        {filtered.length} stock{filtered.length !== 1 ? 's' : ''} shown
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '4px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper)' }}>
            <tr>
              <SortTh sk="name">Name</SortTh>
              <th style={thStyle}>Exchange</th>
              <th style={thStyle}>Sector</th>
              <SortTh sk="price">Price</SortTh>
              <SortTh sk="changePct">Chg %</SortTh>
              <SortTh sk="rsi">RSI(14)</SortTh>
              <th style={thStyle}>MACD</th>
              <th style={thStyle}>SuperTrend</th>
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
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '14px' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-4)', fontFamily: 'monospace', marginTop: '2px' }}>{s.ticker}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, background: 'var(--accent-light, #e8f0ec)', color: 'var(--accent)', padding: '3px 9px', borderRadius: '3px' }}>{s.exchange}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--ink-3)', fontSize: '13px' }}>{s.sector}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', fontSize: '14px' }}>
                    {s.price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '14px 16px', fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '14px', color: s.changePct >= 0 ? '#16a34a' : '#dc2626' }}>
                    {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                  </td>
                  <td style={{ padding: '14px 16px' }}><RSICell rsi={s.rsi} /></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <TrendBadge trend={s.macdTrend} />
                      {s.macdCross && (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: s.macdCross === 'cross-up' ? '#16a34a' : '#dc2626', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {s.macdCross === 'cross-up' ? '⚡ Cross-up' : '⚡ Cross-down'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}><TrendBadge trend={s.supertrend} /></td>
                  <td style={{ padding: '14px 16px' }}><VolBadge signal={s.volumeSignal} ratio={s.volumeRatio} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '12px', color: 'var(--ink-4)' }}>
        <span>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#bbf7d0', borderRadius: '2px', verticalAlign: 'middle', marginRight: '4px' }} />
          RSI &lt;30 oversold
        </span>
        <span>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#fecaca', borderRadius: '2px', verticalAlign: 'middle', marginRight: '4px' }} />
          RSI &gt;70 overbought
        </span>
        <span><strong>MACD</strong> histogram sign = trend · ⚡ recent crossover</span>
        <span><strong>SuperTrend</strong>(10,3) price vs ATR band</span>
        <span><strong>Vol surge</strong> ≥2× · <strong>high</strong> ≥1.5× 20-day avg</span>
        <span style={{ marginLeft: 'auto' }}>Not investment advice · Data may be delayed</span>
      </div>
    </div>
  )
}
