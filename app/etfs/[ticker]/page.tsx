import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import screenerData from '@/data/screener.json'

type Params = { ticker: string }

function getAllEtfs() {
  const d = screenerData as Record<string, unknown>
  const all = (d.etfs ?? d.instruments ?? []) as Record<string, unknown>[]
  return all.filter(s => s.type === 'etf')
}

export async function generateStaticParams(): Promise<Params[]> {
  return getAllEtfs().map(s => ({ ticker: String(s.ticker) }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ticker } = await params
  const etf = getAllEtfs().find(e => e.ticker === ticker)
  if (!etf) return { title: 'ETF Not Found | Boursee' }
  const name = String(etf.name)
  return {
    title: `${name} (${ticker}) — ETF Analysis | Boursee`,
    description: `Quality score, TER, domicile, and technical signals for ${name} (${ticker}) on Boursee's European ETF screener.`,
  }
}

function fmt(n: number | null | undefined, decimals = 2, suffix = ''): string {
  if (n == null) return '—'
  return n.toFixed(decimals) + suffix
}
function fmtPct(n: number | null | undefined): string {
  if (n == null) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

function QualityDial({ score }: { score: number | null }) {
  if (score == null) return null
  const color = score >= 8 ? '#16a34a' : score >= 5 ? '#ca8a04' : '#dc2626'
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{ fontSize: '48px', fontWeight: 800, color, lineHeight: 1, fontFamily: 'var(--sans)' }}>{score}</div>
      <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quality Score / 10</div>
    </div>
  )
}

function RsiBar({ rsi, signal }: { rsi: number | null; signal: string }) {
  if (rsi == null) return <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>—</span>
  const color = signal === 'overbought' ? '#dc2626' : signal === 'oversold' ? '#16a34a' : 'var(--ink-3)'
  const pct = Math.min(100, Math.max(0, rsi))
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>Oversold &lt;30</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color }}>{rsi.toFixed(1)}</span>
        <span style={{ fontSize: '11px', color: 'var(--ink-4)' }}>&gt;70 Overbought</span>
      </div>
      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: `${pct}%`, top: '-2px', width: '10px', height: '10px', background: color, borderRadius: '50%', transform: 'translateX(-50%)', border: '2px solid #fff', boxShadow: '0 0 0 1px ' + color }} />
      </div>
    </div>
  )
}

function RangeBar({ low, high, current }: { low: number | null; high: number | null; current: number }) {
  if (!low || !high || low >= high) return null
  const pct = Math.min(100, Math.max(0, ((current - low) / (high - low)) * 100))
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: 'var(--ink-4)' }}>
        <span>52W Low: €{low.toFixed(2)}</span>
        <span>52W High: €{high.toFixed(2)}</span>
      </div>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: `${pct}%`, top: '-4px', width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '50%', transform: 'translateX(-50%)', border: '2px solid #fff', boxShadow: '0 0 0 1px var(--accent)' }} />
      </div>
    </div>
  )
}

const SFDR_COLOR: Record<string, string> = { 'Art.9': '#15803d', 'Art.8': '#1d4ed8', 'Art.6': 'var(--ink-4)' }
const SFDR_BG: Record<string, string> = { 'Art.9': '#dcfce7', 'Art.8': '#dbeafe', 'Art.6': 'var(--paper-2)' }

