'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import type { ScreenerStock, ScreenerETF } from './page'

type ActiveTab     = 'stocks' | 'etfs'
type StockExchange = 'ALL' | 'AEX' | 'DAX' | 'CAC' | 'FTSE' | 'IBEX' | 'FTSE_MIB' | 'OMX'
type RsiFilter     = 'ALL' | 'oversold' | 'neutral' | 'overbought'
type TrendFilter   = 'ALL' | 'bullish' | 'bearish'
type AnalystFilter = 'ALL' | 'Strong Buy' | 'Buy' | 'Hold' | 'Sell'
type BrokerFilter  = 'ALL' | 'DEGIRO' | 'TR'
type DomFilter     = 'ALL' | 'IE' | 'LU' | 'DE'
type AccDistFilter = 'ALL' | 'acc' | 'dist'
type StockSortKey  = 'name' | 'price' | 'changePct' | 'marketCapB' | 'peRatio' | 'dividendYield' | 'relativeStrength' | 'rsi'
type EtfSortKey    = 'name' | 'qualityScore' | 'ter' | 'aumB' | 'changePct' | 'rsi'
type SortDir       = 'asc' | 'desc'

const EXCHANGE_FLAGS: Record<string, string> = {
  AEX: '🇳🇱', DAX: '🇩🇪', CAC: '🇫🇷', FTSE: '🇬🇧', IBEX: '🇪🇸', FTSE_MIB: '🇮🇹', OMX: '🇸🇪',
}
const EXCHANGE_NAMES: Record<string, string> = {
  AEX: 'AEX', DAX: 'DAX', CAC: 'CAC 40', FTSE: 'FTSE 100', IBEX: 'IBEX 35', FTSE_MIB: 'FTSE MIB', OMX: 'OMX',
}

// ── Sub-components ────────────────────────────────────────────────

const CHIP: React.CSSProperties = {
  fontSize: '12px', fontWeight: 500, padding: '5px 12px', borderRadius: '3px',
  cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.12s',
  background: 'none', fontFamily: 'var(--sans)', display: 'inline-block',
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ ...CHIP, ...(active
      ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' }
      : { background: 'var(--paper)', color: 'var(--ink-3)', borderColor: 'var(--border)' }) }}>
      {label}
    </button>
  )
}

function RSICell({ rsi }: { rsi: number | null }) {
  if (rsi == null) return <span style={{ color: 'var(--ink-4)', fontSize: '13px' }}>—</span>
  const color = rsi < 30 ? '#16a34a' : rsi > 70 ? '#dc2626' : 'var(--ink-2)'
  const pct   = Math.min(100, Math.max(0, rsi))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: '72px', height: '7px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: 0,     top: 0, width: '30%', height: '100%', background: '#bbf7d0', borderRadius: '3px 0 0 3px' }} />
        <div style={{ position: 'absolute', left: '30%', top: 0, width: '40%', height: '100%', background: '#e5e7eb' }} />
        <div style={{ position: 'absolute', left: '70%', top: 0, width: '30%', height: '100%', background: '#fecaca', borderRadius: '0 3px 3px 0' }} />
        <div style={{ position: 'absolute', left: `${pct}%`, top: '-3px', transform: 'translateX(-50%)', width: '2px', height: '13px', background: '#111', borderRadius: '1px' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums', minWidth: '36px' }}>
        {rsi.toFixed(1)}
      </span>
    </div>
  )
}

function TrendBadge({ trend }: { trend: 'bullish' | 'bearish' | null }) {
  if (!trend) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  const bull = trend === 'bullish'
  return (
    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '3px', color: bull ? '#16a34a' : '#dc2626', background: bull ? '#dcfce7' : '#fee2e2' }}>
      {bull ? '▲ Bull' : '▼ Bear'}
    </span>
  )
}

function AnalystBadge({ grade }: { grade: string | null }) {
  if (!grade) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  const map: Record<string, { bg: string; color: string }> = {
    'Strong Buy': { bg: '#dcfce7', color: '#166534' },
    'Buy':        { bg: '#f0fdf4', color: '#16a34a' },
    'Hold':       { bg: '#fef9c3', color: '#854d0e' },
    'Sell':       { bg: '#fee2e2', color: '#991b1b' },
  }
  const s = map[grade] ?? { bg: 'var(--paper-2)', color: 'var(--ink-3)' }
  return (
    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '3px', background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {grade}
    </span>
  )
}

