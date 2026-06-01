'use client'

import { TICKER_ITEMS } from '@/lib/data'

export default function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div
      style={{ background: 'var(--ink)', color: '#fff', height: '36px' }}
      className="flex items-center overflow-hidden"
    >
      <div
        style={{ background: 'var(--accent)', flexShrink: 0 }}
        className="h-full px-4 flex items-center text-[10px] font-medium tracking-widest uppercase text-white z-10"
      >
        Live
      </div>
      <div className="overflow-hidden flex-1">
        <div className="ticker-animate flex items-center whitespace-nowrap pl-6">
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 mr-10 text-xs">
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
