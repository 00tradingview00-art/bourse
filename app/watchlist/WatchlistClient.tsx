'use client'

import Link from 'next/link'
import { useWatchlist } from '@/lib/useWatchlist'

const EXCHANGE_FLAG: Record<string, string> = {
  AEX: '🇳🇱', DAX: '🇩🇪', CAC: '🇫🇷', FTSE: '🇬🇧', IBEX: '🇪🇸',
  FTSE_MIB: '🇮🇹', OMX: '🇸🇪', EURONEXT: '🇪🇺', XETRA: '🇩🇪',
}

type Item = {
  ticker: string; name: string; type?: string; exchange: string
  sector?: string; category?: string
  price: number; changePct?: number | null
  week52High?: number | null; week52Low?: number | null
}

export default function WatchlistClient({ allItems }: { allItems: Record<string, unknown>[] }) {
  const { tickers, toggle } = useWatchlist()

  const watched = allItems
    .filter(i => tickers.has(String(i.ticker)))
    .map(i => i as unknown as Item)

  const stocks = watched.filter(i => i.type !== 'etf')
  const etfs   = watched.filter(i => i.type === 'etf')

  function fmtPct(n: number | null | undefined) {
    if (n == null) return '—'
    return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
  }
  function rangePos(item: Item) {
    if (!item.week52High || !item.week52Low || item.week52High <= item.week52Low) return null
    return Math.min(100, Math.max(0, ((item.price - item.week52Low) / (item.week52High - item.week52Low)) * 100))
  }

  return (
    <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>
      <div style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 32px 28px' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '20px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
            Personal
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '8px' }}>
            My Watchlist
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-4)', margin: 0 }}>
            {tickers.size === 0 ? 'No items yet — star stocks and ETFs to add them here.' : `${tickers.size} item${tickers.size !== 1 ? 's' : ''} · saved in your browser`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 32px 96px' }}>

        {tickers.size === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 32px', color: 'var(--ink-4)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>☆</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>Your watchlist is empty</div>
            <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Open any stock or ETF page and click <strong>Watch</strong> to track it here.
            </p>
            <Link href="/screener" style={{ display: 'inline-block', background: 'var(--ink)', color: '#fff', padding: '10px 24px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              Browse Screener →
            </Link>
          </div>
        ) : (
          <>
            {stocks.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>Stocks</h2>
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper-2)' }}>
                        {['Company', 'Exchange', 'Sector', 'Price', 'Today', '52W Position', ''].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Company' || h === '' ? 'left' : 'right', fontSize: '11px', fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map((s, idx) => {
                        const pos = rangePos(s)
                        return (
                          <tr key={s.ticker} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? '#fff' : 'var(--paper)' }}>
                            <td style={{ padding: '12px 14px' }}>
                              <Link href={`/stocks/${s.ticker}`} style={{ fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>{s.name}</Link>
                              <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>{s.ticker}</div>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--ink-4)', fontSize: '12px' }}>
                              {EXCHANGE_FLAG[s.exchange] ?? ''} {s.exchange}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--ink-4)', fontSize: '12px' }}>{s.sector ?? '—'}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>€{s.price.toFixed(2)}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: (s.changePct ?? 0) >= 0 ? '#16a34a' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
                              {fmtPct(s.changePct)}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', minWidth: '80px' }}>
                              {pos != null ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                                  <div style={{ width: '60px', height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: `${pos}%`, top: '-4px', width: '12px', height: '12px', background: pos > 75 ? '#16a34a' : pos < 25 ? '#dc2626' : 'var(--accent)', borderRadius: '50%', transform: 'translateX(-50%)', border: '2px solid #fff' }} />
                                  </div>
                                  <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{pos.toFixed(0)}%</span>
                                </div>
                              ) : '—'}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'left' }}>
                              <button onClick={() => toggle(s.ticker)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#ca8a04', padding: '0 4px' }} title="Remove">★</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {etfs.length > 0 && (
              <section>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px' }}>ETFs</h2>
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper-2)' }}>
                        {['Fund', 'Category', 'Price', 'Today', '52W Position', ''].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Fund' || h === '' ? 'left' : 'right', fontSize: '11px', fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {etfs.map((e, idx) => {
                        const pos = rangePos(e)
                        return (
                          <tr key={e.ticker} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? '#fff' : 'var(--paper)' }}>
                            <td style={{ padding: '12px 14px' }}>
                              <Link href={`/etfs/${e.ticker}`} style={{ fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}>{e.name}</Link>
                              <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>{e.ticker}</div>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', color: 'var(--ink-4)', fontSize: '12px' }}>{e.category ?? '—'}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>€{e.price.toFixed(2)}</td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600, color: (e.changePct ?? 0) >= 0 ? '#16a34a' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
                              {fmtPct(e.changePct)}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right', minWidth: '80px' }}>
                              {pos != null ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                                  <div style={{ width: '60px', height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: `${pos}%`, top: '-4px', width: '12px', height: '12px', background: pos > 75 ? '#16a34a' : pos < 25 ? '#dc2626' : 'var(--accent)', borderRadius: '50%', transform: 'translateX(-50%)', border: '2px solid #fff' }} />
                                  </div>
                                  <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{pos.toFixed(0)}%</span>
                                </div>
                              ) : '—'}
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'left' }}>
                              <button onClick={() => toggle(e.ticker)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#ca8a04', padding: '0 4px' }} title="Remove">★</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <div style={{ marginTop: '32px', fontSize: '12px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
              Watchlist is saved in your browser only — not synced across devices. Prices may be delayed up to 15 minutes.
            </div>
          </>
        )}
      </div>
    </main>
  )
}
