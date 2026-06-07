import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'Dutch Box 3 Wealth Tax Explained for ETF Investors | Boursee',
  description: 'How the Dutch Box 3 wealth tax works in 2025–2026, what it means for your ETF portfolio, why accumulating and distributing ETFs are taxed identically, and what changes in 2028.',
}

function Callout({ type, children }: { type: 'insight' | 'warning' | 'tip'; children: React.ReactNode }) {
  const styles = {
    insight: { bg: '#f0f7ff', border: '#bcd6f5', label: 'Key insight', labelColor: '#1a6bc4' },
    warning: { bg: '#fff8f0', border: '#f5d6a0', label: 'Important', labelColor: '#b85c00' },
    tip: { bg: '#f0faf4', border: '#a5d6b8', label: 'Practical tip', labelColor: '#1a7a40' },
  }
  const s = styles[type]
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '4px', padding: '16px 20px', margin: '28px 0' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.labelColor, marginBottom: '6px' }}>{s.label}</div>
      <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink)' }}>{children}</div>
    </div>
  )
}

function SectionDivider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '48px 0' }} />
}

export default function DutchBox3Guide() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Link href="/guides" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>← All guides</Link>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>6 min read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px' }}>🇳🇱</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Netherlands — Box 3</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              Dutch Box 3 Explained for ETF Investors
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              The Netherlands taxes investment wealth on a notional return basis — not on what you actually earn. Here is what that means in practice, how accumulating ETFs are treated, and what changes under the 2028 reform.
            </p>
          </div>
        </div>

        {/* Article body */}
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          {/* What is Box 3 */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>What is Box 3?</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The Dutch income tax system has three "boxes". Box 1 is employment and business income (progressive rates). Box 2 is substantial shareholdings. Box 3 is savings and investments held by private individuals.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            Box 3 does not tax what you actually earned on your investments. Instead, it applies a fixed deemed return rate to your net wealth (assets minus debts) as it stands on January 1 of each tax year. You pay 36% tax on that notional return — regardless of whether your portfolio went up, down, or sideways.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)' }}>
            The tax is assessed annually when you file your income tax return (aangifte inkomstenbelasting), typically in the spring for the prior calendar year.
          </p>

          <SectionDivider />

          {/* How it is calculated */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>How it is calculated in 2025</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '20px' }}>
            For 2025, the Dutch tax authority (Belastingdienst) applies three separate notional return rates depending on asset category:
          </p>

          {/* Table */}
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Asset category</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Deemed return 2025</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Includes</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', color: 'var(--ink)' }}>Bank savings</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--ink)', fontFamily: 'monospace' }}>1.03%</td>
                  <td style={{ padding: '12px', color: 'var(--ink-3)' }}>Current accounts, savings accounts</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)', background: '#f9f9f9' }}>
                  <td style={{ padding: '12px', color: 'var(--ink)', fontWeight: 600 }}>Investments</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--ink)', fontFamily: 'monospace', fontWeight: 600 }}>5.88%</td>
                  <td style={{ padding: '12px', color: 'var(--ink-3)' }}>ETFs, shares, crypto, bonds, P2P lending</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', color: 'var(--ink)' }}>Property (non-principal)</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--ink)', fontFamily: 'monospace' }}>2.47%</td>
                  <td style={{ padding: '12px', color: 'var(--ink-3)' }}>Investment properties, holiday homes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '20px' }}>
            The <strong>tax-free threshold (heffingvrij vermogen)</strong> is €57,684 per person for 2025 (indexed annually). Below this amount, no Box 3 tax applies. Fiscal partners each get their own threshold, so a couple has €115,368 combined before any Box 3 tax is owed.
          </p>

          {/* Example */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '14px' }}>Worked example — single investor, 2025</div>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: 'var(--ink)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Portfolio value (ETFs) on 1 Jan 2025</span>
                <span style={{ fontFamily: 'monospace' }}>€120,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax-free threshold</span>
                <span style={{ fontFamily: 'monospace' }}>− €57,684</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '8px', fontWeight: 600 }}>
                <span>Taxable box 3 capital</span>
                <span style={{ fontFamily: 'monospace' }}>€62,316</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>Deemed return (investments rate × taxable capital)</span>
                <span style={{ fontFamily: 'monospace' }}>€62,316 × 5.88% = €3,664</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '8px', fontWeight: 700, color: 'var(--accent)' }}>
                <span>Box 3 tax (36% × deemed return)</span>
                <span style={{ fontFamily: 'monospace' }}>€3,664 × 36% ≈ €1,319</span>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '12px', lineHeight: 1.5 }}>
              This tax is owed even if your €120,000 portfolio returned −10% that year.
            </p>
          </div>

          <Callout type="warning">
            The 5.88% deemed return rate is significantly above what a savings account pays. For investors holding most of their wealth in cash, the effective tax burden is disproportionate — which is why the Dutch Supreme Court struck down the prior regime (see below).
          </Callout>

          <SectionDivider />

          {/* Acc vs Dist */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Accumulating vs distributing ETFs — no difference under Box 3</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            This is a common point of confusion. Under Box 3, it makes no tax difference whether you hold an accumulating ETF (VWCE, IWDA) or a distributing ETF (VWRL). Both are taxed on the <em>total portfolio value</em> as it stands on 1 January — not on dividends received or capital gains realised.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            An accumulating ETF reinvests dividends internally, increasing its NAV. A distributing ETF pays dividends in cash, leaving NAV lower but putting cash in your account. Either way, your total net wealth on 1 January is approximately the same — and Box 3 taxes that wealth identically.
          </p>

          <Callout type="insight">
            Choose between accumulating and distributing ETFs based on your <em>spending needs</em>, not tax. For Dutch investors in the accumulation phase, accumulating ETFs are simpler (no reinvestment hassle). For those drawing income, distributing works fine. The tax outcome is the same.
          </Callout>

          <SectionDivider />

          {/* The legal situation */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>The legal situation: Supreme Court rulings</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            In December 2021 (the "Kerstarrest"), the Dutch Supreme Court ruled that the old Box 3 system — which assumed everyone earned 5.69% regardless of actual returns — violated European human rights law (the right to peaceful enjoyment of property). The system was held to cause unlawful overtaxation for investors who earned less than the deemed rate.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The government introduced a temporary fix (the "Herstelheffing" patch) splitting assets into the three categories shown above, with lower rates for savings. In June 2024, the Supreme Court ruled again, confirming that the patched system remains lawful as a transitional measure but ordered that taxpayers who can demonstrate actual lower returns may apply for a correction.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)' }}>
            In practice, the Belastingdienst is introducing a new form — the <strong>Opgaaf Werkelijk Rendement (OWR)</strong> — that allows investors to report actual returns instead of notional ones. If your actual return was lower than the 5.88% deemed rate, you can opt for actual return taxation. This is voluntary for tax years up to 2027.
          </p>

          <Callout type="tip">
            If your ETF portfolio declined or returned less than ~5.88% in a given year, it may be worth consulting a tax adviser about filing an OWR. The complexity is significant and the rules around what counts as "actual return" (including unrealised gains) are not yet fully settled.
          </Callout>

          <SectionDivider />

          {/* 2028 reform */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>The 2028 reform: actual return taxation</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            From 2028, the Netherlands plans to shift Box 3 to a full actual-return system — taxing the genuine return on each asset. Under the current proposal, this will include:
          </p>
          <ul style={{ paddingLeft: '24px', marginBottom: '20px' }}>
            {[
              'Dividends and interest received',
              'Capital gains realised when you sell',
              'For accumulating ETFs: the annual increase in NAV (unrealised gains taxed annually)',
            ].map((item, i) => (
              <li key={i} style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '8px' }}>{item}</li>
            ))}
          </ul>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The last point matters most for ETF investors. Under the 2028 design, accumulating ETFs would be taxed on unrealised gains each year — making them no longer equivalent to distributing ETFs from a tax perspective. A distributing ETF would distribute cash (taxed as income), but unrealised NAV growth would not be taxed until realised. The final legislation had not been passed as of mid-2026 and the design details are still being debated in parliament.
          </p>

          <Callout type="warning">
            The 2028 actual-return system is not yet law. The proposal has been revised multiple times. Monitor updates from the Belastingdienst or a Dutch tax specialist before making portfolio decisions based on 2028 expectations.
          </Callout>

          <SectionDivider />

          {/* Expats: 30% ruling */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>30% ruling and Box 3</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            Employees using the 30% ruling have the option to elect <strong>partial non-residency</strong> for Box 2 and Box 3 purposes. If this election is made, Box 3 applies only to Dutch-situated assets (real estate in the Netherlands, substantial shareholdings in Dutch companies). Foreign-held ETF portfolios — VWCE on Xetra, IWDA on Euronext — are then excluded from Box 3 entirely.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)' }}>
            This election is made annually on your tax return. If you are under the 30% ruling and hold significant foreign investments, confirm the election is active — it is not automatic. Note that the 30% ruling has been restricted in recent years (maximum ruling period reduced from 8 to 5 years) and further changes are possible.
          </p>

          <SectionDivider />

          {/* ETF screener CTA */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Find European ETFs on the screener</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6 }}>Browse UCITS ETFs with quality scores, TER, domicile, and broker availability for DEGIRO and Trade Republic.</p>
            </div>
            <Link href="/screener" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Open Screener →
            </Link>
          </div>

          {/* Calculator CTA */}
          <div style={{ marginTop: '32px', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: '6px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>
                Try the Box 3 calculator
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)', margin: 0 }}>Enter your savings, investments, and property to get an instant estimate of your 2025 Box 3 liability.</p>
            </div>
            <Link href="/calculators/dutch-box-3" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Open calculator →
            </Link>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            This guide is for informational purposes only. Not personalised tax advice. Tax rules and rates change — verify current figures with the Belastingdienst or a qualified Dutch tax adviser. Rates shown are for 2025 tax year.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
