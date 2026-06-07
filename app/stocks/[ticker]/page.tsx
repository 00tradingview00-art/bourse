import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import screenerData from '@/data/screener.json'

type Params = { ticker: string }

const EXCHANGE_FLAG: Record<string, string> = {
  AEX: '🇳🇱', DAX: '🇩🇪', CAC: '🇫🇷', FTSE: '🇬🇧', IBEX: '🇪🇸', FTSE_MIB: '🇮🇹', OMX: '🇸🇪',
}
const EXCHANGE_LABEL: Record<string, string> = {
  AEX: 'Euronext Amsterdam', DAX: 'Xetra', CAC: 'Euronext Paris', FTSE: 'LSE',
  IBEX: 'BME Madrid', FTSE_MIB: 'Borsa Italiana', OMX: 'Nasdaq Nordic',
}

function getAllStocks() {
  const d = screenerData as Record<string, unknown>
  const all = (d.stocks ?? d.instruments ?? []) as Record<string, unknown>[]
  return all.filter(s => s.type === 'stock')
}

export async function generateStaticParams(): Promise<Params[]> {
  return getAllStocks().map(s => ({ ticker: String(s.ticker) }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ticker } = await params
  const stock = getAllStocks().find(s => s.ticker === ticker)
  if (!stock) return { title: 'Stock Not Found | Boursee' }
  const name = String(stock.name)
  return {
    title: `${name} (${ticker}) — Stock Analysis | Boursee`,
    description: `Technical signals and key metrics for ${name} (${ticker}) on Boursee's European stock screener.`,
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
function fmtCap(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}T`
  if (n >= 1) return `€${n.toFixed(1)}B`
  return `€${(n * 1000).toFixed(0)}M`
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

export default async function StockDetailPage({ params }: { params: Promise<Params> }) {
  const { ticker } = await params
  const s = getAllStocks().find(st => st.ticker === ticker) as Record<string, unknown> | undefined
  if (!s) notFound()

  const name = String(s.name)
  const exchange = String(s.exchange)
  const sector = String(s.sector ?? '')
  const price = s.price as number
  const change = s.change as number | null
  const changePct = s.changePct as number | null
  const rsi = s.rsi as number | null
  const rsiSignal = String(s.rsiSignal ?? 'unknown')
  const macdTrend = s.macdTrend as string | null
  const macdCross = s.macdCross as string | null
  const supertrend = s.supertrend as string | null
  const volumeSignal = String(s.volumeSignal ?? 'normal')
  const volumeRatio = s.volumeRatio as number | null
  const peRatio = s.peRatio as number | null
  const dividendYield = s.dividendYield as number | null
  const marketCapB = s.marketCapB as number | null
  const analystGrade = s.analystGrade as string | null
  const week52High = s.week52High as number | null
  const week52Low = s.week52Low as number | null
  const relativeStrength = s.relativeStrength as number | null

  const changePositive = (change ?? 0) >= 0

  const GRADE_COLOR: Record<string, string> = {
    'Strong Buy': '#16a34a', Buy: '#4ade80', Hold: '#ca8a04', Sell: '#dc2626',
  }
  const TREND_COLOR = (t: string | null) => t === 'bullish' ? '#16a34a' : t === 'bearish' ? '#dc2626' : '#94a3b8'
  const VOL_LABEL: Record<string, string> = { surge: 'Volume Surge', high: 'High Volume', normal: 'Normal', low: 'Low Volume' }
  const VOL_COLOR: Record<string, string> = { surge: '#dc2626', high: '#ca8a04', normal: 'var(--ink-4)', low: 'var(--ink-4)' }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Breadcrumb + header */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '13px', color: 'var(--ink-4)' }}>
              <Link href="/screener" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Screener</Link>
              <span>·</span>
              <span>{exchange}</span>
              {sector && <><span>·</span><span>{sector}</span></>}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{EXCHANGE_FLAG[exchange] ?? '🌍'}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '12px', fontWeight: 500, color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {ticker} · {EXCHANGE_LABEL[exchange] ?? exchange}
                  </span>
                </div>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.1 }}>
                  {name}
                </h1>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                  €{price.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: changePositive ? '#16a34a' : '#dc2626' }}>
                  {changePositive ? '▲' : '▼'} {Math.abs(change ?? 0).toFixed(2)} ({fmtPct(changePct)})
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>Prices may be delayed up to 15 min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px 96px' }}>

          {/* Fundamentals row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '40px' }}>
            {[
              { label: 'P/E Ratio', value: fmt(peRatio, 1) },
              { label: 'Dividend Yield', value: peRatio == null && dividendYield == null ? '—' : fmt(dividendYield, 2, '%') },
              { label: 'Market Cap', value: fmtCap(marketCapB) },
              { label: 'Analyst Grade', value: analystGrade ?? '—', color: analystGrade ? GRADE_COLOR[analystGrade] : undefined },
              { label: 'Rel. Strength (30d)', value: relativeStrength != null ? fmtPct(relativeStrength) : '—', color: relativeStrength != null ? (relativeStrength >= 0 ? '#16a34a' : '#dc2626') : undefined },
            ].map(item => (
              <div key={item.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '14px 16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: item.color ?? 'var(--ink)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* 52-week range */}
          {(week52Low || week52High) && (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>52-Week Range</div>
              <RangeBar low={week52Low} high={week52High} current={price} />
            </div>
          )}

          {/* Technical signals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>

            {/* RSI */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>RSI (14)</div>
              <RsiBar rsi={rsi} signal={rsiSignal} />
              <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '8px', textTransform: 'capitalize' }}>{rsiSignal}</div>
            </div>

            {/* MACD */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>MACD (12,26,9)</div>
              {macdTrend ? (
                <>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: TREND_COLOR(macdTrend), textTransform: 'capitalize', marginBottom: '4px' }}>
                    {macdTrend === 'bullish' ? '▲' : '▼'} {macdTrend}
                  </div>
                  {macdCross && (
                    <div style={{ fontSize: '12px', color: macdCross === 'cross-up' ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
                      {macdCross === 'cross-up' ? '↑ Cross-up signal' : '↓ Cross-down signal'}
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>Hist: {fmt(s.macdHist as number | null, 4)}</div>
                </>
              ) : <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>—</span>}
            </div>

            {/* SuperTrend */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>SuperTrend (10,3)</div>
              {supertrend ? (
                <div style={{ fontSize: '16px', fontWeight: 700, color: TREND_COLOR(supertrend), textTransform: 'capitalize' }}>
                  {supertrend === 'bullish' ? '▲' : '▼'} {supertrend}
                </div>
              ) : <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>—</span>}
            </div>

            {/* Volume */}
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Volume (vs 20d avg)</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: VOL_COLOR[volumeSignal] ?? 'var(--ink-4)' }}>
                {VOL_LABEL[volumeSignal] ?? volumeSignal}
              </div>
              {volumeRatio != null && (
                <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '4px' }}>{volumeRatio.toFixed(2)}× average</div>
              )}
            </div>
          </div>

          {/* Back to screener */}
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/screener" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              ← Back to Screener
            </Link>
            {sector && (
              <>
                <span style={{ color: 'var(--border)' }}>·</span>
                <Link href={`/screener`} style={{ fontSize: '13px', color: 'var(--ink-4)', textDecoration: 'none' }}>
                  View other {sector} stocks →
                </Link>
              </>
            )}
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: '40px', padding: '14px 18px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
            Data for general information only under MiFID II Article 24. Not investment advice. Technical indicators are derived from price history and do not predict future performance. Prices may be delayed up to 15 minutes.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
