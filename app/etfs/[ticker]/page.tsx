import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { readFile } from 'fs/promises'
import { join } from 'path'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import PriceChart, { type OHLCVBar } from '@/app/components/PriceChart'
import WatchlistButton from '@/app/components/WatchlistButton'
import screenerData from '@/data/screener.json'

type Params = { ticker: string }

const SFDR_COLOR: Record<string, string> = { 'Art.9': '#15803d', 'Art.8': '#1d4ed8', 'Art.6': 'var(--ink-4)' }
const SFDR_BG:    Record<string, string> = { 'Art.9': '#dcfce7', 'Art.8': '#dbeafe', 'Art.6': 'var(--paper-2)' }
const SFDR_DESC:  Record<string, string> = {
  'Art.9': 'Sustainable objective — highest ESG standard',
  'Art.8': 'ESG characteristics promoted',
  'Art.6': 'No specific sustainability claim',
}
const DOMICILE_NOTE: Record<string, string> = {
  IE: 'Ireland — 0% Irish withholding on dividends paid to fund; favourable for accumulating ETFs',
  LU: 'Luxembourg — 15% withholding tax on dividends within the fund',
  DE: 'Germany — subject to German fund tax rules',
  FR: 'France — favourable for PEA-eligible ETFs',
}

type Etf = {
  type?: string; ticker: string; name: string; exchange: string
  indexTracked?: string; category?: string; ter?: number; aumB?: number
  domicile?: string; accumulating?: boolean; sfdr?: string; replication?: string
  brokerBadges?: string[]; qualityScore?: number
  price: number; changePct?: number | null
  week52High?: number | null; week52Low?: number | null
  rsi?: number | null; rsiSignal?: string
}

function getAllEtfs(): Etf[] {
  const d = screenerData as Record<string, unknown>
  const all = (d.etfs ?? d.instruments ?? []) as Etf[]
  return all.filter(s => s.type === 'etf')
}

