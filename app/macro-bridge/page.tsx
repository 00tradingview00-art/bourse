import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { fetchMarkets, getStaticMarkets } from '@/lib/fetchMarkets'
import { fetchBriefs } from '@/lib/fetchBriefs'

// Permanent macro→equity connections for European markets.
// Shown alongside today's live values.
const CONNECTIONS = [
  {
    macro: 'Brent Crude',
    ticker: 'BZ=F',
    direction: 'up',
    signal: 'Crude rising',
    stocks: [
      { name: 'Shell', ticker: 'SHELL.AS', exchange: 'AEX' },
      { name: 'TotalEnergies', ticker: 'TTE.PA', exchange: 'CAC' },
    ],
    mechanism: 'Higher crude lifts upstream revenue and refining spreads for integrated majors. Watch for downstream margin compression at petrochemicals divisions.',
  },
  {
    macro: 'Brent Crude',
    ticker: 'BZ=F',
    direction: 'down',
    signal: 'Crude falling',
    stocks: [
      { name: 'ArcelorMittal', ticker: 'MT.AS', exchange: 'AEX' },
      { name: 'Air France-KLM', ticker: 'AF.PA', exchange: 'CAC' },
    ],
    mechanism: 'Lower energy costs reduce input costs for steel and aluminium producers, and cut jet-fuel expense for European carriers — improving operating margins.',
  },
  {
    macro: 'EUR/USD',
    ticker: 'EUR/USD',
    direction: 'up',
    signal: 'Euro strengthening',
    stocks: [
      { name: 'ASML', ticker: 'ASML.AS', exchange: 'AEX' },
      { name: 'Adyen', ticker: 'ADYEN.AS', exchange: 'AEX' },
      { name: 'Airbus', ticker: 'AIR.PA', exchange: 'CAC' },
    ],
    mechanism: 'Dollar-denominated revenue is worth less in euro terms on repatriation. ASML invoices in EUR but competes globally — muted direct impact. Airbus contracts partially in USD, creating FX headwind.',
  },
  {
    macro: 'EUR/USD',
    ticker: 'EUR/USD',
    direction: 'down',
    signal: 'Euro weakening',
    stocks: [
      { name: 'LVMH', ticker: 'MC.PA', exchange: 'CAC' },
      { name: 'Stellantis', ticker: 'STLAM.AS', exchange: 'AEX' },
    ],
    mechanism: 'Weaker euro boosts euro-value of USD and Asian revenues for luxury and auto exporters. LVMH earns ~25% revenue in the Americas — a tailwind on translation.',
  },
  {
    macro: 'ECB Rate',
    ticker: '',
    direction: 'up',
    signal: 'ECB hawkish / rate hike',
    stocks: [
      { name: 'ING', ticker: 'INGA.AS', exchange: 'AEX' },
      { name: 'ABN AMRO', ticker: 'ABN.AS', exchange: 'AEX' },
      { name: 'BNP Paribas', ticker: 'BNP.PA', exchange: 'CAC' },
    ],
    mechanism: 'Higher short-end rates directly expand Net Interest Income for retail banks. Watch for steepening/flattening of the EUR swap curve — a steeper curve is most beneficial for NII.',
  },
  {
    macro: 'ECB Rate',
    ticker: '',
    direction: 'down',
    signal: 'ECB dovish / rate cut',
    stocks: [
      { name: 'Vonovia', ticker: 'VNA.DE', exchange: 'DAX' },
      { name: 'Unibail-Rodamco', ticker: 'URW.AS', exchange: 'AEX' },
    ],
    mechanism: 'Lower rates reduce financing costs for real estate companies with large floating-rate debt loads, improving free cash flow and supporting REIT valuations.',
  },
  {
    macro: 'Gold',
    ticker: 'GC=F',
    direction: 'up',
    signal: 'Gold rallying',
    stocks: [
      { name: 'Fresnillo', ticker: 'FRES.L', exchange: 'FTSE' },
    ],
    mechanism: 'Fresnillo is the primary LSE-listed gold and silver miner. Limited direct exposure on AEX/DAX — gold\'s main European equity read-through is risk sentiment, not specific stocks.',
  },
  {
    macro: 'Natural Gas (TTF)',
    ticker: 'NG=F',
    direction: 'up',
    signal: 'Gas prices rising',
    stocks: [
      { name: 'ArcelorMittal', ticker: 'MT.AS', exchange: 'AEX' },
      { name: 'Yara International', ticker: 'YAR.OL', exchange: 'Oslo' },
    ],
    mechanism: 'Natural gas is a critical input for steel (blast furnace) and fertiliser production. Higher TTF gas prices compress margins for European industrial users — Yara is the most direct read.',
  },
]

async function getMarkets() {
  try { return await fetchMarkets() } catch { return getStaticMarkets() }
}

