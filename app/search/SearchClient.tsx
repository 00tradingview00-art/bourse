'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { ScreenerStock, ScreenerETF } from '@/app/screener/page'

type Instrument = ScreenerStock | ScreenerETF

interface IntelligenceResult {
  answer: string
  tickers: string[]
  guides: string[]
}

interface Props {
  instruments: Instrument[]
  stockCount: number
  etfCount: number
}

const EXCHANGE_FLAG: Record<string, string> = {
  AEX: '🇳🇱', DAX: '🇩🇪', CAC: '🇫🇷', FTSE: '🇬🇧', IBEX: '🇪🇸', FTSE_MIB: '🇮🇹', OMX: '🇸🇪',
  EURONEXT: '🇪🇺', XETRA: '🇩🇪', LSE: '🇬🇧',
}

const GUIDE_LABELS: Record<string, string> = {
  '/guides/dutch-box-3': 'Dutch Box 3',
  '/guides/german-vorabpauschale': 'German Vorabpauschale',
  '/guides/french-pea': 'French PEA',
  '/guides/dividend-withholding-tax': 'Dividend Withholding Tax',
  '/guides/broker-comparison': 'Broker Comparison',
}

const EXAMPLE_QUERIES = [
  'Best UCITS ETFs for a Dutch investor?',
  'Compare IWDA vs VWCE',
  'Which ETFs qualify for the French PEA?',
  'DAX stocks with high dividends',
  'How does German Vorabpauschale work?',
  'Cheapest ETFs tracking the MSCI World',
]

function InstrumentCard({ instrument }: { instrument: Instrument }) {
  const isEtf = instrument.type === 'etf'
  const href = isEtf ? `/etfs/${instrument.ticker}` : `/stocks/${instrument.ticker}`
  const flag = EXCHANGE_FLAG[instrument.exchange] ?? '🌍'
  const changePos = (instrument.changePct ?? 0) >= 0
  const sub = isEtf
    ? ('category' in instrument ? instrument.category : '')
    : ('sector' in instrument ? instrument.sector : '')

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderBottom: '1px solid var(--border)', background: '#fff', cursor: 'pointer', transition: 'background 0.1s' }}
        onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.background = 'var(--paper-2)')}
        onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.background = '#fff')}
      >
        <div style={{ fontSize: '18px', width: '26px', textAlign: 'center', flexShrink: 0 }}>{flag}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '14px' }}>{instrument.name}</span>
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 5px', borderRadius: '2px', background: isEtf ? '#dbeafe' : 'var(--paper-2)', color: isEtf ? '#1e40af' : 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
              {isEtf ? 'ETF' : 'Stock'}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px', display: 'flex', gap: '6px' }}>
            <span style={{ fontFamily: 'monospace' }}>{instrument.ticker}</span>
            <span>·</span>
            <span>{instrument.exchange?.replace('_', ' ')}</span>
            {sub && <><span>·</span><span>{sub}</span></>}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
            €{(instrument.price ?? 0).toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: changePos ? '#16a34a' : '#dc2626' }}>
            {changePos ? '+' : ''}{(instrument.changePct ?? 0).toFixed(2)}%
          </div>
        </div>
      </div>
    </Link>
  )
}