function Week52Bar({ price, high, low }: { price: number; high: number | null; low: number | null }) {
  if (!high || !low || high <= low) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  const pct  = Math.round(((price - low) / (high - low)) * 100)
  const safe = Math.min(97, Math.max(3, pct))
  const barColor = pct < 25 ? '#16a34a' : pct > 75 ? '#dc2626' : '#6b7280'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: '72px', height: '5px', background: '#e5e7eb', borderRadius: '2px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: `${safe}%`, top: '-4px', transform: 'translateX(-50%)', width: '2px', height: '13px', background: barColor, borderRadius: '1px' }} />
      </div>
      <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontVariantNumeric: 'tabular-nums', minWidth: '28px' }}>{pct}%</span>
    </div>
  )
}

function RelStrength({ rs }: { rs: number | null }) {
  if (rs == null) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  const color = rs > 2 ? '#16a34a' : rs < -2 ? '#dc2626' : 'var(--ink-3)'
  return (
    <span style={{ fontSize: '13px', fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>
      {rs > 0 ? '+' : ''}{rs.toFixed(1)}%
    </span>
  )
}

function QualityScore({ score }: { score: number }) {
  const bg    = score >= 9 ? '#dcfce7' : score >= 7 ? '#dbeafe' : score >= 5 ? '#fef9c3' : '#fee2e2'
  const color = score >= 9 ? '#166534' : score >= 7 ? '#1e40af' : score >= 5 ? '#854d0e' : '#991b1b'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '14px', fontWeight: 700, color }}>{score}</span>
      <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>/10</span>
      <span style={{ fontSize: '10px', fontWeight: 600, padding: '1px 5px', borderRadius: '2px', background: bg, color }}>{score >= 9 ? '★' : score >= 7 ? '●' : '○'}</span>
    </div>
  )
}

function TerCell({ ter }: { ter: number }) {
  const pct   = (ter * 100).toFixed(2) + '%'
  const color = ter <= 0.10 ? '#16a34a' : ter <= 0.20 ? '#2563eb' : ter <= 0.40 ? '#b45309' : '#dc2626'
  return <span style={{ fontSize: '13px', fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>{pct}</span>
}

function DomicileCell({ domicile }: { domicile?: 'IE' | 'LU' | 'DE' }) {
  const map = {
    IE: { flag: '🇮🇪', label: 'IE', wht: '15%', bg: '#f0fdf4', color: '#166534' },
    LU: { flag: '🇱🇺', label: 'LU', wht: '30%', bg: '#fee2e2', color: '#991b1b' },
    DE: { flag: '🇩🇪', label: 'DE', wht: '15%', bg: '#eff6ff', color: '#1e40af' },
  }
  const d = domicile ? map[domicile] : null
  if (!d) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span>{d.flag}</span>
      <span style={{ fontSize: '12px', fontWeight: 600, color: d.color }}>{d.label}</span>
      <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '2px', background: d.bg, color: d.color, fontWeight: 500 }}>{d.wht} WHT</span>
    </div>
  )
}

function SfdrBadge({ sfdr }: { sfdr?: 'Art.6' | 'Art.8' | 'Art.9' }) {
  if (!sfdr) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  const map = {
    'Art.6': { bg: '#f3f4f6', color: '#6b7280' },
    'Art.8': { bg: '#dbeafe', color: '#1e40af' },
    'Art.9': { bg: '#dcfce7', color: '#166534' },
  }
  const s = map[sfdr]
  return <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '2px', background: s.bg, color: s.color }}>{sfdr}</span>
}

function BrokerBadges({ badges }: { badges?: string[] }) {
  const b = badges ?? []
  if (b.length === 0) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {b.includes('DEGIRO') && (
        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '2px', background: '#dcfce7', color: '#166534', whiteSpace: 'nowrap' }}>DEGIRO FREE</span>
      )}
      {b.includes('TR') && (
        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '2px', background: '#dbeafe', color: '#1e40af', whiteSpace: 'nowrap' }}>TR Plan</span>
      )}
    </div>
  )
}

