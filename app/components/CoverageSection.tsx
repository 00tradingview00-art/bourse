'use client'

import { EXCHANGES } from '@/lib/data'
import type { MarketData } from '@/types'

interface Props {
  markets: MarketData[]
  brent?: MarketData
}

export default function CoverageSection({ markets, brent }: Props) {
  return (
    <section id="coverage" className="mob-p-sm" style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 32px' }}>
      <div className="mob-stack mob-gap-sm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        {/* Left */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '16px' }}>
            European exchanges we track
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3vw, 34px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '20px' }}>
            Every major<br />European exchange.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.7, marginBottom: '32px' }}>
            From Amsterdam to Milan, Paris to Oslo — Boursee covers the full breadth of European capital markets in one daily brief and a unified screener.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {EXCHANGES.map((ex) => (
              <div
                key={ex.name}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderRadius: '4px' }}
              >
                <span style={{ fontSize: '20px' }}>{ex.flag}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink)' }}>{ex.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--ink-4)', letterSpacing: '0.04em' }}>{ex.index}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — dark performance card */}
        <div style={{ background: 'var(--ink)', borderRadius: '8px', padding: '32px', overflow: 'hidden' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '20px' }}>
            Today&apos;s exchange performance
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {markets.map((m) => {
              const pct = Math.abs(parseFloat(m.changePct))
              const isUp = m.direction === 'up'
              return (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#888', width: '70px', flexShrink: 0 }}>{m.flag} {m.name}</div>
                  <div style={{ flex: 1, height: '20px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(pct * 100, 100)}%`,
                      background: isUp ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#a32d2d,#e24b4a)',
                      borderRadius: '2px',
                      display: 'flex', alignItems: 'center', paddingLeft: '8px',
                      fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.8)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {m.changePct}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 500, width: '50px', textAlign: 'right', color: isUp ? '#4ade80' : '#f87171' }}>
                    {m.changePct}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #222' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: '#444' }}>Brent Crude</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: brent?.direction === 'down' ? '#f87171' : '#4ade80' }}>
                {brent?.value ?? '—'}{' '}
                <span style={{ fontSize: '12px' }}>{brent?.changePct ?? ''}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#444' }}>ECB Rate (Jun 11)</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#b8922a' }}>+25bp <span style={{ fontSize: '11px', color: '#666' }}>90% priced in</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