export default async function EtfDetailPage({ params }: { params: Promise<Params> }) {
  const { ticker } = await params
  const e = getAllEtfs().find(et => et.ticker === ticker) as Record<string, unknown> | undefined
  if (!e) notFound()

  const name = String(e.name)
  const exchange = String(e.exchange)
  const price = e.price as number
  const change = e.change as number | null
  const changePct = e.changePct as number | null
  const rsi = e.rsi as number | null
  const rsiSignal = String(e.rsiSignal ?? 'unknown')
  const macdTrend = e.macdTrend as string | null
  const supertrend = e.supertrend as string | null
  const volumeSignal = String(e.volumeSignal ?? 'normal')
  const volumeRatio = e.volumeRatio as number | null
  const qualityScore = e.qualityScore as number | null
  const ter = e.ter as number | null
  const aumB = e.aumB as number | null
  const domicile = e.domicile as string | null
  const accumulating = e.accumulating as boolean | null
  const sfdr = e.sfdr as string | null
  const replication = e.replication as string | null
  const indexTracked = e.indexTracked as string | null
  const category = e.category as string | null
  const week52High = e.week52High as number | null
  const week52Low = e.week52Low as number | null
  const brokerBadges = (e.brokerBadges ?? []) as string[]

  const changePositive = (changePct ?? 0) >= 0
  const TREND_COLOR = (t: string | null) => t === 'bullish' ? '#16a34a' : t === 'bearish' ? '#dc2626' : '#94a3b8'
  const VOL_LABEL: Record<string, string> = { surge: 'Volume Surge', high: 'High Volume', normal: 'Normal', low: 'Low Volume' }
  const VOL_COLOR: Record<string, string> = { surge: '#dc2626', high: '#ca8a04', normal: 'var(--ink-4)', low: 'var(--ink-4)' }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '13px', color: 'var(--ink-4)' }}>
              <Link href="/screener" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Screener</Link>
              <span>·</span>
              <span>ETF</span>
              {category && <><span>·</span><span>{category}</span></>}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {ticker} · {exchange} · UCITS ETF
                  </span>
                </div>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, marginBottom: '10px' }}>
                  {name}
                </h1>
                {indexTracked && (
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)' }}>Tracking: {indexTracked}</div>
                )}
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                  €{price.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: changePositive ? '#16a34a' : '#dc2626' }}>
                  {changePositive ? '▲' : '▼'} {fmtPct(changePct)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>Prices may be delayed up to 15 min</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px 96px' }}>

          {/* Top row: quality + key facts */}
          <div style={{ display: 'grid', gridTemplateColumns: qualityScore != null ? '160px 1fr' : '1fr', gap: '16px', marginBottom: '16px' }}>

            {qualityScore != null && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <QualityDial score={qualityScore} />
              </div>
            )}

            {/* Key ETF facts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {[
                { label: 'TER', value: ter != null ? `${(ter * 100).toFixed(2)}%` : '—' },
                { label: 'AUM', value: aumB != null ? (aumB >= 1 ? `€${aumB.toFixed(1)}B` : `€${(aumB * 1000).toFixed(0)}M`) : '—' },
                { label: 'Domicile', value: domicile ?? '—' },
                { label: 'Type', value: accumulating != null ? (accumulating ? 'Accumulating' : 'Distributing') : '—' },
                { label: 'Replication', value: replication ? replication.charAt(0).toUpperCase() + replication.slice(1) : '—' },
                { label: 'SFDR', value: sfdr ?? '—', color: sfdr ? SFDR_COLOR[sfdr] : undefined, bg: sfdr ? SFDR_BG[sfdr] : undefined },
              ].map(item => (
                <div key={item.label} style={{ background: item.bg ?? '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: item.color ?? 'var(--ink)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Broker badges */}
          {brokerBadges.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 500 }}>Available at:</span>
              {brokerBadges.includes('DEGIRO') && (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '3px', background: '#dcfce7', color: '#166534' }}>DEGIRO FREE</span>
              )}
              {brokerBadges.includes('TR') && (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '3px', background: '#dbeafe', color: '#1e40af' }}>TR Savings Plan</span>
              )}
            </div>
          )}

          {/* 52-week range */}
          {(week52Low || week52High) && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>52-Week Range</div>
              <RangeBar low={week52Low} high={week52High} current={price} />
            </div>
          )}

          {/* Technical signals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>RSI (14)</div>
              <RsiBar rsi={rsi} signal={rsiSignal} />
              <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '8px', textTransform: 'capitalize' }}>{rsiSignal}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>MACD</div>
              {macdTrend ? (
                <div style={{ fontSize: '16px', fontWeight: 700, color: TREND_COLOR(macdTrend), textTransform: 'capitalize' }}>
                  {macdTrend === 'bullish' ? '▲' : '▼'} {macdTrend}
                </div>
              ) : <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>—</span>}
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>SuperTrend</div>
              {supertrend ? (
                <div style={{ fontSize: '16px', fontWeight: 700, color: TREND_COLOR(supertrend), textTransform: 'capitalize' }}>
                  {supertrend === 'bullish' ? '▲' : '▼'} {supertrend}
                </div>
              ) : <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>—</span>}
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Volume</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: VOL_COLOR[volumeSignal] ?? 'var(--ink-4)' }}>
                {VOL_LABEL[volumeSignal] ?? volumeSignal}
              </div>
              {volumeRatio != null && (
                <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>{volumeRatio.toFixed(2)}× average</div>
              )}
            </div>
          </div>

          {/* Guide CTA */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Learn about ETF tax treatment in Europe</div>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)' }}>Dutch Box 3 · German Vorabpauschale 2026 · French PEA eligibility</p>
            </div>
            <Link href="/guides" style={{ background: 'var(--ink)', color: '#fff', padding: '9px 18px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Read Guides →
            </Link>
          </div>

          <Link href="/screener" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            ← Back to Screener
          </Link>

          <div style={{ marginTop: '32px', padding: '14px 18px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
            Data for general information only under MiFID II Article 24. Not investment advice. Quality score is an editorial metric — not a regulated rating. Prices may be delayed up to 15 minutes.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