export async function generateStaticParams(): Promise<Params[]> {
  return getAllEtfs().map(s => ({ ticker: s.ticker }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ticker } = await params
  const etf = getAllEtfs().find(e => e.ticker === ticker)
  if (!etf) return { title: 'ETF Not Found | Boursee' }
  return {
    title: `${etf.name} (${ticker}) — UCITS ETF | Boursee`,
    description: `TER ${etf.ter != null ? (etf.ter * 100).toFixed(2) + '%' : '—'}, ${etf.domicile ?? ''} domicile, ${etf.accumulating ? 'accumulating' : 'distributing'} UCITS ETF tracking ${etf.indexTracked ?? 'European index'}. Quality score, 52-week range, and broker availability on Boursee.`,
  }
}

function fmtPct(n: number | null | undefined): string {
  if (n == null) return '—'
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}

function QualityDial({ score }: { score: number }) {
  const color = score >= 8 ? '#16a34a' : score >= 5 ? '#ca8a04' : '#dc2626'
  const label = score >= 8 ? 'High quality' : score >= 5 ? 'Mid-tier' : 'Lower quality'
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{ fontSize: '44px', fontWeight: 800, color, lineHeight: 1, fontFamily: 'var(--sans)' }}>{score}</div>
      <div style={{ fontSize: '10px', color: 'var(--ink-4)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>/ 10</div>
      <div style={{ fontSize: '11px', color, marginTop: '6px', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

function RangeBar({ low, high, current }: { low: number; high: number; current: number }) {
  const pct = Math.min(100, Math.max(0, ((current - low) / (high - low)) * 100))
  const nearHigh = pct > 75
  const nearLow  = pct < 25
  const dotColor = nearHigh ? '#16a34a' : nearLow ? '#dc2626' : 'var(--accent)'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: 'var(--ink-4)' }}>
        <span>52W Low<br /><strong style={{ fontSize: '13px', color: 'var(--ink-2)' }}>€{low.toFixed(2)}</strong></span>
        <span style={{ textAlign: 'center', fontSize: '11px', color: 'var(--ink-4)' }}>
          {nearHigh ? '▲ Near 52-week high' : nearLow ? '▼ Near 52-week low' : 'Mid-range'}
        </span>
        <span style={{ textAlign: 'right' }}>52W High<br /><strong style={{ fontSize: '13px', color: 'var(--ink-2)' }}>€{high.toFixed(2)}</strong></span>
      </div>
      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', position: 'relative', margin: '0 4px' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: dotColor, borderRadius: '3px', opacity: 0.25 }} />
        <div style={{ position: 'absolute', left: `${pct}%`, top: '-4px', width: '14px', height: '14px', background: dotColor, borderRadius: '50%', transform: 'translateX(-50%)', border: '2px solid #fff', boxShadow: `0 0 0 1px ${dotColor}` }} />
      </div>
      <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--ink-4)', textAlign: 'center' }}>
        Current price is in the <strong>{pct.toFixed(0)}th percentile</strong> of its 52-week range
      </div>
    </div>
  )
}

export default async function EtfDetailPage({ params }: { params: Promise<Params> }) {
  const { ticker } = await params
  const e = getAllEtfs().find(et => et.ticker === ticker)
  if (!e) notFound()

  const { name, exchange, indexTracked, category, ter, aumB, domicile,
          accumulating, sfdr, replication, brokerBadges = [], qualityScore,
          price, changePct, week52High, week52Low, rsi, rsiSignal } = e

  const changePositive = (changePct ?? 0) >= 0

  // Similar ETFs — same category
  const similar = getAllEtfs()
    .filter(f => f.category === category && f.ticker !== ticker)
    .slice(0, 4)

  // Load OHLCV for chart
  let ohlcv: OHLCVBar[] = []
  try {
    const safe = ticker.replace(/[^a-zA-Z0-9._-]/g, '_')
    const raw  = await readFile(join(process.cwd(), 'data', 'stocks', `${safe}.json`), 'utf8')
    ohlcv = JSON.parse(raw)
  } catch { /* no chart data yet */ }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 32px 32px' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: 'var(--ink-4)' }}>
              <Link href="/screener" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Screener</Link>
              <span>›</span>
              <span>ETFs</span>
              {category && <><span>›</span><span>{category}</span></>}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {ticker} · UCITS ETF · {exchange}
                </div>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, marginBottom: '8px' }}>
                  {name}
                </h1>
                {indexTracked && (
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '8px' }}>Tracking: <strong>{indexTracked}</strong></div>
                )}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {category && <span style={{ fontSize: '12px', background: 'var(--paper-2)', color: 'var(--ink-4)', padding: '3px 8px', borderRadius: '2px', fontWeight: 500 }}>{category}</span>}
                  {sfdr && <span style={{ fontSize: '12px', background: SFDR_BG[sfdr] ?? 'var(--paper-2)', color: SFDR_COLOR[sfdr] ?? 'var(--ink-4)', padding: '3px 8px', borderRadius: '2px', fontWeight: 600 }}>{sfdr}</span>}
                  {accumulating != null && <span style={{ fontSize: '12px', background: 'var(--paper-2)', color: 'var(--ink-4)', padding: '3px 8px', borderRadius: '2px' }}>{accumulating ? 'Acc' : 'Dist'}</span>}
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  €{price.toFixed(2)}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: changePositive ? '#16a34a' : '#dc2626', marginTop: '4px' }}>
                  {changePositive ? '▲' : '▼'} {fmtPct(changePct)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '6px', marginBottom: '10px' }}>Prices may be delayed up to 15 min</div>
                <WatchlistButton ticker={ticker} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 32px 96px' }}>

          {/* Price chart */}
          <PriceChart data={ohlcv} currentPrice={price} />

          {/* Key facts grid */}
          <div style={{ display: 'grid', gridTemplateColumns: qualityScore != null ? '140px 1fr' : '1fr', gap: '12px', marginBottom: '16px' }}>

            {qualityScore != null && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <QualityDial score={qualityScore} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
              {[
                { label: 'TER (annual cost)', value: ter != null ? `${(ter * 100).toFixed(2)}%` : '—' },
                { label: 'AUM', value: aumB != null ? (aumB >= 1 ? `€${aumB.toFixed(1)}B` : `€${(aumB * 1000).toFixed(0)}M`) : '—' },
                { label: 'Domicile', value: domicile ?? '—' },
                { label: 'Type', value: accumulating != null ? (accumulating ? 'Accumulating' : 'Distributing') : '—' },
                { label: 'Replication', value: replication ? replication.charAt(0).toUpperCase() + replication.slice(1) : '—' },
              ].map(item => (
                <div key={item.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Domicile note */}
          {domicile && DOMICILE_NOTE[domicile] && (
            <div style={{ background: '#f0f7ff', border: '1px solid #bcd6f5', borderRadius: '4px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#1a4a7a', lineHeight: 1.6 }}>
              <strong>🏛 Domicile note:</strong> {DOMICILE_NOTE[domicile]}
            </div>
          )}

          {/* SFDR context */}
          {sfdr && (
            <div style={{ background: SFDR_BG[sfdr] ?? 'var(--paper-2)', border: `1px solid ${SFDR_COLOR[sfdr] ?? 'var(--border)'}33`, borderRadius: '4px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>
              <strong style={{ color: SFDR_COLOR[sfdr] }}>{sfdr}</strong> — {SFDR_DESC[sfdr] ?? ''}
            </div>
          )}

          {/* Broker availability */}
          {brokerBadges.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 500 }}>Available at:</span>
              {brokerBadges.includes('DEGIRO') && (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '3px', background: '#dcfce7', color: '#166534' }}>DEGIRO Commission-Free</span>
              )}
              {brokerBadges.includes('TR') && (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '3px', background: '#dbeafe', color: '#1e40af' }}>Trade Republic Savings Plan</span>
              )}
            </div>
          )}

          {/* 52-week range */}
          {week52High && week52Low && week52High > week52Low && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '16px' }}>52-Week Range</div>
              <RangeBar low={week52Low} high={week52High} current={price} />
            </div>
          )}

          {/* RSI gauge */}
          {rsi != null && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Momentum (RSI 14)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: rsiSignal === 'overbought' ? '#dc2626' : rsiSignal === 'oversold' ? '#16a34a' : 'var(--ink-3)' }}>
                  {rsi.toFixed(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'relative', marginBottom: '8px' }}>
                    <div style={{ position: 'absolute', left: `${Math.min(100, Math.max(0, rsi))}%`, top: '-5px', width: '14px', height: '14px', background: rsiSignal === 'overbought' ? '#dc2626' : rsiSignal === 'oversold' ? '#16a34a' : 'var(--accent)', borderRadius: '50%', transform: 'translateX(-50%)', border: '2px solid #fff' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-4)' }}>
                    {rsiSignal === 'overbought' ? 'Momentum stretched — fund has run hard recently' : rsiSignal === 'oversold' ? 'Oversold — potential entry point for DCA investors' : 'Neutral — no strong momentum signal'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Similar ETFs */}
          {similar.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '16px' }}>{category} — Similar Funds</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Fund', 'TER', 'AUM', 'Type', 'Today'].map(h => (
                      <th key={h} style={{ padding: '6px 10px', textAlign: h === 'Fund' ? 'left' : 'right', fontSize: '11px', fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'var(--paper-2)', borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 10px', fontWeight: 700 }}>{name}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right' }}>{ter != null ? `${(ter * 100).toFixed(2)}%` : '—'}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right' }}>{aumB != null ? `€${aumB.toFixed(1)}B` : '—'}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontSize: '12px', color: 'var(--ink-4)' }}>{accumulating ? 'Acc' : 'Dist'}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 600, color: changePositive ? '#16a34a' : '#dc2626' }}>{fmtPct(changePct)}</td>
                  </tr>
                  {similar.map(f => (
                    <tr key={f.ticker} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 10px' }}>
                        <Link href={`/etfs/${f.ticker}`} style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 500 }}>{f.name}</Link>
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'right' }}>{f.ter != null ? `${(f.ter * 100).toFixed(2)}%` : '—'}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right' }}>{f.aumB != null ? `€${f.aumB.toFixed(1)}B` : '—'}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontSize: '12px', color: 'var(--ink-4)' }}>{f.accumulating ? 'Acc' : 'Dist'}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: (f.changePct ?? 0) >= 0 ? '#16a34a' : '#dc2626' }}>{fmtPct(f.changePct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Guide CTA */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Learn about ETF tax treatment in Europe</div>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)', margin: 0 }}>Dutch Box 3 · German Vorabpauschale · French PEA · Dividend withholding</p>
            </div>
            <Link href="/guides" style={{ background: 'var(--ink)', color: '#fff', padding: '9px 18px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Read Guides →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', marginBottom: '40px' }}>
            <Link href="/screener" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>← Back to Screener</Link>
            <Link href="/bonds" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Bond Yields →</Link>
            <Link href="/calculators" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Tax Calculators →</Link>
          </div>

          <div style={{ padding: '14px 18px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
            For general information only under MiFID II Article 24. Not investment advice. Quality score is an editorial metric — not a regulated rating. Prices may be delayed up to 15 minutes.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
