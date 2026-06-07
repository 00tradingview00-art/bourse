import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { readFile } from 'fs/promises'
import { join } from 'path'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import PriceChart, { type OHLCVBar } from '@/app/components/PriceChart'
import screenerData from '@/data/screener.json'

type Params = { ticker: string }

const EXCHANGE_FLAG: Record<string, string> = {
  AEX: '🇳🇱', DAX: '🇩🇪', CAC: '🇫🇷', FTSE: '🇬🇧', IBEX: '🇪🇸', FTSE_MIB: '🇮🇹', OMX: '🇸🇪',
}
const EXCHANGE_LABEL: Record<string, string> = {
  AEX: 'Euronext Amsterdam', DAX: 'Xetra Frankfurt', CAC: 'Euronext Paris',
  FTSE: 'London Stock Exchange', IBEX: 'BME Madrid', FTSE_MIB: 'Borsa Italiana', OMX: 'Nasdaq Nordic',
}
const EXCHANGE_INDEX: Record<string, string> = {
  AEX: 'AEX', DAX: 'DAX 40', CAC: 'CAC 40', FTSE: 'FTSE 100',
  IBEX: 'IBEX 35', FTSE_MIB: 'FTSE MIB', OMX: 'OMX 30',
}

type Stock = {
  type?: string; ticker: string; name: string; exchange: string; sector: string
  price: number; change: number | null; changePct: number | null
  peRatio?: number | null; dividendYield?: number | null; marketCapB?: number | null
  week52High?: number | null; week52Low?: number | null
  relativeStrength?: number | null; rsi?: number | null; rsiSignal?: string
  volumeSignal?: string; volumeRatio?: number | null
}

function getAllStocks(): Stock[] {
  const d = screenerData as Record<string, unknown>
  const all = (d.stocks ?? d.instruments ?? []) as Stock[]
  return all.filter(s => s.type === 'stock')
}