// ── Impact Bar ────────────────────────────────────────────────────

function ImpactBar({ degiroFreeCount, trPlanCount }: { degiroFreeCount: number; trPlanCount: number }) {
  const [slide, setSlide] = useState(0)

  const insights = [
    {
      icon: '🇮🇪',
      label: 'Domicile Matters',
      text: `Irish-domiciled ETFs pay 15% US dividend withholding vs 30% for Luxembourg. That's €1,410 saved over 30 years on €10k at 4% yield — before compounding.`,
    },
    {
      icon: '🟢',
      label: 'Broker Costs',
      text: `${degiroFreeCount} ETFs in this screener are free to trade on DEGIRO · ${trPlanCount} are available as Trade Republic Savings Plans with no transaction fee.`,
    },
    {
      icon: '🇳🇱',
      label: 'Netherlands Box 3',
      text: `Accumulating vs distributing ETFs are economically identical under Box 3 — both are taxed on your total portfolio value, not on income received.`,
    },
    {
      icon: '🇩🇪',
      label: 'Vorabpauschale 2026',
      text: `Germany's 3.20% base rate applies as a deemed annual distribution on accumulating ETFs each January. The tax is prepaid, not avoided.`,
    },
    {
      icon: '🇫🇷',
      label: 'France PEA',
      text: `IWDA and VWCE are not PEA-eligible — they hold too many non-EU stocks. You need a MSCI Europe ETF like IMEU (75%+ EU/EEA rule).`,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % insights.length), 8000)
    return () => clearInterval(timer)
  }, [insights.length])

  const cur = insights[slide]

  return (
    <div style={{ background: 'var(--ink)', borderRadius: '6px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
      <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1.4 }}>{cur.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '3px' }}>{cur.label}</div>
        <div style={{ fontSize: '13px', lineHeight: 1.55, color: '#d1d5db' }}>{cur.text}</div>
      </div>
      <div style={{ display: 'flex', gap: '5px', flexShrink: 0, alignItems: 'center', paddingTop: '4px' }}>
        {insights.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            style={{ width: '6px', height: '6px', borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: i === slide ? '#fff' : 'rgba(255,255,255,0.25)', transition: 'background 0.2s' }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────

export default function ScreenerClient({
  stocks,
  etfs,
  updatedAt,
  stockCount,
  etfCount,
}: {
  stocks: ScreenerStock[]
  etfs: ScreenerETF[]
  updatedAt?: string
  stockCount?: number
  etfCount?: number
}) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stocks')

  // Stock filters
  const [stockExch,    setStockExch]    = useState<StockExchange>('ALL')
  const [rsiFilter,    setRsi]          = useState<RsiFilter>('ALL')
  const [macdFilter,   setMacd]         = useState<TrendFilter>('ALL')
  const [analystFilter,setAnalyst]      = useState<AnalystFilter>('ALL')
  const [sector,       setSector]       = useState('ALL')
  const [stockSortKey, setStockSortKey] = useState<StockSortKey>('marketCapB')
  const [stockSortDir, setStockSortDir] = useState<SortDir>('desc')

  // ETF filters
  const [brokerFilter,   setBroker]   = useState<BrokerFilter>('ALL')
  const [domFilter,      setDom]      = useState<DomFilter>('ALL')
  const [accDistFilter,  setAccDist]  = useState<AccDistFilter>('ALL')
  const [etfCategory,    setEtfCat]   = useState('ALL')
  const [etfRsiFilter,   setEtfRsi]   = useState<RsiFilter>('ALL')
  const [etfSortKey,     setEtfSortKey] = useState<EtfSortKey>('qualityScore')
  const [etfSortDir,     setEtfSortDir] = useState<SortDir>('desc')

  const derivedStockCount = stockCount ?? stocks.length
  const derivedEtfCount   = etfCount   ?? etfs.length
  const degiroFreeCount   = etfs.filter(e => (e.brokerBadges ?? []).includes('DEGIRO')).length
  const trPlanCount       = etfs.filter(e => (e.brokerBadges ?? []).includes('TR')).length

  const sectors = useMemo(() => {
    return ['ALL', ...Array.from(new Set(stocks.map(s => s.sector))).sort()]
  }, [stocks])

  const etfCategories = useMemo(() => {
    return ['ALL', ...Array.from(new Set(etfs.map(e => e.category))).sort()]
  }, [etfs])

  function toggleStockSort(key: StockSortKey) {
    if (stockSortKey === key) setStockSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setStockSortKey(key); setStockSortDir(key === 'name' ? 'asc' : 'desc') }
  }

  function toggleEtfSort(key: EtfSortKey) {
    if (etfSortKey === key) setEtfSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setEtfSortKey(key); setEtfSortDir(key === 'name' ? 'asc' : 'desc') }
  }

  const filteredStocks = useMemo(() => {
    return stocks
      .filter(s => stockExch === 'ALL' || s.exchange === stockExch)
      .filter(s => sector === 'ALL' || s.sector === sector)
      .filter(s => rsiFilter === 'ALL' || s.rsiSignal === rsiFilter)
      .filter(s => macdFilter === 'ALL' || s.macdTrend === macdFilter)
      .filter(s => analystFilter === 'ALL' || s.analystGrade === analystFilter)
      .sort((a, b) => {
        const nullLast = stockSortDir === 'asc' ? Infinity : -Infinity
        const av = (a[stockSortKey] as number | string | null) ?? nullLast
        const bv = (b[stockSortKey] as number | string | null) ?? nullLast
        if (typeof av === 'string' && typeof bv === 'string') return stockSortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
        return stockSortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
      })
  }, [stocks, stockExch, sector, rsiFilter, macdFilter, analystFilter, stockSortKey, stockSortDir])

  const filteredEtfs = useMemo(() => {
    return etfs
      .filter(e => brokerFilter === 'ALL' || (e.brokerBadges ?? []).includes(brokerFilter))
      .filter(e => domFilter === 'ALL' || e.domicile === domFilter)
      .filter(e => accDistFilter === 'ALL' || (accDistFilter === 'acc' ? e.accumulating : !e.accumulating))
      .filter(e => etfCategory === 'ALL' || e.category === etfCategory)
      .filter(e => etfRsiFilter === 'ALL' || e.rsiSignal === etfRsiFilter)
      .sort((a, b) => {
        const nullLast = etfSortDir === 'asc' ? Infinity : -Infinity
        const av = (a[etfSortKey] as number | string | null) ?? nullLast
        const bv = (b[etfSortKey] as number | string | null) ?? nullLast
        if (typeof av === 'string' && typeof bv === 'string') return etfSortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
        return etfSortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
      })
  }, [etfs, brokerFilter, domFilter, accDistFilter, etfCategory, etfRsiFilter, etfSortKey, etfSortDir])

  const updatedLabel = updatedAt
    ? new Date(updatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' }) + ' CET'
    : null

  const thStyle: React.CSSProperties = { padding: '11px 14px', fontSize: '11px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-4)', whiteSpace: 'nowrap', textAlign: 'left' }

  function StockTh({ sk, children }: { sk: StockSortKey; children: React.ReactNode }) {
    const active = stockSortKey === sk
    return (
      <th onClick={() => toggleStockSort(sk)} style={{ ...thStyle, color: active ? 'var(--accent)' : 'var(--ink-4)', cursor: 'pointer', userSelect: 'none' }}>
        {children}{active ? (stockSortDir === 'asc' ? ' ↑' : ' ↓') : ''}
      </th>
    )
  }

  function EtfTh({ sk, children }: { sk: EtfSortKey; children: React.ReactNode }) {
    const active = etfSortKey === sk
    return (
      <th onClick={() => toggleEtfSort(sk)} style={{ ...thStyle, color: active ? 'var(--accent)' : 'var(--ink-4)', cursor: 'pointer', userSelect: 'none' }}>
        {children}{active ? (etfSortDir === 'asc' ? ' ↑' : ' ↓') : ''}
      </th>
    )
  }

  return (
    <div>
      {/* Impact bar */}
      <ImpactBar degiroFreeCount={degiroFreeCount} trPlanCount={trPlanCount} />

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px', borderBottom: '2px solid var(--border)' }}>
        {(['stocks', 'etfs'] as ActiveTab[]).map(tab => {
          const label = tab === 'stocks' ? `Stocks (${derivedStockCount})` : `ETFs (${derivedEtfCount})`
          const active = activeTab === tab
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              fontSize: '14px', fontWeight: active ? 600 : 400, padding: '10px 20px',
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)',
              color: active ? 'var(--ink)' : 'var(--ink-3)',
              borderBottom: active ? '2px solid var(--ink)' : '2px solid transparent',
              marginBottom: '-2px', transition: 'all 0.15s',
            }}>
              {label}
            </button>
          )
        })}
        {updatedLabel && (
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--ink-4)', alignSelf: 'center', paddingRight: '4px' }}>
            {updatedLabel}
          </span>
        )}
      </div>

      {/* ── STOCKS TAB ──────────────────────────────────────────── */}
      {activeTab === 'stocks' && (
        <>
          {/* Exchange filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500, marginRight: '2px' }}>Exchange</span>
            {(['ALL', 'AEX', 'DAX', 'CAC', 'FTSE', 'IBEX', 'FTSE_MIB', 'OMX'] as StockExchange[]).map(e => {
              const flag = e !== 'ALL' ? (EXCHANGE_FLAGS[e] ?? '') + ' ' : ''
              const name = e === 'ALL' ? 'All' : EXCHANGE_NAMES[e] ?? e
              return <Chip key={e} label={flag + name} active={stockExch === e} onClick={() => setStockExch(e)} />
            })}
          </div>

          {/* Sector + other filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>RSI</span>
              {(['ALL', 'oversold', 'neutral', 'overbought'] as RsiFilter[]).map(r => (
                <Chip key={r} label={r === 'ALL' ? 'Any' : r === 'oversold' ? '<30' : r === 'overbought' ? '>70' : '30–70'} active={rsiFilter === r} onClick={() => setRsi(r)} />
              ))}
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>MACD</span>
              {(['ALL', 'bullish', 'bearish'] as TrendFilter[]).map(m => (
                <Chip key={m} label={m === 'ALL' ? 'Any' : m} active={macdFilter === m} onClick={() => setMacd(m)} />
              ))}
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>Analyst</span>
              {(['ALL', 'Strong Buy', 'Buy', 'Hold', 'Sell'] as AnalystFilter[]).map(a => (
                <Chip key={a} label={a === 'ALL' ? 'Any' : a} active={analystFilter === a} onClick={() => setAnalyst(a)} />
              ))}
            </div>
          </div>

          {/* Sector filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>Sector</span>
            {sectors.map(s => (
              <Chip key={s} label={s === 'ALL' ? 'All sectors' : s} active={sector === s} onClick={() => setSector(s)} />
            ))}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginBottom: '12px' }}>
            {filteredStocks.length} of {derivedStockCount} stocks
          </div>

          {/* Stocks table */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper)' }}>
                <tr>
                  <StockTh sk="name">Company</StockTh>
                  <th style={thStyle}>Exch</th>
                  <th style={thStyle}>Sector</th>
                  <StockTh sk="price">Price</StockTh>
                  <StockTh sk="changePct">Day %</StockTh>
                  <StockTh sk="marketCapB">Mkt Cap</StockTh>
                  <StockTh sk="peRatio">P/E</StockTh>
                  <StockTh sk="dividendYield">Div %</StockTh>
                  <th style={{ ...thStyle, minWidth: '120px' }}>52w Range</th>
                  <th style={thStyle}>Analyst</th>
                  <StockTh sk="relativeStrength">vs Index</StockTh>
                  <StockTh sk="rsi">RSI(14)</StockTh>
                  <th style={thStyle}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan={13} style={{ textAlign: 'center', padding: '48px', color: 'var(--ink-4)', fontSize: '14px' }}>
                      No stocks match the current filters
                    </td>
                  </tr>
                ) : filteredStocks.map((s, i) => {
                  const rsiOversold   = s.rsiSignal === 'oversold'
                  const rsiOverbought = s.rsiSignal === 'overbought'
                  const rowBg = rsiOversold ? '#f6fffb' : rsiOverbought ? '#fff8f8' : i % 2 === 0 ? 'var(--paper)' : '#fff'
                  const exch  = EXCHANGE_NAMES[s.exchange] ?? s.exchange
                  const flag  = EXCHANGE_FLAGS[s.exchange] ?? ''
                  return (
                    <tr key={s.ticker} style={{ borderBottom: i < filteredStocks.length - 1 ? '1px solid var(--border)' : 'none', background: rowBg }}>
                      <td style={{ padding: '12px 14px', minWidth: '160px' }}>
                        <Link href={`/stocks/${s.ticker}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '13px' }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--ink-4)', fontFamily: 'monospace', marginTop: '1px' }}>{s.ticker}</div>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px' }}>{flag} {exch}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--ink-3)', fontSize: '12px', whiteSpace: 'nowrap' }}>{s.sector}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                        {s.price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: s.changePct >= 0 ? '#16a34a' : '#dc2626', whiteSpace: 'nowrap' }}>
                        {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                      </td>
                      <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
                        {s.marketCapB != null ? `€${s.marketCapB.toFixed(1)}B` : <span style={{ color: 'var(--ink-4)' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-2)' }}>
                        {s.peRatio != null ? s.peRatio.toFixed(1) : <span style={{ color: 'var(--ink-4)' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: s.dividendYield && s.dividendYield >= 3 ? '#16a34a' : 'var(--ink-2)' }}>
                        {s.dividendYield != null ? `${s.dividendYield.toFixed(2)}%` : <span style={{ color: 'var(--ink-4)' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <Week52Bar price={s.price} high={s.week52High} low={s.week52Low} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <AnalystBadge grade={s.analystGrade} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <RelStrength rs={s.relativeStrength} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <RSICell rsi={s.rsi} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <TrendBadge trend={s.macdTrend} />
                          {s.macdCross && (
                            <span style={{ fontSize: '10px', fontWeight: 600, color: s.macdCross === 'cross-up' ? '#16a34a' : '#dc2626', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                              {s.macdCross === 'cross-up' ? '⚡ Cross-up' : '⚡ Cross-dn'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Stock legend */}
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: 'var(--ink-4)' }}>
            <span><span style={{ display: 'inline-block', width: '9px', height: '9px', background: '#bbf7d0', borderRadius: '2px', verticalAlign: 'middle', marginRight: '4px' }} />RSI &lt;30 oversold</span>
            <span><span style={{ display: 'inline-block', width: '9px', height: '9px', background: '#fecaca', borderRadius: '2px', verticalAlign: 'middle', marginRight: '4px' }} />RSI &gt;70 overbought</span>
            <span><strong>52w Range</strong>: green = near 52w low (DCA zone) · red = near 52w high</span>
            <span><strong>vs Index</strong>: 30-day return vs benchmark (positive = outperforming)</span>
            <span><strong>Div %</strong>: green if ≥3%</span>
          </div>
        </>
      )}

      {/* ── ETF TAB ─────────────────────────────────────────────── */}
      {activeTab === 'etfs' && (
        <>
          {/* ETF filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>Broker</span>
              {(['ALL', 'DEGIRO', 'TR'] as BrokerFilter[]).map(b => (
                <Chip key={b} label={b === 'ALL' ? 'Any' : b === 'DEGIRO' ? 'DEGIRO Free' : 'TR Plan'} active={brokerFilter === b} onClick={() => setBroker(b)} />
              ))}
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>Domicile</span>
              {(['ALL', 'IE', 'LU', 'DE'] as DomFilter[]).map(d => (
                <Chip key={d} label={d === 'ALL' ? 'Any' : d === 'IE' ? '🇮🇪 Irish' : d === 'LU' ? '🇱🇺 Lux' : '🇩🇪 Germany'} active={domFilter === d} onClick={() => setDom(d)} />
              ))}
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>Type</span>
              {(['ALL', 'acc', 'dist'] as AccDistFilter[]).map(a => (
                <Chip key={a} label={a === 'ALL' ? 'Any' : a === 'acc' ? 'Accumulating' : 'Distributing'} active={accDistFilter === a} onClick={() => setAccDist(a)} />
              ))}
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>RSI</span>
              {(['ALL', 'oversold', 'neutral', 'overbought'] as RsiFilter[]).map(r => (
                <Chip key={r} label={r === 'ALL' ? 'Any' : r === 'oversold' ? '<30' : r === 'overbought' ? '>70' : '30–70'} active={etfRsiFilter === r} onClick={() => setEtfRsi(r)} />
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontWeight: 500 }}>Category</span>
            {etfCategories.map(c => (
              <Chip key={c} label={c === 'ALL' ? 'All' : c} active={etfCategory === c} onClick={() => setEtfCat(c)} />
            ))}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginBottom: '12px' }}>
            {filteredEtfs.length} of {derivedEtfCount} ETFs
          </div>

          {/* ETF table */}
          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper)' }}>
                <tr>
                  <EtfTh sk="name">Fund</EtfTh>
                  <th style={thStyle}>Index Tracked</th>
                  <th style={thStyle}>Cat</th>
                  <EtfTh sk="qualityScore">Quality</EtfTh>
                  <EtfTh sk="ter">TER</EtfTh>
                  <EtfTh sk="aumB">AUM</EtfTh>
                  <th style={thStyle}>Domicile</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>SFDR</th>
                  <th style={thStyle}>Brokers</th>
                  <EtfTh sk="changePct">Day %</EtfTh>
                  <th style={{ ...thStyle, minWidth: '110px' }}>52w Range</th>
                  <EtfTh sk="rsi">RSI(14)</EtfTh>
                </tr>
              </thead>
              <tbody>
                {filteredEtfs.length === 0 ? (
                  <tr>
                    <td colSpan={13} style={{ textAlign: 'center', padding: '48px', color: 'var(--ink-4)', fontSize: '14px' }}>
                      No ETFs match the current filters
                    </td>
                  </tr>
                ) : filteredEtfs.map((e, i) => {
                  const rsiOversold = e.rsiSignal === 'oversold'
                  const rowBg = rsiOversold ? '#f6fffb' : i % 2 === 0 ? 'var(--paper)' : '#fff'
                  return (
                    <tr key={e.ticker} style={{ borderBottom: i < filteredEtfs.length - 1 ? '1px solid var(--border)' : 'none', background: rowBg }}>
                      <td style={{ padding: '12px 14px', minWidth: '180px' }}>
                        <Link href={`/etfs/${e.ticker}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '13px' }}>{e.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--ink-4)', fontFamily: 'monospace', marginTop: '1px' }}>{e.ticker}</div>
                        </Link>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--ink-2)', fontSize: '12px', maxWidth: '160px' }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{e.indexTracked}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--ink-3)', fontSize: '11px', whiteSpace: 'nowrap' }}>{e.category}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <QualityScore score={e.qualityScore} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <TerCell ter={e.ter} />
                      </td>
                      <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
                        €{e.aumB.toFixed(1)}B
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <DomicileCell domicile={e.domicile} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '3px', background: e.accumulating ? '#dbeafe' : '#fef9c3', color: e.accumulating ? '#1e40af' : '#854d0e' }}>
                          {e.accumulating ? 'Acc' : 'Dist'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <SfdrBadge sfdr={e.sfdr} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <BrokerBadges badges={e.brokerBadges} />
                      </td>
                      <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: e.changePct >= 0 ? '#16a34a' : '#dc2626', whiteSpace: 'nowrap' }}>
                        {e.changePct >= 0 ? '+' : ''}{e.changePct.toFixed(2)}%
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <Week52Bar price={e.price} high={e.week52High} low={e.week52Low} />
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <RSICell rsi={e.rsi} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* ETF legend */}
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: 'var(--ink-4)' }}>
            <span><strong>Quality /10</strong>: TER + AUM + domicile + replication — higher is better</span>
            <span><strong>TER</strong>: green ≤0.10% · blue ≤0.20% · amber ≤0.40% · red &gt;0.40%</span>
            <span><strong>WHT</strong>: withholding tax on US dividends — Irish (IE) = 15%, Lux (LU) = 30%</span>
            <span><strong>RSI &lt;30</strong>: potential DCA entry zone</span>
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{ marginTop: '20px', padding: '12px 16px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderRadius: '3px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
        Prices may be delayed up to 15 minutes. General information only under Article 24 MiFID II — not investment advice. Not regulated by the AFM or FCA.
      </div>
    </div>
  )
}