function AnswerPanel({ result, instruments }: { result: IntelligenceResult; instruments: Instrument[] }) {
  const tickerMap = useMemo(() => {
    const m = new Map<string, Instrument>()
    instruments.forEach(i => m.set(i.ticker, i))
    return m
  }, [instruments])

  const matched = result.tickers
    .map(t => tickerMap.get(t))
    .filter((i): i is Instrument => i !== undefined)

  // Split answer into paragraphs
  const paragraphs = result.answer.split(/\n\n+/).filter(p => p.trim().length > 0)

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div style={{ background: 'var(--ink)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '14px' }}>✦</span>
        <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af' }}>Boursee Intelligence</span>
      </div>

      {/* Answer */}
      <div style={{ padding: '24px 24px 20px' }}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: i < paragraphs.length - 1 ? '14px' : 0 }}>
            {p}
          </p>
        ))}
      </div>

      {/* Related instruments */}
      {matched.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div style={{ padding: '12px 20px 0', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
            Relevant instruments
          </div>
          {matched.map(inst => (
            <InstrumentCard key={inst.ticker} instrument={inst} />
          ))}
        </div>
      )}

      {/* Related guides */}
      {result.guides.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '14px 20px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginRight: '4px' }}>Guides</span>
          {result.guides.map(g => (
            <Link key={g} href={g} style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              {GUIDE_LABELS[g] ?? g} →
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function LoadingPanel() {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '28px' }}>
      <div style={{ background: 'var(--ink)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '14px' }}>✦</span>
        <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af' }}>Boursee Intelligence</span>
      </div>
      <div style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="intelligence-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.3, animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <span style={{ fontSize: '14px', color: 'var(--ink-3)' }}>Analysing European markets…</span>
      </div>
    </div>
  )
}

export default function SearchClient({ instruments, stockCount, etfCount }: Props) {
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IntelligenceResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Instant filter (always active while typing)
  const filterResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 1) return []
    return instruments.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.ticker.toLowerCase().includes(q) ||
      ('sector' in s && s.sector?.toLowerCase().includes(q)) ||
      ('category' in s && s.category?.toLowerCase().includes(q)) ||
      s.exchange?.toLowerCase().includes(q)
    ).slice(0, 12)
  }, [query, instruments])

  const isQuestion = query.trim().length >= 12

  const askIntelligence = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed || loading) return
    setActiveQuery(trimmed)
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })
      const data = await res.json() as IntelligenceResult & { error?: string }
      if (!res.ok || data.error) {
        setError(data.error ?? 'Intelligence engine temporarily unavailable')
      } else {
        setResult(data)
      }
    } catch {
      setError('Could not connect to intelligence engine')
    } finally {
      setLoading(false)
    }
  }, [loading])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isQuestion) {
      askIntelligence(query)
    }
  }

  const handleExampleClick = (q: string) => {
    setQuery(q)
    askIntelligence(q)
    inputRef.current?.focus()
  }

  const handleClear = () => {
    setQuery('')
    setResult(null)
    setError(null)
    setActiveQuery('')
    inputRef.current?.focus()
  }

  const showInstantResults = query.length >= 1 && !loading && !result
  const showEmpty = query.length === 0 && !result

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 32px 96px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '22px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
          Market Intelligence
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, marginBottom: '10px' }}>
          Ask Boursee
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
          Search by name or ticker — or ask anything about European markets, ETF tax rules, and sector trends.
        </p>
        <p style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '6px' }}>
          {stockCount} stocks · {etfCount} ETFs · AEX · DAX · CAC 40 · FTSE 100 · IBEX 35 · FTSE MIB · OMX
        </p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--ink-4)', pointerEvents: 'none', zIndex: 1 }}>
          ✦
        </div>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          placeholder='Search "ASML" or ask "best dividend ETFs for Dutch investors?"'
          value={query}
          onChange={e => { setQuery(e.target.value); setResult(null); setError(null) }}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '16px 120px 16px 46px',
            fontSize: '15px', fontFamily: 'var(--sans)',
            border: '1.5px solid var(--border)', borderRadius: '8px',
            background: '#fff', color: 'var(--ink)', outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(26,74,46,0.08)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
        />
        {/* Ask button */}
        {isQuestion && !loading && (
          <button
            onClick={() => askIntelligence(query)}
            style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '5px',
              padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--sans)', transition: 'background 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#163d25')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            Ask →
          </button>
        )}
        {/* Clear */}
        {query.length > 0 && !isQuestion && (
          <button
            onClick={handleClear}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--ink-4)', padding: '4px' }}
          >
            ✕
          </button>
        )}
        {query.length > 0 && isQuestion && (
          <button
            onClick={handleClear}
            style={{ position: 'absolute', right: '90px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--ink-4)', padding: '4px' }}
          >
            ✕
          </button>
        )}
      </div>

      {isQuestion && !result && !loading && (
        <p style={{ fontSize: '12px', color: 'var(--ink-4)', marginBottom: '20px' }}>
          Press <strong>Enter</strong> or click <strong>Ask →</strong> for an intelligence answer
        </p>
      )}

      {/* Loading */}
      {loading && <LoadingPanel />}

      {/* Intelligence result */}
      {result && !loading && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--ink-4)' }}>"{activeQuery}"</span>
            <button onClick={handleClear} style={{ fontSize: '12px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontWeight: 500 }}>
              New search ↺
            </button>
          </div>
          <AnswerPanel result={result} instruments={instruments} />
        </>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ background: '#fff8f0', border: '1px solid #f5d6a0', borderRadius: '6px', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: '#b85c00' }}>{error}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '4px' }}>You can still search by name or ticker below.</div>
        </div>
      )}

      {/* Instant filter results */}
      {showInstantResults && filterResults.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '10px' }}>
            {filterResults.length} result{filterResults.length !== 1 ? 's' : ''}
          </div>
          <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
            {filterResults.map(s => <InstrumentCard key={s.ticker} instrument={s} />)}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/screener" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Browse full screener →
            </Link>
          </div>
        </div>
      )}

      {showInstantResults && filterResults.length === 0 && (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--ink-4)' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>—</div>
          <div style={{ fontSize: '14px' }}>No instruments matched "<strong>{query}</strong>"</div>
          {isQuestion && (
            <div style={{ fontSize: '13px', marginTop: '10px', color: 'var(--ink-3)' }}>
              Looks like a question — press <strong>Enter</strong> to get an intelligence answer
            </div>
          )}
        </div>
      )}

      {/* Empty state — show example queries */}
      {showEmpty && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '14px' }}>
            Try asking
          </div>
          <div style={{ display: 'grid', gap: '8px', marginBottom: '36px' }}>
            {EXAMPLE_QUERIES.map(q => (
              <button
                key={q}
                onClick={() => handleExampleClick(q)}
                style={{
                  textAlign: 'left', padding: '13px 16px', background: '#fff',
                  border: '1px solid var(--border)', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '14px', color: 'var(--ink-2)',
                  fontFamily: 'var(--sans)', transition: 'all 0.12s', display: 'flex', alignItems: 'center', gap: '10px',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-2)' }}
              >
                <span style={{ color: 'var(--accent-mid)', fontSize: '12px', flexShrink: 0 }}>✦</span>
                {q}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>
              Quick search
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['ASML', 'VWCE', 'IWDA', 'SAP', 'LVMH', 'CSPX', 'Inditex', 'Technology', 'AEX'].map(q => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  style={{ fontSize: '13px', padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '100px', background: '#fff', color: 'var(--ink-3)', cursor: 'pointer', transition: 'all 0.12s', fontFamily: 'var(--sans)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--ink-3)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '12px 16px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderRadius: '3px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
        Intelligence answers are for general informational purposes only under Article 24 MiFID II. Not personalised investment or tax advice. Prices may be delayed up to 15 minutes.
      </div>
    </div>
  )
}
