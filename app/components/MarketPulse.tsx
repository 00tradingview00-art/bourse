'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { MarketData } from '@/types'

interface Props {
  markets: MarketData[]       // dashboard markets (AEX, DAX, CAC, FTSE, IBEX, FTSE MIB)
  timestamp: string
  ecbRate?: MarketData
  eurUsd?: MarketData
  brent?: MarketData
}

// Trading hours in local exchange timezone (open:close in minutes from midnight)
const EXCHANGE_TZ: Record<string, { tz: string; open: number; close: number }> = {
  'AEX':      { tz: 'Europe/Amsterdam', open: 9 * 60,      close: 17 * 60 + 30 },
  'DAX':      { tz: 'Europe/Berlin',    open: 9 * 60,      close: 17 * 60 + 30 },
  'CAC 40':   { tz: 'Europe/Paris',     open: 9 * 60,      close: 17 * 60 + 30 },
  'FTSE 100': { tz: 'Europe/London',    open: 8 * 60,      close: 16 * 60 + 30 },
  'IBEX 35':  { tz: 'Europe/Madrid',    open: 9 * 60,      close: 17 * 60 + 35 },
  'FTSE MIB': { tz: 'Europe/Rome',      open: 9 * 60,      close: 17 * 60 + 35 },
}

function exchangeStatus(name: string): 'open' | 'closed' {
  const cfg = EXCHANGE_TZ[name]
  if (!cfg) return 'closed'
  const local = new Date(new Date().toLocaleString('en-US', { timeZone: cfg.tz }))
  const day   = local.getDay()
  if (day === 0 || day === 6) return 'closed'
  const mins = local.getHours() * 60 + local.getMinutes()
  return mins >= cfg.open && mins < cfg.close ? 'open' : 'closed'
}

function StatusBadge({ status }: { status: 'open' | 'closed' }) {
  return (
    <span style={{
      fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em',
      textTransform: 'uppercase', padding: '2px 6px', borderRadius: '2px',
      background: status === 'open' ? '#dcfce7' : 'var(--paper-2)',
      color:      status === 'open' ? '#16a34a' : 'var(--ink-4)',
    }}>
      {status === 'open' ? '● Open' : 'Closed'}
    </span>
  )
}

export default function MarketPulse({ markets, timestamp, ecbRate, eurUsd, brent }: Props) {
  const [statuses, setStatuses] = useState<Record<string, 'open' | 'closed'>>({})

  useEffect(() => {
    const s: Record<string, 'open' | 'closed'> = {}
    markets.forEach(m => { s[m.name] = exchangeStatus(m.name) })
    setStatuses(s)
  }, [markets])

  return (
    <section style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 0' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
            European Market Snapshot · {timestamp}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-4)' }}>
            Prices may be delayed up to 15 min ·{' '}
            <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>disclaimer →</Link>
          </div>
        </div>

        {/* Index grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
          {markets.map(m => {
            const status  = statuses[m.name] ?? 'closed'
            const isUp    = m.direction === 'up'
            const isDown  = m.direction === 'down'
            const pct     = Math.abs(parseFloat(m.changePct) || 0)

            return (
              <div
                key={m.name}
                style={{ background: 'var(--paper)', padding: '16px 14px 14px', cursor: 'default', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--paper)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                    {m.flag} {m.name}
                  </div>
                  <StatusBadge status={status} />
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', lineHeight: 1, marginBottom: '6px' }}>
                  {m.value}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: isUp ? '#16a34a' : isDown ? 'var(--red)' : 'var(--ink-4)', marginBottom: '10px' }}>
                  {m.change} &nbsp; {m.changePct}
                </div>
                {/* Direction bar */}
                <div style={{ height: '2px', borderRadius: '1px', background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(pct * 80, 100)}%`,
                    background: isUp ? '#16a34a' : isDown ? 'var(--red)' : 'var(--border)',
                    borderRadius: '1px',
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Macro signal strip below grid */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderRadius: '0 0 4px 4px', background: 'var(--paper-2)', overflow: 'hidden' }}>
          {[
            { label: 'Brent', data: brent },
            { label: 'EUR/USD', data: eurUsd },
          ].map(({ label, data }) => data ? (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRight: '1px solid var(--border)' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-4)', letterSpacing: '0.04em' }}>{label}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{data.value}</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: data.direction === 'up' ? '#16a34a' : data.direction === 'down' ? 'var(--red)' : 'var(--ink-4)' }}>{data.changePct}</span>
            </div>
          ) : null)}

          {ecbRate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRight: '1px solid var(--border)' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink-4)', letterSpacing: '0.04em' }}>ECB Rate</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{ecbRate.value}</span>
              <span style={{ fontSize: '11px', background: 'var(--gold-light)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '2px', fontWeight: 500 }}>
                {ecbRate.changePct}
              </span>
            </div>
          )}

          <Link
            href="/ecb-watch"
            style={{ marginLeft: 'auto', padding: '10px 20px', fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            ECB Watch →
          </Link>
        </div>

      </div>
    </section>
  )
}
