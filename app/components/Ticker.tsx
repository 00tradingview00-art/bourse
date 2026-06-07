'use client'

import type { MarketData } from '@/types'

interface Props {
  tickerItems: MarketData[]
}

export default function Ticker({ tickerItems }: Props) {
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <div style={{ background: 'var(--ink)', color: '#fff', height: '36px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div style={{ background: 'var(--accent)', flexShrink: 0, height: '100%', padding: '0 16px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>Live</span>
      </div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div className="ticker-animate" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', paddingLeft: '24px', willChange: 'transform' }}>
          {doubled.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginRight: '40px', fontSize: '12px' }}>
              <span style={{ color: '#999', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {item.name}
              </span>
              <span style={{ color: '#fff', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                {item.value}
              </span>
              <span style={{ color: item.direction === 'up' ? '#4ade80' : item.direction === 'down' ? '#f87171' : '#888', fontWeight: 500 }}>
                {item.changePct}
              </span>
              {i < doubled.length - 1 && (
                <span style={{ color: '#333', margin: '0 4px' }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
