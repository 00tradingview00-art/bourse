import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'ECB Interest Rates Explained: How They Move European Stocks | Boursee',
  description: 'The ECB sets three key rates that flow through to European stock valuations, bank margins, bond yields, and currency. Learn how ECB decisions affect AEX, DAX, and CAC 40 stocks.',
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the ECB key interest rates?',
      acceptedAnswer: { '@type': 'Answer', text: 'The European Central Bank sets three key rates: the deposit facility rate (DFR), the main refinancing operations rate (MRO), and the marginal lending facility rate (MLF). The deposit facility rate is the most market-relevant — it is the rate banks receive for overnight deposits with the ECB, and it anchors short-term interest rates across the eurozone.' },
    },
    {
      '@type': 'Question',
      name: 'How do ECB rate cuts affect European stocks?',
      acceptedAnswer: { '@type': 'Answer', text: 'ECB rate cuts typically support stock valuations through multiple channels: lower discount rates increase the present value of future earnings (boosting P/E multiples), cheaper borrowing costs support corporate investment and consumer spending, and falling bond yields make equities relatively more attractive. Rate-sensitive sectors — real estate, utilities, and growth stocks — tend to benefit most from rate cuts.' },
    },
    {
      '@type': 'Question',
      name: 'Which European stocks are most affected by ECB rate decisions?',
      acceptedAnswer: { '@type': 'Answer', text: 'Banks (ING, BNP Paribas, Santander) are directly affected — higher rates expand net interest margins but slow lending. Real estate investment trusts (REITs) and utilities suffer when rates rise because their valuations rely on discounted cash flows and their debt costs increase. Growth stocks and tech companies are also sensitive because higher rates reduce the present value of distant future earnings.' },
    },
    {
      '@type': 'Question',
      name: 'When does the ECB meet to set interest rates?',
      acceptedAnswer: { '@type': 'Answer', text: 'The ECB Governing Council meets eight times per year to set monetary policy. Four of these meetings include an updated economic forecast (the "projection meetings"). Rate decisions are announced at 14:15 CET, followed by a press conference at 14:45 CET where the ECB President explains the decision. Dates are published annually on the ECB website.' },
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

export default function ECBGuide() {
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
              <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>6 min read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px' }}>🏦</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Eurozone — Monetary Policy</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              ECB Interest Rates Explained
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              The ECB sets the cost of money for the eurozone. Understanding how rate decisions flow into stock valuations, bank margins, and bond yields is the foundation of European macro investing.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>The three ECB rates</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
            The European Central Bank operates three policy rates. The one that moves markets is the <strong>deposit facility rate (DFR)</strong> — the rate banks earn on overnight deposits parked at the ECB.
          </p>
          <ul style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--ink)', paddingLeft: '24px', marginBottom: '24px' }}>
            <li><strong>Deposit Facility Rate (DFR):</strong> What banks earn for depositing excess reserves with the ECB overnight. This anchors short-term market rates and is the primary monetary policy lever.</li>
            <li><strong>Main Refinancing Operations Rate (MRO):</strong> The rate at which commercial banks can borrow weekly from the ECB. Sets the cost of regular liquidity operations.</li>
            <li><strong>Marginal Lending Facility Rate (MLF):</strong> Overnight borrowing rate for banks needing emergency ECB liquidity. Typically 25bp above MRO.</li>
          </ul>

          <Callout type="insight">
            When analysts say "the ECB cut rates by 25bp", they usually mean the deposit facility rate moved from, say, 3.50% to 3.25%. This single rate ripples through every euro-denominated financial market within hours.
          </Callout>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', marginTop: '36px', letterSpacing: '-0.01em' }}>How rate changes reach the stock market</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
            The transmission from ECB policy to stock prices runs through four main channels:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {[
              { n: '01', title: 'Discount rate effect', body: 'Lower rates reduce the discount rate used in DCF models, increasing the present value of future cash flows. Every stock\'s fair value formula contains a discount rate — when it falls, fair values rise. This disproportionately benefits long-duration assets (growth stocks, REITs) where cash flows are further in the future.' },
              { n: '02', title: 'Credit and borrowing cost', body: 'Businesses borrow more cheaply when rates fall. This supports investment, margins, and earnings growth — particularly for capital-intensive industries (infrastructure, manufacturing, real estate).' },
              { n: '03', title: 'Bond yield competition', body: 'When ECB rates fall, bond yields fall too. Dividend-paying stocks become relatively more attractive versus bonds (the "equity risk premium" widens). Utility and infrastructure stocks, which trade on yield, benefit directly.' },
              { n: '04', title: 'EUR/USD and exports', body: 'Lower rates tend to weaken the euro. A weaker EUR boosts the translated earnings of DAX exporters (BASF, Volkswagen, Siemens) and other European multinationals with significant USD-denominated revenue.' },
            ].map(item => (
              <div key={item.n} style={{ display: 'flex', gap: '16px', padding: '20px', border: '1px solid var(--border)', borderRadius: '4px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: 'var(--accent)', opacity: 0.5, flexShrink: 0, lineHeight: 1 }}>{item.n}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>{item.title}</div>
                  <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-3)' }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', marginTop: '36px', letterSpacing: '-0.01em' }}>Which sectors move most</h2>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink-4)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sector</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink-4)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Rate cuts</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink-4)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Rate hikes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { sector: 'Banks (ING, BNP, Santander)', cuts: 'Net interest margins compress — bearish', hikes: 'Margins expand — bullish' },
                  { sector: 'Real estate / REITs', cuts: 'Valuations re-rate higher, debt cheaper — bullish', hikes: 'Discount rates rise, debt costs up — bearish' },
                  { sector: 'Utilities (Enel, Iberdrola, RWE)', cuts: 'Yield-like stocks re-rate higher — bullish', hikes: 'Bond alternatives look better, de-rating — bearish' },
                  { sector: 'Exporters (ASML, Volkswagen, LVMH)', cuts: 'EUR weakens, exported earnings boost — bullish', hikes: 'EUR strengthens, headwind to USD revenues' },
                  { sector: 'Consumer discretionary', cuts: 'Cheaper credit boosts consumer spending', hikes: 'Higher mortgage/loan costs squeeze disposable income' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--paper-2)' }}>
                    <td style={{ padding: '12px', color: 'var(--ink)', fontWeight: 500 }}>{row.sector}</td>
                    <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{row.cuts}</td>
                    <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{row.hikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="tip">
            Track the ECB meeting calendar and current rate level on Boursee ECB Watch. Rate expectations priced into futures markets often matter more than the actual decision — "buy the rumour, sell the news" applies strongly to ECB events.
          </Callout>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', marginTop: '36px', letterSpacing: '-0.01em' }}>ECB meeting schedule</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)' }}>
            The ECB Governing Council meets eight times per year. Rate decisions are announced at 14:15 CET. The press conference begins at 14:45 CET — this is where the ECB President provides forward guidance that often moves markets more than the rate decision itself. Track the full calendar and rate history on ECB Watch.
          </p>

          <div style={{ marginTop: '32px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>ECB Watch — rates, calendar, and history</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6 }}>Current ECB rate, next meeting date, and historical rate path since 2022.</p>
            </div>
            <Link href="/ecb-watch" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>Open ECB Watch →</Link>
          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Related guides</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px' }}>
              <Link href="/guides/bond-yields-and-stocks" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Bond Yields and European Stocks →</Link>
              <Link href="/guides/european-indices-explained" style={{ color: 'var(--accent)', textDecoration: 'none' }}>AEX, DAX, CAC 40 Explained →</Link>
              <Link href="/macro-bridge" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Macro–Equity Bridge →</Link>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            For informational purposes only. Not investment advice under MiFID II Article 24. ECB policy decisions are based on evolving economic conditions and can change rapidly. Past rate cycles are not indicative of future policy paths.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
