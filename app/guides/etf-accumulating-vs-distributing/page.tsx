import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'Accumulating vs Distributing ETFs: Which Is Better for European Investors? | Boursee',
  description: 'Accumulating ETFs reinvest dividends; distributing ETFs pay them out. The right choice depends on your country\'s tax rules. This guide explains the trade-offs for Dutch, German, and French investors.',
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between accumulating and distributing ETFs?',
      acceptedAnswer: { '@type': 'Answer', text: 'An accumulating ETF reinvests dividends back into the fund automatically — the fund price rises to reflect the reinvested income and no cash is paid to investors. A distributing ETF pays dividends out as cash to your brokerage account. The underlying portfolio is identical; only how income is handled differs.' },
    },
    {
      '@type': 'Question',
      name: 'Are accumulating ETFs better for long-term investing?',
      acceptedAnswer: { '@type': 'Answer', text: 'For most long-term investors, accumulating ETFs are more efficient because dividends compound automatically without the drag of reinvestment fees or the risk of not reinvesting promptly. However, the tax treatment varies by country — Dutch Box 3 treats both identically, while German investors pay annual Vorabpauschale on accumulating ETFs, and French PEA rules favour distributing funds in some cases.' },
    },
    {
      '@type': 'Question',
      name: 'How do I identify if an ETF is accumulating or distributing?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most ETF names include "(Acc)" or "(Dist)" in the name or ISIN description. Alternatively, check the fund KIID or factsheet. On Boursee\'s screener, the ETF tab shows each fund\'s structure. Examples: VWCE = accumulating, VWRL = distributing (both track FTSE All-World).' },
    },
    {
      '@type': 'Question',
      name: 'Do accumulating ETFs pay dividend withholding tax?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Accumulating ETFs still receive dividends from underlying stocks and pay withholding tax at the fund level. The tax drag is the same as for distributing ETFs. The difference is that you do not receive a cash dividend taxable in your personal tax return — instead, the net (post-WHT) dividend is reinvested inside the fund.' },
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
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '4px', padding: '16px 20px', margin: '24px 0' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.labelColor, marginBottom: '6px' }}>{s.label}</div>
      <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink)' }}>{children}</div>
    </div>
  )
}

export default function AccVsDistGuide() {
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
              <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>5 min read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px' }}>🇪🇺</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Europe-wide — ETF Structure</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              Accumulating vs Distributing ETFs
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              Same index, two structures. The right choice depends on where you live and how your country taxes investment income.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>How they differ</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
            When a company in an ETF pays a dividend, the ETF receives that cash. What happens next depends on the structure:
          </p>
          <ul style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--ink)', paddingLeft: '24px', marginBottom: '24px' }}>
            <li><strong>Accumulating (Acc):</strong> The dividend is reinvested. The fund buys more shares. The ETF price rises to reflect the reinvested income. No cash arrives in your account.</li>
            <li><strong>Distributing (Dist):</strong> The dividend is paid out as cash to your brokerage account on a regular schedule (monthly, quarterly, or annually). The ETF price falls by the dividend amount on the ex-dividend date.</li>
          </ul>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)' }}>
            The underlying portfolio is identical. VWCE (accumulating) and VWRL (distributing) both track the FTSE All-World index and hold the same ~3,700 stocks. The difference is purely in how dividend income is handled.
          </p>

          <Callout type="insight">
            Over 10 years with a 2% dividend yield and no reinvestment drag, automatic compounding in an accumulating ETF adds up meaningfully compared to manually reinvesting distributions — even before tax considerations.
          </Callout>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', marginTop: '36px', letterSpacing: '-0.01em' }}>Tax treatment by country</h2>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink-4)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Country</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink-4)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Accumulating</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink-4)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Distributing</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { country: '🇳🇱 Netherlands', acc: 'Box 3 on fund value (1 Jan) — identical to distributing', dist: 'Box 3 on fund value (1 Jan) — identical to accumulating' },
                  { country: '🇩🇪 Germany', acc: 'Annual Vorabpauschale on notional return + CGT on sale', dist: 'Income tax on dividends each year + CGT on sale. If distributions > Basisertrag, no Vorabpauschale.' },
                  { country: '🇫🇷 France (CTO)', acc: 'PFU 30% on gains at sale', dist: 'PFU 30% on dividends annually + 30% on gains at sale' },
                  { country: '🇫🇷 France (PEA)', acc: 'Only distributing synthetic ETFs are PEA-eligible', dist: 'Distributing ETFs with EU/EEA exposure eligible — 17.2% after 5 years' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--paper-2)' }}>
                    <td style={{ padding: '12px', color: 'var(--ink)', fontWeight: 500 }}>{row.country}</td>
                    <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{row.acc}</td>
                    <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{row.dist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            For German investors, accumulating ETFs are not always more tax-efficient than distributing ETFs. If a distributing ETF pays dividends that exceed the Vorabpauschale Basisertrag, no annual tax is due — making it comparable to accumulating. Consult a Steuerberater for your specific situation.
          </Callout>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', marginTop: '36px', letterSpacing: '-0.01em' }}>Which to choose</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
            For most long-term European investors — particularly in the Netherlands — accumulating ETFs are the default choice. The automatic reinvestment eliminates friction and compounds more efficiently. In the Netherlands, the Box 3 treatment is identical so there is no tax reason to prefer distributing.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)' }}>
            Choose distributing if: you need regular income in retirement, you are in France and investing inside a PEA, or your broker has lower fees for distributing funds. Otherwise, accumulating is the simpler and typically more efficient structure.
          </p>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginTop: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Browse accumulating and distributing ETFs</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6 }}>Filter by structure, TER, domicile, and broker availability in the Boursee ETF screener.</p>
            </div>
            <Link href="/screener" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>Open Screener →</Link>
          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Related guides</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px' }}>
              <Link href="/guides/what-is-ucits" style={{ color: 'var(--accent)', textDecoration: 'none' }}>What is a UCITS ETF? →</Link>
              <Link href="/guides/dividend-withholding-tax" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Dividend Withholding Tax →</Link>
              <Link href="/guides/german-vorabpauschale" style={{ color: 'var(--accent)', textDecoration: 'none' }}>German Vorabpauschale →</Link>
              <Link href="/guides/french-pea" style={{ color: 'var(--accent)', textDecoration: 'none' }}>French PEA →</Link>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            For informational purposes only. Not personalised tax or investment advice. Tax rules vary by country and change over time — consult a qualified adviser for your specific situation.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
