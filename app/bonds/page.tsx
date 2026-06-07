import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import { fetchBondYields, type BondYield } from '@/lib/fetchBondYields'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'European Government Bond Yields | Boursee',
  description: 'Live European government bond yields — German Bund, French OAT, Italian BTP, Spanish Bono, UK Gilt — with BTP-Bund spread and equity market context.',
}

export const revalidate = 3600

function SpreadIndicator({ spread }: { spread: number }) {
  const level = spread < 1.0 ? 'calm'
    : spread < 1.5 ? 'normal'
    : spread < 2.0 ? 'elevated'
    : spread < 2.5 ? 'stressed'
    : 'crisis'

  const config = {
    calm:     { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Calm' },
    normal:   { color: '#1a4a2e', bg: '#e8f5ee', border: '#b7e4c7', label: 'Normal' },
    elevated: { color: '#b45309', bg: '#fffbeb', border: '#fde68a', label: 'Elevated' },
    stressed: { color: '#dc2626', bg: '#fff1f2', border: '#fecdd3', label: 'Stressed' },
    crisis:   { color: '#991b1b', bg: '#fee2e2', border: '#fecaca', label: 'Crisis Territory' },
  }[level]

  return (
    <div style={{ background: config.bg, border: `1px solid ${config.border}`, borderRadius: '6px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: config.color, marginBottom: '4px' }}>
          BTP–Bund Spread
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '36px', fontWeight: 700, color: config.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {spread.toFixed(0)} bps
        </div>
        <div style={{ fontSize: '13px', color: config.color, marginTop: '4px', fontWeight: 500 }}>
          {config.label}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: '200px', fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
        The BTP–Bund spread measures Italy's risk premium over Germany. Below 150 bps: eurozone confidence is high.
        Above 200 bps: investors are pricing in meaningful Italian fiscal risk. Above 300 bps: historical stress territory.
      </div>
    </div>
  )
}

function YieldCard({ bond, deYield }: { bond: BondYield; deYield: number | null }) {
  const spread = bond.yield != null && deYield != null && bond.code !== 'DE'
    ? (bond.yield - deYield) * 100
    : null

  const isHigh = bond.yield != null && (
    (bond.code === 'DE' && bond.yield > 2.5) ||
    (bond.code === 'FR' && bond.yield > 3.2) ||
    (bond.code === 'IT' && bond.yield > 4.0) ||
    (bond.code === 'ES' && bond.yield > 3.5) ||
    (bond.code === 'GB' && bond.yield > 4.5)
  )

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>{bond.flag}</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{bond.country}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-4)' }}>{bond.label}</div>
        </div>
        {!bond.isLive && (
          <span style={{ marginLeft: 'auto', fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '2px', fontWeight: 500 }}>
            Reference
          </span>
        )}
      </div>

      <div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {bond.yield != null ? `${bond.yield.toFixed(2)}%` : '—'}
        </div>
        {isHigh && (
          <div style={{ fontSize: '11px', color: '#b45309', marginTop: '4px', fontWeight: 500 }}>
            Elevated vs historical average
          </div>
        )}
      </div>

      {spread !== null && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
          <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginBottom: '2px' }}>vs Bund spread</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: spread > 150 ? '#dc2626' : spread > 80 ? '#b45309' : '#16a34a', fontVariantNumeric: 'tabular-nums' }}>
            +{spread.toFixed(0)} bps
          </div>
        </div>
      )}

      {bond.date && (
        <div style={{ fontSize: '10px', color: 'var(--ink-4)' }}>
          ECB data: {bond.date}
        </div>
      )}
    </div>
  )
}

