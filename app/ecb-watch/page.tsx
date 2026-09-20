import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { fetchMarkets } from '@/lib/fetchMarkets'
import {
  ECB_DECISION_DAYS,
  fetchEcbRates,
  formatBp,
  formatEcbDate,
  nextEcbDecision,
} from '@/lib/fetchEcbRates'

export const revalidate = 3600

export const metadata = {
  title: 'ECB Rate Watch — Deposit Rate, Decisions and Meeting Calendar | Boursee',
  description: 'The ECB deposit facility rate, every rate change since 2023 and the next Governing Council decision dates, from ECB data, with what it means for European equities.',
}

const HISTORY_ROWS = 10

async function getBackdrop() {
  try {
    const { tickerData } = await fetchMarkets()
    return {
      brent: tickerData.find(m => m.ticker === 'BZ=F'),
      eurUsd: tickerData.find(m => m.name === 'EUR/USD'),
    }
  } catch {
    return { brent: undefined, eurUsd: undefined }
  }
}

export default async function ECBWatchPage() {
  const [rates, backdrop] = await Promise.all([fetchEcbRates(), getBackdrop()])
  const next = nextEcbDecision()
  const lastChange = rates?.changes[rates.changes.length - 1]
  const history = rates ? [...rates.changes].reverse().slice(0, HISTORY_ROWS) : []
  const upcoming = ECB_DECISION_DAYS.filter(d => d >= new Date().toISOString().slice(0, 10))

  const backdropRows = [
    backdrop.eurUsd && { label: 'EUR/USD', value: backdrop.eurUsd.value, note: 'A stronger euro lowers import prices and eases inflation pressure; a weaker euro does the opposite.' },
    backdrop.brent && { label: 'Brent crude', value: backdrop.brent.value, note: 'Energy prices feed straight into headline inflation, the number the ECB is judged on.' },
  ].filter((r): r is { label: string; value: string; note: string } => Boolean(r))

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Central Bank Intelligence
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '12px', lineHeight: 1.15 }}>
              ECB Rate Watch
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--ink-3)', maxWidth: '540px', lineHeight: 1.65 }}>
              European Central Bank policy decisions, rate path, and meeting calendar. Independent analysis for European equity and fixed-income investors.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 96px' }}>

          {/* Rate hero + next meeting + last change */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '48px' }}>
            <div style={{ background: '#fff', padding: '28px 32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Deposit Facility Rate</div>
              {rates ? (
                <>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '48px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginBottom: '8px' }}>{rates.current.toFixed(2)}%</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)' }}>Effective since {formatEcbDate(rates.since)}</div>
                </>
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.5 }}>ECB rate data is temporarily unavailable.</div>
              )}
            </div>
            <div style={{ background: '#fff', padding: '28px 32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Next Rate Decision</div>
              {next ? (
                <>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '8px' }}>{formatEcbDate(next.date)}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)' }}>{next.daysAway === 0 ? 'Today' : `In ${next.daysAway} day${next.daysAway === 1 ? '' : 's'}`}</div>
                </>
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.5 }}>See the ECB meeting calendar for the next date.</div>
              )}
            </div>
            <div style={{ background: 'var(--gold-light)', padding: '28px 32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>Last Rate Change</div>
              {lastChange ? (
                <>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '48px', fontWeight: 700, color: 'var(--gold)', lineHeight: 1, marginBottom: '8px' }}>{formatBp(lastChange.changeBp)}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)' }}>Effective {formatEcbDate(lastChange.effective)} · <Link href="/macro-bridge" style={{ color: 'var(--accent)', textDecoration: 'none' }}>equity impact →</Link></div>
                </>
              ) : (
                <div style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.5 }}>No recent change on record.</div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>

            {/* Left: rate changes */}
            <div style={{ gridColumn: 'span 1' }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '20px' }}>
                Rate Change History
              </h2>
              {history.length > 0 ? (
                <div style={{ border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '10px 16px', background: 'var(--paper)', borderBottom: '1px solid var(--border)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                    <div>Effective</div>
                    <div>Change</div>
                    <div>Deposit rate</div>
                  </div>
                  {history.map((d, i) => (
                    <div
                      key={d.effective}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 16px', borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none', gap: '12px', alignItems: 'start', background: '#fff' }}
                    >
                      <div style={{ fontSize: '13px', color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{formatEcbDate(d.effective)}</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: d.changeBp > 0 ? '#dc2626' : '#16a34a' }}>{formatBp(d.changeBp)}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{d.rateAfter.toFixed(2)}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '16px 18px', background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13px', color: 'var(--ink-3)' }}>
                  Rate history is temporarily unavailable.
                </div>
              )}
              <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--ink-4)' }}>
                Source: ECB Data Portal (deposit facility rate). Dates are when each change took effect; meetings that left rates unchanged are not listed. Informational only, not investment advice.
              </div>
            </div>

            {/* Right: backdrop + calendar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

              {backdropRows.length > 0 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '16px' }}>
                    Market Backdrop
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {backdropRows.map(f => (
                      <div key={f.label} style={{ display: 'flex', gap: '12px', padding: '12px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: '3px', alignItems: 'start' }}>
                        <div style={{ flexShrink: 0, minWidth: '80px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ink-4)', letterSpacing: '0.04em', marginBottom: '2px' }}>{f.label}</div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{f.value}</div>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.55, paddingTop: '2px' }}>{f.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meeting calendar */}
              <div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '16px' }}>
                  Upcoming Rate Decisions
                </h2>
                {upcoming.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    {upcoming.map((d, i) => (
                      <div key={d} style={{ display: 'flex', gap: '16px', padding: '10px 14px', background: i === 0 ? 'var(--gold-light)' : '#fff', borderBottom: i < upcoming.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: i === 0 ? 'var(--gold)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', minWidth: '100px' }}>{formatEcbDate(d)}</div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Governing Council decision and press conference</div>
                        {i === 0 && <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 600, color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 7px', borderRadius: '2px', whiteSpace: 'nowrap' }}>NEXT</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px 18px', background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13px', color: 'var(--ink-3)' }}>
                    See the ECB monetary policy meeting calendar for upcoming dates.
                  </div>
                )}
                <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--ink-4)' }}>Source: ECB meeting calendar.</div>
              </div>

              {/* Equity implications link */}
              <div style={{ padding: '16px 20px', background: 'var(--accent-light)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', borderRadius: '3px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', marginBottom: '6px' }}>Rate rises → equity implications</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '10px', lineHeight: 1.55 }}>
                  Higher short-term rates tend to widen net interest income for banks such as ING, ABN AMRO and BNP Paribas, and weigh on rate-sensitive real estate such as Vonovia and Unibail.
                </div>
                <Link href="/macro-bridge" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
                  Open Macro–Equity Bridge →
                </Link>
              </div>
            </div>

          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: '48px', padding: '14px 18px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            General information only under Article 24 MiFID II. Not personalised investment advice.
            Source: ECB Data Portal and ECB meeting calendar. <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Full disclaimer →</Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
