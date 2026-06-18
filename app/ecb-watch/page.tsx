import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata = {
  title: 'ECB Rate Watch — Boursee',
  description: 'European Central Bank interest rate decisions, meeting calendar, and policy analysis for European investors.',
}

const CURRENT_RATE  = '2.00%'
const NEXT_MEETING  = { date: '23 July 2026', daysAway: 35, expected: '+25bp', confidence: '~70%' }

// Last 8 ECB Governing Council rate decisions + upcoming
const DECISIONS = [
  { date: '23 Jul 2026', decision: 'Expected +25bp',  rateAfter: '2.25%',  context: 'Rate path reassessed after June hold; inflation still above target', upcoming: true  },
  { date: '11 Jun 2026', decision: 'Hold',             rateAfter: '2.00%',  context: 'Paused amid lower energy prices and global demand uncertainty',       upcoming: false },
  { date: '9 Apr 2026',  decision: 'Hold',             rateAfter: '2.00%',  context: 'Pause to assess 5× cuts since Sep 2025',                upcoming: false },
  { date: '5 Mar 2026',  decision: '−25bp',            rateAfter: '2.00%',  context: 'Fifth consecutive cut; neutral rate approached',         upcoming: false },
  { date: '29 Jan 2026', decision: '−25bp',            rateAfter: '2.25%',  context: 'Cutting cycle continues as HICP cools toward target',    upcoming: false },
  { date: '11 Dec 2025', decision: '−25bp',            rateAfter: '2.50%',  context: 'Growth concerns outweigh residual inflation',            upcoming: false },
  { date: '23 Oct 2025', decision: '−25bp',            rateAfter: '2.75%',  context: 'Accelerated pace; energy deflation sets in',             upcoming: false },
  { date: '11 Sep 2025', decision: '−25bp',            rateAfter: '3.00%',  context: 'Cutting cycle begins; HICP at 2.1%, growth slowing',     upcoming: false },
  { date: '12 Jun 2025', decision: '+25bp',            rateAfter: '3.25%',  context: 'Final hike of 2024–25 tightening cycle',                 upcoming: false },
  { date: '10 Apr 2025', decision: '+25bp',            rateAfter: '3.00%',  context: 'Hike as wage growth remains elevated above 4%',          upcoming: false },
]

// Remaining 2026 meeting schedule
const SCHEDULE_2026 = [
  { date: '23 Jul 2026', note: 'Press conference · Rate decision expected' },
  { date: '10 Sep 2026', note: 'Updated staff projections' },
  { date: '22 Oct 2026', note: 'Interim meeting' },
  { date: '10 Dec 2026', note: 'Year-end projections' },
]

const WATCH_FACTORS = [
  { label: 'Eurozone HICP', value: '~2.4%', note: 'Edging toward target; core services still elevated' },
  { label: 'Wage growth', value: '~3.8%', note: 'Gradual cooling but still above levels consistent with 2% inflation' },
  { label: 'EUR/USD', value: '1.16', note: 'Firm euro provides modest disinflationary impulse on imports' },
  { label: 'Brent crude', value: '~$77', note: 'Energy prices well off peak; dampens HICP upside risk' },
  { label: 'PMI Composite', value: '51.5', note: 'Steady expansion; no recession signal to deter hike' },
]

export default function ECBWatchPage() {
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

          {/* Rate hero + next meeting */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '48px' }}>
            <div style={{ background: '#fff', padding: '28px 32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Deposit Facility Rate</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '48px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginBottom: '8px' }}>{CURRENT_RATE}</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-3)' }}>Current ECB main rate</div>
            </div>
            <div style={{ background: '#fff', padding: '28px 32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Next Meeting</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '8px' }}>{NEXT_MEETING.date}</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-3)' }}>In {NEXT_MEETING.daysAway} days</div>
            </div>
            <div style={{ background: 'var(--gold-light)', padding: '28px 32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>Expected Move</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '48px', fontWeight: 700, color: 'var(--gold)', lineHeight: 1, marginBottom: '8px' }}>{NEXT_MEETING.expected}</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-3)' }}>{NEXT_MEETING.confidence} market pricing · <Link href="/macro-bridge" style={{ color: 'var(--accent)', textDecoration: 'none' }}>equity impact →</Link></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '48px', alignItems: 'start' }}>

            {/* Left: decisions table */}
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '20px' }}>
                Rate Decision History
              </h2>
              <div style={{ border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '100px 90px 70px 1fr', padding: '10px 16px', background: 'var(--paper)', borderBottom: '1px solid var(--border)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', gap: '12px' }}>
                  <div>Date</div>
                  <div>Decision</div>
                  <div>Rate</div>
                  <div>Context</div>
                </div>
                {DECISIONS.map((d, i) => (
                  <div
                    key={d.date}
                    style={{
                      display: 'grid', gridTemplateColumns: '100px 90px 70px 1fr', padding: '12px 16px',
                      borderBottom: i < DECISIONS.length - 1 ? '1px solid var(--border)' : 'none',
                      gap: '12px', alignItems: 'start',
                      background: d.upcoming ? 'var(--gold-light)' : '#fff',
                    }}
                  >
                    <div style={{ fontSize: '13px', color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{d.date}</div>
                    <div style={{
                      fontSize: '13px', fontWeight: 600,
                      color: d.upcoming ? 'var(--gold)' : d.decision.includes('+') ? '#dc2626' : d.decision === 'Hold' ? 'var(--ink-4)' : '#16a34a',
                    }}>
                      {d.decision}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{d.rateAfter}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.5 }}>{d.context}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--ink-4)' }}>
                Source: ECB public data · Boursee Editorial · Informational only, not investment advice
              </div>
            </div>

            {/* Right: what to watch + 2026 calendar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

              {/* What to watch */}
              <div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '16px' }}>
                  What to Watch — Jul 23
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {WATCH_FACTORS.map(f => (
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

              {/* 2026 calendar */}
              <div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '16px' }}>
                  2026 Meeting Calendar
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  {SCHEDULE_2026.map((m, i) => (
                    <div key={m.date} style={{ display: 'flex', gap: '16px', padding: '10px 14px', background: i === 0 ? 'var(--gold-light)' : '#fff', borderBottom: i < SCHEDULE_2026.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: i === 0 ? 'var(--gold)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', minWidth: '90px' }}>{m.date}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>{m.note}</div>
                      {i === 0 && <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 600, color: 'var(--gold)', background: 'transparent', border: '1px solid var(--gold)', padding: '2px 7px', borderRadius: '2px', whiteSpace: 'nowrap' }}>Next</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Equity implications link */}
              <div style={{ padding: '16px 20px', background: 'var(--accent-light)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', borderRadius: '3px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', marginBottom: '6px' }}>Rate hike → equity implications</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '10px', lineHeight: 1.55 }}>
                  A +25bp hike benefits ING, ABN AMRO, BNP Paribas via NII expansion. Headwind for real estate (Vonovia, Unibail).
                </div>
                <Link href="/macro-bridge" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
                  Open Macro–Equity Bridge →
                </Link>
              </div>
            </div>

          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: '48px', padding: '14px 18px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            General information only under Article 24 MiFID II. Not personalised investment advice. ECB rate expectations are market-derived probabilities, not Boursee forecasts.
            Source: ECB public data, market pricing. <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Full disclaimer →</Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
