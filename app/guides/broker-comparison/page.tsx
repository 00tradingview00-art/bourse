import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'DEGIRO vs Trade Republic vs Scalable Capital — European Broker Guide | Boursee',
  description: 'Honest comparison of DEGIRO, Trade Republic, and Scalable Capital for European ETF investors. Costs, ETF selection, tax reporting, and which broker suits which investor type.',
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is DEGIRO good for European ETF investing?',
      acceptedAnswer: { '@type': 'Answer', text: 'DEGIRO is one of the most cost-effective brokers for European ETF investors. It offers a Core Selection of commission-free ETFs (one free trade per ETF per month) and access to all major European exchanges. DEGIRO charges €1 + 0.038% for trades outside the Core Selection. It does not offer a tax-exempt wrapper like a German Depot with automatic Freistellungsauftrag processing, so German investors should confirm their tax setup.' },
    },
    {
      '@type': 'Question',
      name: 'How does Trade Republic compare to DEGIRO?',
      acceptedAnswer: { '@type': 'Answer', text: 'Trade Republic charges €1 flat per trade (stocks and ETFs) and offers a 4% interest rate on uninvested cash (subject to change). It has a simpler interface and is better for beginners and mobile-first investors. DEGIRO has broader ETF selection and exchange access. For German investors, Trade Republic handles Freistellungsauftrag and Vorabpauschale automatically, which is a significant operational advantage.' },
    },
    {
      '@type': 'Question',
      name: 'Which broker is best for Dutch investors?',
      acceptedAnswer: { '@type': 'Answer', text: 'For Dutch investors, DEGIRO (headquartered in the Netherlands, regulated by AFM) and Trade Republic are both strong choices. DEGIRO\'s Core Selection ETFs are commission-free and it offers access to Euronext Amsterdam. Neither broker provides a tax-advantaged wrapper (the Netherlands has no equivalent to the German Depot or French PEA). Box 3 tax applies to all holdings regardless of broker.' },
    },
  ],
}

function Callout({ type, children }: { type: 'insight' | 'warning' | 'tip'; children: React.ReactNode }) {
  const styles = {
    insight: { bg: '#f0f7ff', border: '#bcd6f5', label: 'Key insight', labelColor: '#1a6bc4' },
    warning: { bg: '#fff8f0', border: '#f5d6a0', label: 'Important', labelColor: '#b85c00' },
    tip:     { bg: '#f0faf4', border: '#a5d6b8', label: 'Practical tip', labelColor: '#1a7a40' },
  }
  const s = styles[type]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '4px', padding: '16px 20px', margin: '28px 0' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.labelColor, marginBottom: '6px' }}>{s.label}</div>
      <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink)' }}>{children}</div>
    </div>
  )
}

function Divider() { return <div style={{ borderTop: '1px solid var(--border)', margin: '48px 0' }} /> }

const COMPARISON = [
  { feature: 'ETF commission', degiro: 'Free (core selection)', tr: 'Free (savings plans)', scalable: 'Free (Prime+ plan)' },
  { feature: 'Stock trading', degiro: '€1 + 0.10% (AEX, Xetra)', tr: '€1 flat', scalable: 'Free (Prime+) / €0.99' },
  { feature: 'Savings plans (Sparplan)', degiro: '✗ Not available', tr: '✓ From €1/month', scalable: '✓ From €1/month' },
  { feature: 'ETF universe', degiro: '5,000+ UCITS ETFs', tr: '2,500+ ETFs', scalable: '2,000+ ETFs' },
  { feature: 'Account types', degiro: 'Basic, Custody', tr: 'Standard, Savings', scalable: 'Free, Prime+' },
  { feature: 'Custody model', degiro: 'Securities lending', tr: 'No lending', scalable: 'No lending' },
  { feature: 'Deposit insurance', degiro: '€20,000 (BaFin / BdE)', tr: '€100,000 (BaFin)', scalable: '€100,000 (BaFin)' },
  { feature: 'Tax reporting (DE)', degiro: 'Manual (annual report)', tr: 'Automatic (German Freistellungsauftrag)', scalable: 'Automatic' },
  { feature: 'Tax reporting (NL)', degiro: 'Annual report provided', tr: 'No NL-specific tools', scalable: 'No NL-specific tools' },
  { feature: 'Fractional shares', degiro: '✗ No', tr: '✓ Yes', scalable: '✓ Yes (savings plans)' },
  { feature: 'Mobile app quality', degiro: 'Functional', tr: 'Excellent', scalable: 'Good' },
  { feature: 'Regulated in', degiro: 'Netherlands (AFM)', tr: 'Germany (BaFin)', scalable: 'Germany (BaFin)' },
]