export async function generateStaticParams(): Promise<Params[]> {
  return getAllStocks().map(s => ({ ticker: s.ticker }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ticker } = await params
  const stock = getAllStocks().find(s => s.ticker === ticker)
  if (!stock) return { title: 'Stock Not Found | Boursee' }
  return {
    title: `${stock.name} (${ticker}) — ${stock.exchange} | Boursee`,
    description: `${stock.name} share price, 52-week range, and sector context on the Boursee European stock screener. ${stock.exchange} · ${stock.sector}.`,
  }
}

function fmtPct(n: number | null | undefined): string {
  if (n == null) return '—'
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
}
function fmtCap(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}T`
  if (n >= 1)    return `€${n.toFixed(1)}B`
  return `€${(n * 1000).toFixed(0)}M`
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

function RsiGauge({ rsi, signal }: { rsi: number; signal: string }) {
  const color  = signal === 'overbought' ? '#dc2626' : signal === 'oversold' ? '#16a34a' : 'var(--accent)'
  const label  = signal === 'overbought' ? 'Overbought — momentum stretched' : signal === 'oversold' ? 'Oversold — potential value zone' : 'Neutral momentum'
  const pct    = Math.min(100, Math.max(0, rsi))
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
        <span style={{ fontSize: '24px', fontWeight: 700, color }}>{rsi.toFixed(0)}</span>
        <span style={{ fontSize: '12px', color: 'var(--ink-4)' }}>out of 100</span>
      </div>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'relative', marginBottom: '8px' }}>
        <div style={{ position: 'absolute', left: `${pct}%`, top: '-5px', width: '14px', height: '14px', background: color, borderRadius: '50%', transform: 'translateX(-50%)', border: '2px solid #fff' }} />
      </div>
      <div style={{ fontSize: '12px', color }}>{label}</div>
      <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>RSI below 30 = oversold · above 70 = overbought</div>
    </div>
  )
}

export default async function StockDetailPage({ params }: { params: Promise<Params> }) {
  const { ticker } = await params
  const allStocks  = getAllStocks()
  const s          = allStocks.find(st => st.ticker === ticker)
  if (!s) notFound()

  const { name, exchange, sector, price, change, changePct, peRatio, dividendYield,
          marketCapB, week52High, week52Low, relativeStrength, rsi, rsiSignal,
          volumeSignal, volumeRatio } = s

  const changePositive = (change ?? 0) >= 0

  // Load per-stock OHLCV for price chart
  let ohlcv: OHLCVBar[] = []
  try {
    const safe = ticker.replace(/[^a-zA-Z0-9._-]/g, '_')
    const raw  = await readFile(join(process.cwd(), 'data', 'stocks', `${safe}.json`), 'utf8')
    ohlcv = JSON.parse(raw)
  } catch { /* no chart data yet */ }

  // Sector peers — same sector, different ticker, up to 5
  const peers = allStocks
    .filter(p => p.sector === sector && p.ticker !== ticker)
    .sort((a, b) => Math.abs(b.changePct ?? 0) - Math.abs(a.changePct ?? 0))
    .slice(0, 5)

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 32px 32px' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: 'var(--ink-4)' }}>
              <Link href="/screener" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Screener</Link>
              <span>›</span>
              <Link href={`/screener?exchange=${exchange}`} style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>
                {EXCHANGE_FLAG[exchange]} {exchange}
              </Link>
              <span>›</span>
              <Link href={`/sectors`} style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>{sector}</Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {ticker} · {EXCHANGE_LABEL[exchange] ?? exchange}
                </div>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1, marginBottom: '8px' }}>
                  {name}
                </h1>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', background: 'var(--paper-2)', color: 'var(--ink-4)', padding: '3px 8px', borderRadius: '2px', fontWeight: 500 }}>{sector}</span>
                  <span style={{ fontSize: '12px', background: 'var(--paper-2)', color: 'var(--ink-4)', padding: '3px 8px', borderRadius: '2px' }}>{EXCHANGE_INDEX[exchange]}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  €{price.toFixed(2)}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: changePositive ? '#16a34a' : '#dc2626', marginTop: '4px' }}>
                  {changePositive ? '▲' : '▼'} €{Math.abs(change ?? 0).toFixed(2)} ({fmtPct(changePct)})
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '6px' }}>Prices may be delayed up to 15 min</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 32px 96px' }}>

          {/* Price chart */}
          <PriceChart data={ohlcv} currentPrice={price} />

          {/* Key metrics strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '28px' }}>
            {[
              { label: 'P/E Ratio',        value: peRatio        != null ? peRatio.toFixed(1) : '—' },
              { label: 'Dividend Yield',   value: dividendYield  != null ? `${dividendYield.toFixed(2)}%` : '—' },
              { label: 'Market Cap',       value: fmtCap(marketCapB) },
              { label: 'vs ' + (EXCHANGE_INDEX[exchange] ?? 'Index') + ' (30d)',
                value: fmtPct(relativeStrength),
                color: relativeStrength != null ? (relativeStrength >= 0 ? '#16a34a' : '#dc2626') : undefined },
              { label: 'Today',
                value: fmtPct(changePct),
                color: (changePct ?? 0) >= 0 ? '#16a34a' : '#dc2626' },
            ].map(m => (
              <div key={m.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', fontWeight: 500 }}>{m.label}</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: m.color ?? 'var(--ink)' }}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* 52-week range */}
          {week52High && week52Low && week52High > week52Low && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '16px' }}>52-Week Range</div>
              <RangeBar low={week52Low} high={week52High} current={price} />
            </div>
          )}

          {/* Sector peers */}
          {peers.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                  {sector} Peers
                </div>
                <Link href={`/sectors`} style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                  Sector heatmap →
                </Link>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Company', 'Exchange', 'Price', 'Today', 'vs Index (30d)'].map(h => (
                        <th key={h} style={{ padding: '6px 10px', textAlign: h === 'Company' ? 'left' : 'right', fontSize: '11px', fontWeight: 600, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Current stock row */}
                    <tr style={{ background: 'var(--paper-2)', borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 10px', fontWeight: 700, color: 'var(--ink)' }}>{name}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: 'var(--ink-4)', fontSize: '12px' }}>{EXCHANGE_FLAG[exchange]} {exchange}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>€{price.toFixed(2)}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 600, color: (changePct ?? 0) >= 0 ? '#16a34a' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>{fmtPct(changePct)}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'right', color: relativeStrength != null ? (relativeStrength >= 0 ? '#16a34a' : '#dc2626') : 'var(--ink-4)', fontVariantNumeric: 'tabular-nums' }}>{fmtPct(relativeStrength)}</td>
                    </tr>
                    {peers.map(p => (
                      <tr key={p.ticker} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 10px' }}>
                          <Link href={`/stocks/${p.ticker}`} style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 500 }}>{p.name}</Link>
                        </td>
                        <td style={{ padding: '10px 10px', textAlign: 'right', color: 'var(--ink-4)', fontSize: '12px' }}>{EXCHANGE_FLAG[p.exchange]} {p.exchange}</td>
                        <td style={{ padding: '10px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>€{p.price.toFixed(2)}</td>
                        <td style={{ padding: '10px 10px', textAlign: 'right', color: (p.changePct ?? 0) >= 0 ? '#16a34a' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>{fmtPct(p.changePct)}</td>
                        <td style={{ padding: '10px 10px', textAlign: 'right', color: p.relativeStrength != null ? (p.relativeStrength >= 0 ? '#16a34a' : '#dc2626') : 'var(--ink-4)', fontVariantNumeric: 'tabular-nums' }}>{fmtPct(p.relativeStrength)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RSI + Volume — simplified */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '14px' }}>Momentum (RSI 14)</div>
              {rsi != null
                ? <RsiGauge rsi={rsi} signal={rsiSignal ?? 'neutral'} />
                : <span style={{ fontSize: '14px', color: 'var(--ink-4)' }}>No data</span>}
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '14px' }}>Trading Volume</div>
              {volumeSignal ? (
                <>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: volumeSignal === 'surge' ? '#dc2626' : volumeSignal === 'high' ? '#ca8a04' : 'var(--ink-3)', marginBottom: '6px', textTransform: 'capitalize' }}>
                    {volumeSignal === 'surge' ? '⚡ Volume Surge' : volumeSignal === 'high' ? '↑ Above Average' : volumeSignal === 'low' ? '↓ Below Average' : 'Normal'}
                  </div>
                  {volumeRatio != null && (
                    <div style={{ fontSize: '13px', color: 'var(--ink-4)' }}>{volumeRatio.toFixed(2)}× the 20-day average</div>
                  )}
                  <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '6px' }}>High volume = stronger price moves</div>
                </>
              ) : <span style={{ fontSize: '14px', color: 'var(--ink-4)' }}>No data</span>}
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', marginBottom: '40px' }}>
            <Link href="/screener" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>← Back to Screener</Link>
            <Link href="/sectors" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Sector Heatmap →</Link>
            <Link href="/guides" style={{ color: 'var(--ink-4)', textDecoration: 'none' }}>Investor Guides →</Link>
          </div>

          {/* Disclaimer */}
          <div style={{ padding: '14px 18px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
            For general information only. Not investment advice under MiFID II Article 24. RSI and volume signals are derived from historical price data and do not predict future performance. Prices may be delayed up to 15 minutes.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
