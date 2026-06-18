import type { Metadata } from 'next'
import { readFile } from 'fs/promises'
import { join } from 'path'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import type { ScreenerStock } from '@/app/screener/page'

export const revalidate = 3600

// ── Index registry ──────────────────────────────────────────────────────────

const INDEX_MAP: Record<string, {
  exchange: string
  name: string
  flag: string
  country: string
  city: string
  venue: string
  description: string
  about: string
}> = {
  'aex': {
    exchange: 'AEX', name: 'AEX', flag: '🇳🇱',
    country: 'Netherlands', city: 'Amsterdam', venue: 'Euronext Amsterdam',
    description: 'The 25 largest and most actively traded companies on Euronext Amsterdam.',
    about: 'The AEX (Amsterdam Exchange Index) is the benchmark for Dutch equities, comprising the 25 most capitalised and liquid companies listed on Euronext Amsterdam. It is reviewed quarterly. Heavyweight constituents include ASML, Shell, and Unilever.',
  },
  'dax': {
    exchange: 'DAX', name: 'DAX', flag: '🇩🇪',
    country: 'Germany', city: 'Frankfurt', venue: 'Deutsche Börse (Xetra)',
    description: 'The 40 largest companies on the Frankfurt Stock Exchange.',
    about: 'The DAX (Deutscher Aktienindex) is the flagship German equity index, covering the 40 largest and most liquid companies listed on Xetra. Expanded from 30 to 40 constituents in September 2021. Dominated by Industrials, Financials, and Technology.',
  },
  'cac-40': {
    exchange: 'CAC', name: 'CAC 40', flag: '🇫🇷',
    country: 'France', city: 'Paris', venue: 'Euronext Paris',
    description: 'The 40 largest companies on Euronext Paris by free-float market capitalisation.',
    about: 'The CAC 40 (Cotation Assistée en Continu) is the benchmark index for French equities. It measures the performance of the 40 largest companies listed on Euronext Paris, selected by free-float market cap. LVMH, TotalEnergies, and Hermès are among the heaviest weights.',
  },
  'ftse-100': {
    exchange: 'FTSE', name: 'FTSE 100', flag: '🇬🇧',
    country: 'United Kingdom', city: 'London', venue: 'London Stock Exchange',
    description: 'The 100 largest companies listed on the London Stock Exchange.',
    about: 'The FTSE 100 ("Footsie") is the premier UK equity index, comprising the 100 largest companies by market capitalisation listed on the London Stock Exchange. It is heavily weighted toward Financials, Energy, and Consumer Staples. Constituents are reviewed quarterly.',
  },
  'ibex-35': {
    exchange: 'IBEX', name: 'IBEX 35', flag: '🇪🇸',
    country: 'Spain', city: 'Madrid', venue: 'Bolsa de Madrid',
    description: 'The 35 most liquid companies on the Bolsa de Madrid.',
    about: 'The IBEX 35 is the benchmark index for Spanish equities, comprising the 35 most liquid companies listed on the Bolsa de Madrid (BME). The index is dominated by Financials (Santander, BBVA) and Utilities. It is reviewed biannually.',
  },
  'ftse-mib': {
    exchange: 'FTSE_MIB', name: 'FTSE MIB', flag: '🇮🇹',
    country: 'Italy', city: 'Milan', venue: 'Borsa Italiana',
    description: 'The 40 most liquid companies on Borsa Italiana.',
    about: 'The FTSE MIB is the principal Italian equity index, representing approximately 80% of total domestic market capitalisation. It covers the 40 most liquid and capitalised companies on Borsa Italiana. Financials and Utilities dominate the index weighting.',
  },
  'omx': {
    exchange: 'OMX', name: 'OMX 30', flag: '🇸🇪',
    country: 'Sweden / Nordic', city: 'Stockholm', venue: 'Nasdaq Nordic',
    description: 'The 30 most actively traded share classes on Nasdaq Stockholm.',
    about: 'The OMX Stockholm 30 (OMXS30) is the benchmark index for Nordic equities, comprising the 30 most traded share classes on Nasdaq Stockholm. The index is reviewed twice a year. Industrials, Financials, and Technology dominate, with major constituents including Atlas Copco, Ericsson, and Volvo.',
  },
}