const VERDICTS = [
  {
    broker: 'DEGIRO',
    flag: '🇳🇱',
    tagline: 'Best for: active investors, Netherlands residents, large ETF universe',
    pros: ['Largest ETF selection in Europe', 'Strong for Dutch investors — AFM regulated, NL tax reports', 'Low-cost stock trading on European exchanges', 'Custody account option (no securities lending)'],
    cons: ['No savings plan / Sparplan feature', 'Tax reporting requires manual work for most non-DE investors', 'Securities lending in Basic account (opt-out with Custody)'],
    bottomLine: 'The go-to for Dutch investors and anyone who wants the widest ETF selection with low commissions. Less convenient for automated monthly investing.',
  },
  {
    broker: 'Trade Republic',
    flag: '🇩🇪',
    tagline: 'Best for: German investors, beginners, automated monthly DCA',
    pros: ['Excellent savings plan feature — automate monthly ETF investments', 'Clean, simple mobile app', 'Automatic tax reporting for German investors (Freistellungsauftrag)', '4% interest on uninvested cash', 'No securities lending'],
    cons: ['More limited ETF universe vs DEGIRO', 'Less suitable for non-German tax residents (no NL/FR-specific reporting)', 'No desktop trading platform'],
    bottomLine: 'The best choice for automated long-term DCA investing in Germany. The 4% cash interest is a genuine bonus. Less suitable if you live outside Germany and need local tax reporting.',
  },
  {
    broker: 'Scalable Capital',
    flag: '🇩🇪',
    tagline: 'Best for: German investors wanting everything in one place',
    pros: ['Savings plans + direct trading + robo-advisor in one platform', 'Automatic German tax reporting', 'No securities lending', 'Prime+ plan includes free trading'],
    cons: ['Prime+ costs €4.99/month — adds up for small portfolios', 'ETF universe smaller than DEGIRO', 'Less established than DEGIRO or Trade Republic'],
    bottomLine: 'A solid all-in-one for German investors who want savings plans, robo-advisory, and active trading in one app. The monthly fee makes less sense for very small portfolios.',
  },
]

export default function BrokerComparisonGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Link href="/guides" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>← All guides</Link>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>7 min read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px' }}>🏦</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Europe — Brokers</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              DEGIRO vs Trade Republic vs Scalable Capital
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              Three of Europe's largest retail brokers, all offering free or near-free ETF investing. Here is how they actually differ — and which makes sense for your situation.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '-0.01em' }}>At a glance</h2>

          <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--paper-2)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Feature</th>
                  {['DEGIRO 🇳🇱', 'Trade Republic 🇩🇪', 'Scalable 🇩🇪'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--paper)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--ink)', fontSize: '13px' }}>{row.feature}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', color: 'var(--ink-3)' }}>{row.degiro}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', color: 'var(--ink-3)' }}>{row.tr}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: '12px', color: 'var(--ink-3)' }}>{row.scalable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="insight">
            All three brokers offer commission-free ETF investing. The real differences are: which ETFs they carry, how they handle tax reporting in your country, whether they support automated savings plans, and their securities lending practices.
          </Callout>

          <Divider />

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '28px', letterSpacing: '-0.01em' }}>Broker verdicts</h2>

          {VERDICTS.map((v, i) => (
            <div key={v.broker} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px' }}>{v.flag}</span>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{v.broker}</h3>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', marginBottom: '16px' }}>{v.tagline}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16a34a', marginBottom: '8px' }}>Strengths</div>
                  {v.pros.map(p => (
                    <div key={p} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--ink-3)' }}>
                      <span style={{ color: '#16a34a', flexShrink: 0 }}>✓</span> {p}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: '8px' }}>Limitations</div>
                  {v.cons.map(c => (
                    <div key={c} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--ink-3)' }}>
                      <span style={{ color: '#dc2626', flexShrink: 0 }}>✗</span> {c}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'var(--paper-2)', borderRadius: '3px', padding: '12px 16px', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>
                <strong>Bottom line:</strong> {v.bottomLine}
              </div>
            </div>
          ))}

          <Divider />

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Securities lending — what it means</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            DEGIRO's Basic account uses securities lending — your ETF holdings can be temporarily lent to other parties (typically hedge funds for short selling). DEGIRO keeps 50% of the fee earned; you keep 50%. The risk is counterparty default, though this is mitigated by collateral.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)' }}>
            DEGIRO's Custody account opts out of securities lending entirely. Trade Republic and Scalable Capital do not lend securities. For long-term buy-and-hold ETF investors who prioritise simplicity, the Custody account or either German broker avoids the question entirely.
          </p>

          <Callout type="tip">
            If you use DEGIRO and haven't checked your account type, log in to Settings → Account Type. Basic accounts participate in securities lending by default. Switching to Custody removes that feature and is free.
          </Callout>

          <Divider />

          {/* CTA */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Browse UCITS ETFs available on these brokers</div>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)', margin: 0 }}>Filter by DEGIRO or Trade Republic badge in the ETF screener</p>
            </div>
            <Link href="/screener" style={{ background: 'var(--ink)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Open ETF Screener →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px', fontSize: '13px' }}>
            <Link href="/guides/dividend-withholding-tax" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Dividend Withholding Tax →</Link>
            <Link href="/guides/dutch-box-3" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Dutch Box 3 →</Link>
            <Link href="/calculators" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Tax Calculators →</Link>
          </div>

          <div style={{ padding: '14px 18px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
            For general educational purposes only. Not investment advice under MiFID II Article 24. Broker features, fees, and availability change. Verify current terms directly with each broker before opening an account.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