function YieldBar({ bonds }: { bonds: BondYield[] }) {
  const max = Math.max(...bonds.filter(b => b.yield != null).map(b => b.yield!))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {bonds.map(b => {
        const pct = b.yield != null ? (b.yield / (max * 1.1)) * 100 : 0
        return (
          <div key={b.code} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '22px', textAlign: 'center', fontSize: '16px' }}>{b.flag}</div>
            <div style={{ width: '100px', fontSize: '12px', color: 'var(--ink-3)', fontWeight: 500 }}>{b.label}</div>
            <div style={{ flex: 1, height: '8px', background: 'var(--paper-2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: b.code === 'IT' ? '#dc2626' : b.code === 'GB' ? '#1a4a2e' : 'var(--accent-mid)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ width: '48px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
              {b.yield != null ? `${b.yield.toFixed(2)}%` : '—'}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default async function BondsPage() {
  const bonds = await fetchBondYields()
  const deYield = bonds.find(b => b.code === 'DE')?.yield ?? null
  const itYield = bonds.find(b => b.code === 'IT')?.yield ?? null
  const btpBundSpread = deYield != null && itYield != null ? (itYield - deYield) * 100 : null
  const anyLive = bonds.some(b => b.isLive)

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', background: 'var(--paper)' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff', padding: '40px 0 32px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Fixed Income
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
              European Government Bond Yields
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--ink-3)', maxWidth: '580px', lineHeight: 1.6 }}>
              10-year benchmark yields for Germany, France, Italy, Spain, and the UK — the sovereign bond market that anchors European equity valuations.
            </p>
            {!anyLive && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '4px', padding: '8px 12px', fontSize: '12px', color: '#92400e' }}>
                <span>⚠</span>
                Reference yields shown — ECB monthly data. Refresh for latest.
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 32px 48px' }}>

          {/* BTP-Bund Spread */}
          {btpBundSpread !== null && (
            <div style={{ marginBottom: '32px' }}>
              <SpreadIndicator spread={btpBundSpread} />
            </div>
          )}

          {/* Yield cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {bonds.map(bond => (
              <YieldCard key={bond.code} bond={bond} deYield={deYield} />
            ))}
          </div>

          {/* Visual bar chart */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '-0.01em' }}>
              Yield Comparison
            </h2>
            <YieldBar bonds={bonds} />
          </div>

          {/* Explainer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                Why bonds move equity markets
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                Equity valuation (P/E multiples) is partly determined by the risk-free rate. When 10-year Bund yields rise, the discount rate applied to future earnings increases — compressing P/E multiples even if earnings hold flat. A 100 bps rise in yields typically justifies 10–15% lower P/E multiples.
              </p>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                Reading the BTP–Bund spread
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                The spread between Italian BTPs and German Bunds is the eurozone's most-watched credit indicator. A widening spread signals that investors perceive increasing Italian fiscal or political risk. Spreads above 200 bps typically trigger ECB commentary; above 250 bps, market intervention discussions begin.
              </p>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>
                ECB policy and yield curve
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                The ECB's deposit rate anchors the short end of the yield curve. Long-end yields (10Y) are market-determined and reflect growth expectations and inflation premia. When the ECB cuts rates while long yields stay high, the curve steepens — historically a signal of economic recovery.
              </p>
            </div>
          </div>

          {/* Historical context */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px', letterSpacing: '-0.01em' }}>
              Historical Context
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    {['Period', '🇩🇪 Bund', '🇫🇷 OAT', '🇮🇹 BTP', 'BTP–Bund', 'Context'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 500, color: 'var(--ink-4)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { period: '2021 (NIRP)', bund: '-0.2%', oat: '0.0%', btp: '0.9%', spread: '110 bps', ctx: 'ECB NIRP era, QE peak' },
                    { period: '2022 (rate hike)', bund: '2.5%', oat: '3.0%', btp: '4.5%', spread: '200 bps', ctx: 'ECB 250 bps of hikes' },
                    { period: '2023 (peak)', bund: '2.8%', oat: '3.5%', btp: '4.8%', spread: '200 bps', ctx: 'Inflation fight peaks' },
                    { period: '2024 (cuts begin)', bund: '2.4%', oat: '3.2%', btp: '3.9%', spread: '150 bps', ctx: 'ECB starts easing cycle' },
                  ].map((row, i) => (
                    <tr key={row.period} style={{ borderBottom: i < 3 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? '#fff' : 'var(--paper)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{row.period}</td>
                      <td style={{ padding: '10px 12px', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-3)' }}>{row.bund}</td>
                      <td style={{ padding: '10px 12px', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-3)' }}>{row.oat}</td>
                      <td style={{ padding: '10px 12px', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-3)' }}>{row.btp}</td>
                      <td style={{ padding: '10px 12px', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-3)' }}>{row.spread}</td>
                      <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--ink-4)' }}>{row.ctx}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/ecb-watch" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '3px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', letterSpacing: '0.02em' }}>
              ECB Watch →
            </Link>
            <Link href="/macro-bridge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fff', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '3px', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
              Macro–Equity Bridge →
            </Link>
          </div>

          <div style={{ marginTop: '20px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
            Yields sourced from ECB Statistical Data Warehouse (monthly Maastricht criterion rates). Reference yields shown where live data is unavailable.
            This page is for research and information purposes only. Not investment advice. MiFID II: Boursee is a data and research platform, not a regulated investment adviser.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
