'use client'

import { DASHBOARD_MARKETS } from '@/lib/data'

export default function MarketDashboard() {
  return (
    <section id="markets" style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 0' }}>
      <div className="max-w-[1200px] mx-auto px-8">
        <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '20px' }}>
          European market snapshot · 2 June 2026, 09:47 CET
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          {DASHBOARD_MARKETS.map((m) => (
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
