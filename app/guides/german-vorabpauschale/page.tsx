import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'German Vorabpauschale 2026 — ETF Pre-Tax Explained | Boursee',
  description: 'The German Vorabpauschale for 2026 uses a base rate of 3.20%. Learn how the annual pre-tax on accumulating ETFs is calculated, how much you actually owe, and how to use your Freistellungsauftrag.',
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

export default function GermanVorabpauschaleGuide() {
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
              <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>7 min read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px' }}>🇩🇪</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Germany — ETF Taxation</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              German Vorabpauschale 2026: The Annual Pre-Tax on ETFs
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              Germany's Vorabpauschale is a deemed annual distribution applied to accumulating ETFs. For 2026, the base rate is 3.20%. Here is the exact calculation, the tax you actually pay, and how to use your Freistellungsauftrag to offset it.
            </p>
          </div>
        </div>

        {/* Article body */}
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          {/* Why it exists */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Why the Vorabpauschale exists</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            Before 2018, German investors in accumulating ETFs paid no annual tax — gains compounded tax-free until they sold. Distributing ETFs, by contrast, were taxed on dividends every year. This created a structural advantage for accumulating ETFs that parliament decided was unfair.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The Vorabpauschale (literally "advance lump sum") was introduced in the Investment Tax Reform of 2018 to level the playing field. It is a <em>deemed annual distribution</em> — a notional amount of income that the German tax authority treats as having been earned by an accumulating fund, even though no cash was paid out.
          </p>

          <Callout type="insight">
            The Vorabpauschale does not eliminate the tax advantage of accumulating ETFs — it just partially reduces it. Accumulating ETFs in Germany still benefit from <strong>tax deferral</strong> because the Vorabpauschale is credited against your eventual gain when you sell. You don't pay twice; you pay some now, less later.
          </Callout>

          <SectionDivider />

          {/* How it is calculated */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>How the 2026 Vorabpauschale is calculated</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '20px' }}>
            The calculation has three steps. The German Ministry of Finance (BMF) publishes the base rate (Basiszins) each January for the prior year. For 2026, the base rate is <strong>3.20%</strong> (compared to 2.53% for 2025).
          </p>

          {/* Formula box */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '14px' }}>The formula</div>
            <div style={{ display: 'grid', gap: '10px', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }}>
              <div>
                <span style={{ fontWeight: 600 }}>Step 1 — Basisertrag (base return):</span>
                <span style={{ fontFamily: 'monospace', background: 'var(--paper-2)', padding: '2px 8px', borderRadius: '2px', marginLeft: '8px' }}>
                  Fund value (1 Jan) × base rate × 0.7
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Step 2 — Cap check:</span>{' '}
                Vorabpauschale = min(Basisertrag, actual price increase during the year). If the fund falls in value, Vorabpauschale = €0.
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Step 3 — Teilfreistellung (partial exemption):</span>{' '}
                For equity ETFs, 30% of the Vorabpauschale is exempt. So taxable Vorabpauschale = Vorabpauschale × 70%.
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Step 4 — Tax:</span>{' '}
                Taxable Vorabpauschale × 26.375% (Abgeltungsteuer 25% + 5.5% Solidaritätszuschlag).
              </div>
            </div>
          </div>

          {/* Example */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '14px' }}>Worked example — €10,000 in VWCE, 2026</div>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: 'var(--ink)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>VWCE value on 1 Jan 2026</span>
                <span style={{ fontFamily: 'monospace' }}>€10,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Base rate (BMF 2026)</span>
                <span style={{ fontFamily: 'monospace' }}>3.20%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Basisertrag (€10,000 × 3.20% × 0.7)</span>
                <span style={{ fontFamily: 'monospace' }}>€224</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-4)', fontSize: '13px' }}>
                <span>Cap check: VWCE rose ~15% in 2026, so not capped</span>
                <span style={{ fontFamily: 'monospace' }}>€224</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>After 30% Teilfreistellung (equity ETF)</span>
                <span style={{ fontFamily: 'monospace' }}>€224 × 70% = €156.80</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '8px', fontWeight: 700, color: 'var(--accent)' }}>
                <span>Tax owed (€156.80 × 26.375%)</span>
                <span style={{ fontFamily: 'monospace' }}>≈ €41.35</span>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--ink-4)', marginTop: '12px', lineHeight: 1.5 }}>
              Church members (Kirchensteuer 8–9%) owe slightly more. Without Freistellungsauftrag already used up, this €41.35 is offset automatically. Scale linearly: €100,000 position ≈ €413.50 tax.
            </p>
          </div>

          <SectionDivider />

          {/* Freistellungsauftrag */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>The Freistellungsauftrag: your €1,000 exemption</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            Every German taxpayer can exempt up to <strong>€1,000 per year</strong> in investment income from tax (€2,000 for married couples filing jointly). This is the Freistellungsauftrag (FSA) — a standing order filed with your broker that instructs them to hold back the flat tax until this exemption is used up.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The Vorabpauschale counts against your FSA first. Dividends, interest, and realised gains use whatever FSA remains. If your total investment income (including Vorabpauschale) stays below €1,000, you pay no Abgeltungsteuer at all that year.
          </p>

          <Callout type="tip">
            If you hold ETFs at multiple brokers (e.g., DEGIRO and Trade Republic), split your Freistellungsauftrag across them — file an FSA at each, totalling no more than €1,000. Your broker will handle Vorabpauschale deductions automatically in January; you don't need to calculate anything yourself.
          </Callout>

          <SectionDivider />

          {/* How it works in practice */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>What actually happens in January</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            In January, your German broker calculates the Vorabpauschale for each accumulating ETF you held throughout the prior year. They deduct the tax automatically from your cash balance. If your cash balance is insufficient, they may sell a small number of ETF units to cover it.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            You will see a line item in your broker's tax document (Jahressteuerbescheinigung) for the Vorabpauschale. This document is important — keep it, because you will need the Vorabpauschale amounts to calculate your adjusted cost basis when you eventually sell.
          </p>

          <Callout type="insight">
            When you sell an accumulating ETF, the total Vorabpauschale paid over the years you held it is deducted from your taxable gain. You don't pay tax on that portion again. The Vorabpauschale is a prepayment, not an additional tax on top of your eventual gain.
          </Callout>

          <SectionDivider />

          {/* Teilfreistellung by fund type */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Teilfreistellung rates by fund type</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The 30% partial exemption shown above applies to equity ETFs (≥51% equity). Other fund types have different rates:
          </p>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Fund type</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Teilfreistellung</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)', background: '#f9f9f9' }}>
                  <td style={{ padding: '12px', color: 'var(--ink)', fontWeight: 600 }}>Equity fund (≥51% equities)</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--ink)', fontFamily: 'monospace', fontWeight: 600 }}>30%</td>
                  <td style={{ padding: '12px', color: 'var(--ink-3)' }}>VWCE, IWDA, CSPX, IMEU</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', color: 'var(--ink)' }}>Mixed fund (25–50% equities)</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--ink)', fontFamily: 'monospace' }}>15%</td>
                  <td style={{ padding: '12px', color: 'var(--ink-3)' }}>Balanced funds</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px', color: 'var(--ink)' }}>Real estate fund (≥51% property)</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--ink)', fontFamily: 'monospace' }}>60%</td>
                  <td style={{ padding: '12px', color: 'var(--ink-3)' }}>REIT ETFs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)', background: '#f9f9f9' }}>
                  <td style={{ padding: '12px', color: 'var(--ink)' }}>Bond / money market fund</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--ink)', fontFamily: 'monospace' }}>0%</td>
                  <td style={{ padding: '12px', color: 'var(--ink-3)' }}>AGGH, IBGS</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SectionDivider />

          {/* Historical rates */}
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Historical base rates</h2>
          <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Tax year</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Basiszins</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', color: 'var(--ink)', fontWeight: 600 }}>Vorabpauschale per €10k (equity ETF)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { year: '2019', rate: '0.52%', per10k: '~€2.55 tax' },
                  { year: '2020', rate: '0.07%', per10k: '~€0.34 tax' },
                  { year: '2021', rate: '−0.45%', per10k: 'None (negative rate)' },
                  { year: '2022', rate: '0.25%', per10k: '~€1.23 tax' },
                  { year: '2023', rate: '2.55%', per10k: '~€33 tax' },
                  { year: '2024', rate: '2.29%', per10k: '~€30 tax' },
                  { year: '2025', rate: '2.53%', per10k: '~€33 tax' },
                  { year: '2026', rate: '3.20%', per10k: '~€41 tax', highlight: true },
                ].map(row => (
                  <tr key={row.year} style={{ borderBottom: '1px solid var(--border)', background: row.highlight ? '#f0faf4' : undefined }}>
                    <td style={{ padding: '12px', color: 'var(--ink)', fontWeight: row.highlight ? 700 : undefined }}>
                      {row.year}{row.highlight ? ' ← current' : ''}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', color: 'var(--ink)', fontFamily: 'monospace' }}>{row.rate}</td>
                    <td style={{ padding: '12px', textAlign: 'right', color: 'var(--ink-3)', fontFamily: 'monospace', fontSize: '13px' }}>{row.per10k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
            2021 had a negative base rate, so no Vorabpauschale was owed. 2022 was the last year of low rates before ECB tightening pushed them up. 2026 is the highest in the modern Vorabpauschale era.
          </p>

          <SectionDivider />

          {/* Screener CTA */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Browse ETFs available on DEGIRO and Trade Republic</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6 }}>Filter by broker, domicile (Ireland / Luxembourg), accumulating vs distributing, and SFDR category.</p>
            </div>
            <Link href="/screener" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Open Screener →
            </Link>
          </div>

          {/* Disclaimer */}
          <div style={{ marginTop: '40px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            This guide is for informational purposes only. Not personalised tax advice. Base rate sourced from BMF publications. Tax rules can change — verify current rates with your broker or a qualified German tax adviser (Steuerberater). Kirchensteuer not included in example calculations.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