function DirectionBadge({ direction, pct }: { direction: 'up' | 'down' | 'flat'; pct: string }) {
  const color = direction === 'up' ? '#16a34a' : direction === 'down' ? 'var(--red)' : 'var(--ink-3)'
  const bg = direction === 'up' ? '#dcfce7' : direction === 'down' ? 'var(--red-light)' : 'var(--paper-2)'
  return (
    <span style={{ fontSize: '12px', fontWeight: 600, color, background: bg, padding: '2px 8px', borderRadius: '3px', fontVariantNumeric: 'tabular-nums' }}>
      {pct}
    </span>
  )
}

export default async function MacroBridgePage() {
  const [{ tickerData }, briefs] = await Promise.all([getMarkets(), fetchBriefs()])
  const latestBrief = briefs[0]

  // Index live ticker data by ticker symbol for fast lookup
  const liveByTicker = new Map(tickerData.map(m => [m.ticker, m]))
  const brent = liveByTicker.get('BZ=F')
  const gold  = liveByTicker.get('GC=F')
  const eurUsd = tickerData.find(m => m.name === 'EUR/USD')

  // Determine which connections are "active" based on today's direction
  function isActive(conn: typeof CONNECTIONS[0]) {
    if (conn.ticker === 'BZ=F') return brent ? (conn.direction === 'up') === (brent.direction === 'up') : false
    if (conn.ticker === 'GC=F') return gold ? (conn.direction === 'up') === (gold.direction === 'up') : false
    if (conn.ticker === 'EUR/USD') return eurUsd ? (conn.direction === 'up') === (eurUsd.direction === 'up') : false
    return false
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--paper)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Intelligence Layer
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              Macro–Equity Bridge
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', maxWidth: '580px', lineHeight: 1.65 }}>
              How today's macro signals flow through to specific European stocks. Crude, FX, ECB rate, and energy prices — mapped to the names in your portfolio.
            </p>
            {latestBrief && (
              <div style={{ marginTop: '20px', fontSize: '13px', color: 'var(--ink-4)' }}>
                Signals updated from{' '}
                <Link href={`/briefs/${latestBrief.slug}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                  Edition #{String(latestBrief.edition).padStart(3, '0')} — {latestBrief.dateShort}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Live signal strip */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 32px', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Live today</span>
            {brent && <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}><span style={{ color: 'var(--ink-3)' }}>Brent</span><span style={{ fontWeight: 600, color: 'var(--ink)' }}>{brent.value}</span><DirectionBadge direction={brent.direction} pct={brent.changePct} /></div>}
            {eurUsd && <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}><span style={{ color: 'var(--ink-3)' }}>EUR/USD</span><span style={{ fontWeight: 600, color: 'var(--ink)' }}>{eurUsd.value}</span><DirectionBadge direction={eurUsd.direction} pct={eurUsd.changePct} /></div>}
            {gold && <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}><span style={{ color: 'var(--ink-3)' }}>Gold</span><span style={{ fontWeight: 600, color: 'var(--ink)' }}>{gold.value}</span><DirectionBadge direction={gold.direction} pct={gold.changePct} /></div>}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}><span style={{ color: 'var(--ink-3)' }}>ECB Rate</span><span style={{ fontWeight: 600, color: 'var(--ink)' }}>2.00%</span><span style={{ fontSize: '11px', color: 'var(--gold)', background: 'var(--gold-light)', padding: '2px 8px', borderRadius: '3px' }}>Jun 11 watch</span></div>
          </div>
        </div>

        {/* Connection map */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 96px' }}>

          <div style={{ display: 'grid', gap: '12px' }}>
            {CONNECTIONS.map((conn, i) => {
              const active = isActive(conn)
              return (
                <div
                  key={i}
                  style={{
                    background: active ? '#fff' : 'var(--paper)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    borderLeft: `4px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '4px',
                    padding: '20px 24px',
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr 1fr',
                    gap: '24px',
                    alignItems: 'start',
                  }}
                >
                  {/* Signal */}
                  <div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                      {active && (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'var(--accent)' : 'var(--ink-4)' }}>
                        {active ? 'Active today' : 'Watch when'}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                      {conn.signal}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '4px' }}>{conn.macro}</div>
                  </div>

                  {/* Affected stocks */}
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '10px' }}>
                      European names
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {conn.stocks.map(s => (
                        <div key={s.ticker} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{s.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--ink-4)', fontFamily: 'monospace', background: 'var(--paper-2)', padding: '1px 6px', borderRadius: '2px' }}>{s.ticker}</span>
                          <span style={{ fontSize: '10px', color: 'var(--ink-4)' }}>{s.exchange}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mechanism */}
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '10px' }}>
                      Mechanism
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.65 }}>
                      {conn.mechanism}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: '48px', padding: '16px 20px', background: 'var(--gold-light)', border: '1px solid var(--border)', borderLeft: '3px solid var(--gold)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            Market Analysis · General information only · Not personalised investment advice · Data may be delayed.{' '}
            <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>See full disclaimer →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
