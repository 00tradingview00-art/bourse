'use client'

import type { MarketData } from '@/types'

interface Props {
  markets: MarketData[]
  timestamp: string
}

export default function MarketDashboard({ markets, timestamp }: Props) {
  return (
    <section id="markets" style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '20px' }}>
          European market snapshot · {timestamp}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          {markets.map((m) => (
            <div
              key={m.name}
              style={{ background: 'var(--paper)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '4px', transition: 'background 0.15s', cursor: 'default' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--paper)')}
            >
              <div style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                {m.flag} {m.name} · {m.country}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {m.value}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 500, color: m.direction === 'up' ? '#16a34a' : 'var(--red)' }}>
                {m.change} &nbsp; {m.changePct}
              </div>
              <div style={{ height: '2px', borderRadius: '1px', marginTop: '6px', background: m.direction === 'up' ? '#16a34a' : 'var(--red)', width: `${Math.min(Math.abs(parseFloat(m.changePct)) * 100, 100)}%` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
