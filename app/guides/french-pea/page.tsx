import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'French PEA — Which ETFs Qualify? IWDA vs IMEU Explained | Boursee',
  description: 'The French PEA requires 75% EU/EEA exposure. IWDA and VWCE are not PEA-eligible. IMEU and MEUD are. Learn the rules, how to build a global portfolio inside the PEA, and when to use a CTO instead.',
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

const CheckIcon = () => (
  <span style={{ color: '#1a7a40', fontWeight: 700, fontSize: '13px' }}>✓</span>
)
const CrossIcon = () => (
  <span style={{ color: '#c0392b', fontWeight: 700, fontSize: '13px' }}>✗</span>
)

export default function FrenchPEAGuide() {
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
              <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>5 min read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px' }}>🇫🇷</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>France — PEA Tax Wrapper</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              French PEA: Which ETFs Qualify and How to Build a Global Portfolio
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              The PEA is one of Europe's most generous tax wrappers — but not every ETF qualifies. The 75% EU/EEA rule blocks IWDA and VWCE, while IMEU and MEUD are in. Here is how to navigate the rules and still get global exposure.
            </p>
          </div>
        </div>

        {/* Article body */}
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          {/* What is a PEA */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>What is the PEA?</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The <strong>Plan d'Épargne en Actions (PEA)</strong> is a French tax-advantaged account designed to encourage investment in European equities. You contribute cash, buy qualifying ETFs or shares inside the wrapper, and — provided you wait at least five years before withdrawing — your capital gains and dividends are entirely exempt from French income tax.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            Social charges (CSG/CRDS) at 17.2% still apply to gains, but you avoid the flat tax rate of 12.8% income tax (part of the 30% PFU prélèvement forfaitaire unique that applies outside the PEA). For a French taxpayer in a high marginal bracket, the PEA saves substantially more.
          </p>

          {/* PEA at a glance */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '14px' }}>PEA at a glance</div>
            <div style={{ display: 'grid', gap: '10px', fontSize: '14px', color: 'var(--ink)' }}>
              {[
                ['Contribution limit', '€150,000 per person (€225,000 for PEA-PME)'],
                ['Minimum holding', '5 years before tax-free withdrawal'],
                ['Tax on gains after 5yr', '17.2% social charges only (income tax exempt)'],
                ['Tax on gains before 5yr', '30% PFU (12.8% IR + 17.2% social charges)'],
                ['Available at', 'French banks and brokers (Fortuneo, Boursorama, BforBank, etc.)'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ fontWeight: 600, minWidth: '180px', color: 'var(--ink-4)' }}>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <SectionDivider />

          {/* The 75% rule */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>The 75% EU/EEA rule — why most world ETFs are blocked</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            To qualify for PEA investment, an ETF must hold at least <strong>75% of its assets in companies established in the EU or EEA</strong> (European Economic Area — includes EU + Norway, Iceland, Liechtenstein). Each company must be subject to corporate tax in its home country.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            This rule immediately excludes global index ETFs. VWCE and IWDA track global indices where ~65–70% of the weight is in US and other non-EU companies. CSPX tracks the S&P 500 entirely. None of these pass the 75% threshold, so none can be held inside a PEA.
          </p>

          <Callout type="warning">
            Holding a non-eligible ETF inside a PEA is a compliance breach. French brokers check eligibility at purchase and will typically block the trade. If a non-eligible security slips in (e.g., because an ETF's composition changes), it must be sold. Check eligibility with your PEA provider before buying.
          </Callout>

          <SectionDivider />

          {/* ETF eligibility table */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Which ETFs are PEA-eligible?</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '20px' }}>
            Physical ETFs tracking a European-only or EEA-heavy index are typically eligible. Synthetic UCITS ETFs using swaps can also be eligible — the eligibility test looks at the ETF's legal structure and underlying exposure declaration, not just the physical holdings.
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>ETF</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Index</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>PEA eligible?</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Why</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ticker: 'IMEU.AS', name: 'iShares MSCI Europe', index: 'MSCI Europe', eligible: true, reason: '100% Europe' },
                  { ticker: 'MEUD.PA', name: 'Amundi MSCI Europe', index: 'MSCI Europe', eligible: true, reason: '100% Europe' },
                  { ticker: 'EXW1.DE', name: 'iShares STOXX Europe 600', index: 'STOXX Europe 600', eligible: true, reason: '100% Europe' },
                  { ticker: 'IWDA.AS', name: 'iShares MSCI World', index: 'MSCI World', eligible: false, reason: '~70% non-EU (US, Japan, etc.)' },
                  { ticker: 'VWCE.DE', name: 'Vanguard FTSE All-World', index: 'FTSE All-World', eligible: false, reason: '~60% non-EU (US dominates)' },
                  { ticker: 'CSPX.AS', name: 'iShares Core S&P 500', index: 'S&P 500', eligible: false, reason: '100% US — zero EU companies' },
                  { ticker: 'VUSA.AS', name: 'Vanguard S&P 500', index: 'S&P 500', eligible: false, reason: '100% US — zero EU companies' },
                  { ticker: 'EIMI.AS', name: 'iShares Core MSCI EM', index: 'MSCI Emerging Markets', eligible: false, reason: 'Non-EU markets' },
                ].map((row, i) => (
                  <tr key={row.ticker} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 1 ? '#f9f9f9' : undefined }}>
                    <td style={{ padding: '11px 12px', color: 'var(--ink)', fontFamily: 'monospace', fontSize: '13px', fontWeight: 600 }}>{row.ticker}</td>
                    <td style={{ padding: '11px 12px', color: 'var(--ink)' }}>{row.name}</td>
                    <td style={{ padding: '11px 12px', textAlign: 'center' }}>
                      {row.eligible ? <CheckIcon /> : <CrossIcon />}
                    </td>
                    <td style={{ padding: '11px 12px', color: 'var(--ink-3)', fontSize: '13px' }}>{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionDivider />

          {/* Building a world portfolio inside PEA */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Building a global portfolio within PEA constraints</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The PEA's EU focus does not mean you must limit yourself to European stocks. The standard approach is to split between PEA and CTO (Compte-Titres Ordinaire):
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#f0faf4', border: '1px solid #a5d6b8', borderRadius: '4px', padding: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a7a40', marginBottom: '10px' }}>PEA (tax-sheltered)</div>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {[
                  'IMEU.AS — iShares MSCI Europe',
                  'MEUD.PA — Amundi MSCI Europe',
                  'EXW1.DE — STOXX Europe 600',
                ].map(item => (
                  <li key={item} style={{ fontSize: '13px', color: 'var(--ink)', marginBottom: '6px', lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ background: '#fff8f0', border: '1px solid #f5d6a0', borderRadius: '4px', padding: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#b85c00', marginBottom: '10px' }}>CTO (taxable account)</div>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {[
                  'IWDA.AS — MSCI World (global ex-EU)',
                  'CSPX.AS or VUSA — S&P 500',
                  'EIMI.AS — Emerging Markets',
                ].map(item => (
                  <li key={item} style={{ fontSize: '13px', color: 'var(--ink)', marginBottom: '6px', lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The logic is straightforward: put your European allocation inside the PEA where it grows tax-free, and hold global (US/EM) exposure in the CTO where the PFU applies. Over time, as your PEA grows and you exhaust the €150k limit, you deploy more into the CTO.
          </p>

          <Callout type="tip">
            Since European equities historically show higher dividend yields than US equities, concentrating Europe inside the PEA maximises the benefit of the dividend tax shelter. The compounding effect of reinvesting dividends tax-free over 15–20 years is substantial.
          </Callout>

          <SectionDivider />

          {/* Synthetic ETFs in PEA */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Can synthetic ETFs be used in a PEA?</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            Yes — this is a widely misunderstood point. Synthetic ETFs that use swaps <em>can</em> be PEA-eligible, provided the ETF provider structures them correctly. Some Amundi and Lyxor synthetic ETFs tracking the S&P 500 or MSCI World are indeed PEA-eligible, because the legal vehicle holds qualifying EU securities as collateral while the swap provides index returns.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)' }}>
            Confirming PEA eligibility for synthetic ETFs requires checking the provider's documentation (DICI / KID). Your PEA provider's eligible securities list is the authoritative source — if it is not on the list, assume it is ineligible. Physical ETFs tracking European-only indices are simpler and unambiguously eligible.
          </p>

          <SectionDivider />

          {/* Withdrawals */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Withdrawals and the 5-year clock</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The 5-year holding period starts from the date of your <em>first contribution</em> to the PEA, not from when you buy each ETF. Once five years have elapsed, you can make partial withdrawals without closing the PEA — and future contributions remain possible (up to the €150k cap net of withdrawals under current rules).
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)' }}>
            Before five years, any withdrawal closes the PEA and triggers the 30% PFU on the entire gain, subject to certain exceptions (death, disability, company liquidation). In practice, if you open a PEA and might need the money within five years, keep that money in a livret or cash account instead.
          </p>

          <Callout type="insight">
            Open your PEA as early as possible — even with €100 — to start the 5-year clock. You can add money later. The 5-year period is measured from opening, not from significant investment activity.
          </Callout>

          <SectionDivider />

          {/* Screener CTA */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Browse European ETFs on the screener</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6 }}>Filter by RSI, SFDR category, domicile, and broker availability. IMEU and MEUD are in the ETF tab.</p>
            </div>
            <Link href="/screener" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Open Screener →
            </Link>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: '40px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            This guide is for informational purposes only. Not personalised tax advice. PEA eligibility is determined by French law (CGI art. 163 quinquies D) and your provider's approved securities list. Rules can change — verify with your French broker or a qualified tax adviser (expert-comptable).
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
