'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { ScreenerStock, ScreenerETF } from '@/app/screener/page'

type Instrument = ScreenerStock | ScreenerETF

const EXCHANGE_FLAG: Record<string, string> = {
  AEX: '🇳🇱', DAX: '🇩🇪', CAC: '🇫🇷', FTSE: '🇬🇧', IBEX: '🇪🇸', FTSE_MIB: '🇮🇹', OMX: '🇸🇪',
  EURONEXT: '🇪🇺', XETRA: '🇩🇪', LSE: '🇬🇧',
}

export default function SearchClient({ instruments }: { instruments: Instrument[] }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 1) return []
    return instruments.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.ticker.toLowerCase().includes(q) ||
      ('sector' in s && s.sector?.toLowerCase().includes(q)) ||
      ('category' in s && s.category?.toLowerCase().includes(q)) ||
      s.exchange?.toLowerCase().includes(q)
    ).slice(0, 20)
  }, [query, instruments])

  const showPlaceholder = query.length < 1
  const noResults = query.length >= 1 && results.length === 0

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 32px 96px' }}>

      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--ink-4)', pointerEvents: 'none' }}>
          ⌕
        </div>
        <input
          type="text"
          autoFocus
          placeholder="Search by name, ticker, or sector…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '14px 16px 14px 44px',
            fontSize: '16px', fontFamily: 'var(--sans)',
            border: '1.5px solid var(--border)', borderRadius: '6px',
            background: '#fff', color: 'var(--ink)', outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border)')}
        />
        {query.length > 0 && (
          <button
            onClick={() => setQuery('')}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--ink-4)', padding: '4px' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick chips */}
      {showPlaceholder && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Popular searches</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ASML', 'VWCE', 'SAP', 'LVMH', 'Inditex', 'Enel', 'Technology', 'Financials', 'AEX', 'IBEX'].map(q => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                style={{ fontSize: '13px', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '100px', background: '#fff', color: 'var(--ink-3)', cursor: 'pointer', transition: 'border-color 0.12s, color 0.12s', fontFamily: 'var(--sans)' }}
                onMouseEnter={e => { (e.currentTarget).style.borderColor = 'var(--accent)'; (e.currentTarget).style.color = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget).style.borderColor = 'var(--border)'; (e.currentTarget).style.color = 'var(--ink-3)' }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {noResults && (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink-4)' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>—</div>
          <div style={{ fontSize: '14px' }}>No results for "<strong>{query}</strong>"</div>
          <div style={{ fontSize: '13px', marginTop: '8px', color: 'var(--ink-4)' }}>Try a different name, ticker, or sector</div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{ display: 'grid', gap: '0' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '10px' }}>
            {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
          {results.map(s => {
            const isEtf = s.type === 'etf'
            const href = isEtf ? `/etfs/${s.ticker}` : `/stocks/${s.ticker}`
            const changePositive = (s.changePct ?? 0) >= 0
            const flag = EXCHANGE_FLAG[s.exchange] ?? '🌍'
            const sub = isEtf
              ? ('category' in s ? s.category : '')
              : ('sector' in s ? s.sector : '')
            const label = isEtf
              ? (s.exchange === 'EURONEXT' ? 'Euronext' : s.exchange === 'XETRA' ? 'Xetra' : s.exchange)
              : s.exchange?.replace('_', ' ')

            return (
              <Link key={s.ticker} href={href} style={{ textDecoration: 'none' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: '1px solid var(--border)', background: '#fff', cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'var(--paper-2)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = '#fff')}
                >
                  <div style={{ fontSize: '20px', width: '28px', textAlign: 'center', flexShrink: 0 }}>{flag}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '14px' }}>{s.name}</span>
                      <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '2px', background: isEtf ? '#dbeafe' : 'var(--paper-2)', color: isEtf ? '#1e40af' : 'var(--ink-4)', letterSpacing: '0.04em', textTransform: 'uppercase', flexShrink: 0 }}>
                        {isEtf ? 'ETF' : 'Stock'}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px', display: 'flex', gap: '8px' }}>
                      <span style={{ fontFamily: 'monospace' }}>{s.ticker}</span>
                      <span>·</span>
                      <span>{label}</span>
                      {sub && <><span>·</span><span>{sub}</span></>}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
                      €{(s.price ?? 0).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: changePositive ? '#16a34a' : '#dc2626' }}>
                      {changePositive ? '+' : ''}{(s.changePct ?? 0).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Link href="/screener" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Browse full screener →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