export function generateStaticParams() {
  return Object.keys(INDEX_MAP).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const info = INDEX_MAP[slug]
  if (!info) return { title: 'Index | Boursee' }
  return {
    title: `${info.flag} ${info.name} — Composition & Movers Today | Boursee`,
    description: `${info.description} See today's gainers, losers, and sector breakdown for the ${info.name}.`,
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function Week52Bar({ price, high, low }: { price: number; high: number | null; low: number | null }) {
  if (!high || !low || high <= low) return <span style={{ color: 'var(--ink-4)', fontSize: '12px' }}>—</span>
  const pct  = Math.round(((price - low) / (high - low)) * 100)
  const safe = Math.min(97, Math.max(3, pct))
  const bar  = pct < 25 ? '#16a34a' : pct > 75 ? '#dc2626' : '#6b7280'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ position: 'relative', width: '56px', height: '4px', background: '#e5e7eb', borderRadius: '2px', flexShrink: 0 }}>
        <div style={{ position: 'absolute', left: `${safe}%`, top: '-4px', transform: 'translateX(-50%)', width: '2px', height: '12px', background: bar, borderRadius: '1px' }} />
      </div>
      <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function IndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const info = INDEX_MAP[slug]
  if (!info) return <div style={{ padding: '80px 32px', textAlign: 'center', color: 'var(--ink-4)' }}>Index not found.</div>

  // Load screener
  let stocks: ScreenerStock[] = []
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'screener.json'), 'utf8')
    const d = JSON.parse(raw)
    const all: ScreenerStock[] = d.stocks ?? d.instruments ?? []
    stocks = all.filter(s => s.exchange === info.exchange)
  } catch { /* proceed empty */ }

  if (stocks.length === 0) {
    return (
      <>
        <Navbar />
        <main style={{ background: 'var(--paper)', minHeight: '80vh', padding: '80px 32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-4)' }}>No constituent data available yet.</p>
        </main>
        <Footer />
      </>
    )
  }

  // Stats
  const sorted     = [...stocks].sort((a, b) => b.changePct - a.changePct)
  const gainers    = sorted.filter(s => s.changePct > 0)
  const losers     = sorted.filter(s => s.changePct < 0).reverse()
  const topGainers = gainers.slice(0, 5)
  const topLosers  = losers.slice(0, 5)
  const avgChange  = stocks.reduce((s, x) => s + x.changePct, 0) / stocks.length
  const risingCount = gainers.length
  const fallingCount = losers.length

  // Sector breakdown
  const sectorMap = new Map<string, { count: number; totalChange: number }>()
  stocks.forEach(s => {
    const sec = s.sector ?? 'Other'
    const cur = sectorMap.get(sec) ?? { count: 0, totalChange: 0 }
    sectorMap.set(sec, { count: cur.count + 1, totalChange: cur.totalChange + s.changePct })
  })
  const sectors = Array.from(sectorMap.entries())
    .map(([name, { count, totalChange }]) => ({ name, count, avg: totalChange / count }))
    .sort((a, b) => b.avg - a.avg)

  const maxAbsAvg = Math.max(...sectors.map(s => Math.abs(s.avg)), 0.01)

  const thStyle: React.CSSProperties = {
    padding: '9px 12px', fontSize: '11px', fontWeight: 500,
    letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-4)',
    textAlign: 'left', whiteSpace: 'nowrap',
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 32px 28px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Link href="/" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>← Markets</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '32px' }}>{info.flag}</span>
                  <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1 }}>
                    {info.name}
                  </h1>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--ink-3)', marginBottom: '6px' }}>{info.description}</p>
                <p style={{ fontSize: '12px', color: 'var(--ink-4)' }}>{info.venue} · {info.country}</p>
              </div>
              {/* Today summary chip */}
              <div style={{ background: avgChange >= 0 ? '#f0fdf4' : '#fff1f2', border: `1px solid ${avgChange >= 0 ? '#bbf7d0' : '#fecaca'}`, borderRadius: '8px', padding: '14px 20px', textAlign: 'center', minWidth: '140px' }}>
                <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '4px' }}>Avg today</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: avgChange >= 0 ? '#16a34a' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
                  {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '4px' }}>
                  {risingCount}↑ · {fallingCount}↓ of {stocks.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 32px 80px' }}>

          {/* Movers row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '36px' }}>

            {/* Gainers */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', borderTop: '3px solid #16a34a' }}>
              <div style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px' }}>▲</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a', letterSpacing: '0.03em' }}>Rising Today</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--ink-4)' }}>{gainers.length} stock{gainers.length !== 1 ? 's' : ''}</span>
              </div>
              {topGainers.length === 0
                ? <div style={{ padding: '20px 16px', fontSize: '13px', color: 'var(--ink-4)' }}>No gainers today</div>
                : topGainers.map(s => (
                <div key={s.ticker} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <Link href={`/stocks/${s.ticker}`} style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', textDecoration: 'none' }}>{s.name}</Link>
                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>{s.sector}</div>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a', fontVariantNumeric: 'tabular-nums' }}>
                    +{s.changePct.toFixed(2)}%
                  </span>
                </div>
              ))}
              {gainers.length > 5 && (
                <div style={{ padding: '10px 16px', fontSize: '12px', color: 'var(--ink-4)', textAlign: 'center' }}>
                  +{gainers.length - 5} more gaining
                </div>
              )}
            </div>

            {/* Losers */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', borderTop: '3px solid #dc2626' }}>
              <div style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', background: '#fff1f2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px' }}>▼</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626', letterSpacing: '0.03em' }}>Under Pressure</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--ink-4)' }}>{losers.length} stock{losers.length !== 1 ? 's' : ''}</span>
              </div>
              {topLosers.length === 0
                ? <div style={{ padding: '20px 16px', fontSize: '13px', color: 'var(--ink-4)' }}>No losers today</div>
                : topLosers.map(s => (
                <div key={s.ticker} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <Link href={`/stocks/${s.ticker}`} style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', textDecoration: 'none' }}>{s.name}</Link>
                    <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>{s.sector}</div>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
                    {s.changePct.toFixed(2)}%
                  </span>
                </div>
              ))}
              {losers.length > 5 && (
                <div style={{ padding: '10px 16px', fontSize: '12px', color: 'var(--ink-4)', textAlign: 'center' }}>
                  +{losers.length - 5} more falling
                </div>
              )}
            </div>
          </div>

          {/* Sector breakdown */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px 24px', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '-0.01em' }}>
              Sector breakdown today
            </h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {sectors.map(sec => {
                const barWidth = Math.min((Math.abs(sec.avg) / maxAbsAvg) * 100, 100)
                const isPos = sec.avg >= 0
                return (
                  <div key={sec.name} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 80px 56px', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--ink-2)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sec.name}
                    </span>
                    <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${barWidth}%`,
                        background: isPos ? '#16a34a' : '#dc2626',
                        borderRadius: '3px', transition: 'width 0.3s',
                      }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isPos ? '#16a34a' : '#dc2626', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                      {isPos ? '+' : ''}{sec.avg.toFixed(2)}%
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--ink-4)', textAlign: 'right' }}>
                      {sec.count} stock{sec.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* About the index */}
          <div style={{ background: 'var(--paper-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '18px 24px', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>About the {info.name}</h2>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-3)' }}>{info.about}</p>
          </div>

          {/* Full composition table */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            All {stocks.length} constituents
          </h2>
          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ background: 'var(--paper)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={thStyle}>Company</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Price</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Day %</th>
                  <th style={thStyle}>Sector</th>
                  <th style={{ ...thStyle, minWidth: '110px' }}>52w Range</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>vs Index</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => {
                  const isUp = s.changePct >= 0
                  return (
                    <tr key={s.ticker} style={{ borderBottom: i < stocks.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? 'var(--paper)' : '#fff' }}>
                      <td style={{ padding: '10px 12px', minWidth: '160px' }}>
                        <Link href={`/stocks/${s.ticker}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '14px' }}>{s.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--ink-4)', fontFamily: 'monospace', marginTop: '1px' }}>{s.ticker}</div>
                        </Link>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        {s.price.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, fontSize: '14px', color: isUp ? '#16a34a' : '#dc2626', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        {isUp ? '+' : ''}{s.changePct.toFixed(2)}%
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-3)', fontSize: '13px', whiteSpace: 'nowrap' }}>{s.sector}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <Week52Bar price={s.price} high={s.week52High} low={s.week52Low} />
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: '13px', fontWeight: 600, color: (s.relativeStrength ?? 0) > 0 ? '#16a34a' : (s.relativeStrength ?? 0) < 0 ? '#dc2626' : 'var(--ink-4)', whiteSpace: 'nowrap' }}>
                        {s.relativeStrength != null
                          ? `${s.relativeStrength > 0 ? '+' : ''}${s.relativeStrength.toFixed(1)}%`
                          : <span style={{ color: 'var(--ink-4)' }}>—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
            Prices may be delayed up to 15 minutes. Constituent list reflects Boursee's tracked universe and may not include all index members.
            Not investment advice. <Link href="/screener" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Open full screener →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
