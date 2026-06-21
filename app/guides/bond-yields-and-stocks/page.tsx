import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'Bond Yields and European Stocks: How They Are Connected | Boursee',
  description: 'Why rising government bond yields hurt growth stocks and help banks. The BTP-Bund spread, German 10-year Bund yield, and how European bond markets signal macro stress.',
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why do rising bond yields hurt stock prices?',
      acceptedAnswer: { '@type': 'Answer', text: 'Bond yields act as the discount rate in stock valuation models. Higher yields mean future corporate earnings are worth less today — because a risk-free bond now offers a higher competing return. This reduces the present value of all future cash flows, lowering fair stock valuations. Growth stocks (with earnings far in the future) are hit hardest; value stocks and dividend payers with near-term earnings are more resilient.' },
    },
    {
      '@type': 'Question',
      name: 'What is the BTP-Bund spread and why does it matter?',
      acceptedAnswer: { '@type': 'Answer', text: 'The BTP-Bund spread is the difference in yield between Italian government bonds (BTPs) and German Bunds of the same maturity (usually 10-year). It measures Italian sovereign credit risk relative to Germany. A widening spread signals stress in Italian finances or reduced investor confidence in eurozone cohesion — historically a precursor to broader European market selloffs. The spread widened sharply during the 2011-12 eurozone debt crisis.' },
    },
    {
      '@type': 'Question',
      name: 'What does the German 10-year Bund yield indicate?',
      acceptedAnswer: { '@type': 'Answer', text: 'The German 10-year Bund yield is the eurozone risk-free rate benchmark — the equivalent of the US 10-year Treasury for European markets. It reflects ECB rate expectations, eurozone inflation outlook, and global safe-haven demand. A rising Bund yield typically signals higher ECB rate expectations or improving growth outlook; a falling yield signals rate cut expectations or a flight to safety.' },
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

export default function BondYieldsGuide() {
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
              <span style={{ fontSize: '26px' }}>📉</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Eurozone — Fixed Income & Equities</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              Bond Yields and European Stocks
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              The Bund yield, the BTP-Bund spread, and the equity risk premium — why fixed income is the most important signal European equity investors often ignore.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Why bond yields matter for stocks</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
            The value of any stock is the sum of its future earnings, discounted to today. The discount rate used in that calculation is tied to the risk-free rate — which in Europe is approximated by the German 10-year Bund yield.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
            When Bund yields rise, the discount rate rises. The present value of future earnings falls. Stock valuations compress — even if the underlying business has not changed at all. This is why equity markets often sell off immediately when bond yields spike, before any economic damage has materialised.
          </p>
          <Callout type="insight">
            A 100bp rise in the 10-year yield (say, from 2.0% to 3.0%) can reduce a growth stock&apos;s fair value by 15-25% purely from the discount rate effect — with no change to earnings forecasts.
          </Callout>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', marginTop: '36px', letterSpacing: '-0.01em' }}>Which stocks are most sensitive to yields</h2>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink-4)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sector</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink-4)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Yields rise</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink-4)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Yields fall</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { s: 'Growth / Tech (ASML, SAP)', up: 'De-rate sharply — distant earnings hurt most', dn: 'Re-rate higher — highest sensitivity' },
                  { s: 'Real Estate / REITs', up: 'Debt costs rise, valuations compress — bearish', dn: 'Financing costs fall, valuations expand — bullish' },
                  { s: 'Utilities (Enel, Iberdrola)', up: 'Yield-like; bonds compete for income investors', dn: 'Attractive vs bonds; stable cash flows valued highly' },
                  { s: 'Banks (ING, Santander, BNP)', up: 'Net interest margins expand — bullish', dn: 'Margins compress — bearish' },
                  { s: 'Cyclicals / Industrials (Siemens, Airbus)', up: 'Moderate — near-term earnings buffer the hit', dn: 'Benefit from cheaper investment financing' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--paper-2)' }}>
                    <td style={{ padding: '12px', color: 'var(--ink)', fontWeight: 500 }}>{row.s}</td>
                    <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{row.up}</td>
                    <td style={{ padding: '12px', color: 'var(--ink-3)' }}>{row.dn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', marginTop: '36px', letterSpacing: '-0.01em' }}>The BTP-Bund spread: eurozone stress indicator</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
            The spread between Italian 10-year BTP yields and German 10-year Bund yields is the single best real-time measure of eurozone fragmentation risk. When the spread widens sharply (say, from 120bp to 200bp+), it signals that bond markets are pricing a higher risk of Italian sovereign stress — which historically has triggered broad European equity selloffs.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)' }}>
            During the 2011-12 eurozone crisis, the BTP-Bund spread reached 550bp, triggering the "whatever it takes" intervention from ECB President Draghi. Italian bank stocks (which hold large BTP positions) are particularly sensitive to spread movements.
          </p>
          <Callout type="tip">
            Track the BTP-Bund spread alongside European government bond yields on Boursee Bonds. A sudden widening of 30-50bp in a single session is a significant risk signal for Italian financials.
          </Callout>

          <div style={{ marginTop: '32px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>European bond yields — live tracker</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6 }}>Bund, OAT, BTP, Gilt, Bonos — current yields and the BTP-Bund spread tracked daily.</p>
            </div>
            <Link href="/bonds" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>Open Bonds →</Link>
          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Related guides</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px' }}>
              <Link href="/guides/ecb-interest-rates-explained" style={{ color: 'var(--accent)', textDecoration: 'none' }}>ECB Interest Rates →</Link>
              <Link href="/guides/european-indices-explained" style={{ color: 'var(--accent)', textDecoration: 'none' }}>European Indices Explained →</Link>
              <Link href="/macro-bridge" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Macro–Equity Bridge →</Link>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            For informational purposes only. Not investment advice under MiFID II Article 24. Bond markets are affected by many factors beyond ECB policy. Past yield movements are not indicative of future behaviour.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
