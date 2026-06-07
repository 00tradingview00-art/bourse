import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'DEGIRO vs Trade Republic vs IBKR — European Broker Comparison | Boursee',
  description: 'Side-by-side comparison of DEGIRO, Trade Republic, and Interactive Brokers for European ETF investors: fees, savings plans, cash interest, product range, and regulation.',
}

type Cell = string | { text: string; sub?: string; highlight?: boolean; dim?: boolean; na?: boolean }

function Td({ cell, header }: { cell: Cell; header?: boolean }) {
  if (typeof cell === 'string') {
    return (
      <td style={{ padding: '12px 16px', fontSize: '13px', color: header ? 'var(--ink)' : 'var(--ink-2)', borderBottom: '1px solid var(--border)', verticalAlign: 'top', fontWeight: header ? 600 : undefined }}>
        {cell}
      </td>
    )
  }
  return (
    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', verticalAlign: 'top' }}>
      <div style={{ fontSize: '13px', color: cell.na ? 'var(--ink-4)' : cell.dim ? 'var(--ink-4)' : 'var(--ink)', fontWeight: cell.highlight ? 600 : undefined }}>
        {cell.text}
      </div>
      {cell.sub && <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px', lineHeight: 1.4 }}>{cell.sub}</div>}
    </td>
  )
}

const ROWS: { label: string; sub?: string; cells: [Cell, Cell, Cell] }[] = [
  {
    label: 'Account fee',
    cells: [
      { text: 'None', highlight: true },
      { text: 'None', highlight: true },
      { text: 'None', highlight: true },
    ],
  },
  {
    label: 'ETF trading cost',
    sub: 'Per order',
    cells: [
      { text: '€2.50 + 0.03%', sub: '€2.00 for ETF Core list (first trade/month free)' },
      { text: '€1 flat', sub: 'All ETFs, no minimum' },
      { text: '€0.95–€1.25', sub: 'Volume-based; lower with higher monthly activity' },
    ],
  },
  {
    label: 'Stock trading cost',
    sub: 'European exchanges',
    cells: [
      { text: '€3 + 0.03%', sub: 'Minimum €3 per order' },
      { text: '€1 flat', sub: 'All exchanges' },
      { text: '€0.95–€1.25', sub: 'IBKR Pro; IBKR Lite not available in EU' },
    ],
  },
  {
    label: 'Free/zero-cost ETF list',
    cells: [
      { text: 'ETF Core Selection', sub: '~200 ETFs; first trade/month at preferred rate' },
      { text: '€1 flat applies to all', sub: 'No special free list; all same rate' },
      { text: 'None', na: true, sub: 'Standard commissions apply to all ETFs' },
    ],
  },
  {
    label: 'Savings plans (DCA)',
    sub: 'Automated recurring buys',
    cells: [
      { text: 'Not available', na: true },
      { text: 'Free · from €1/month', highlight: true, sub: 'Any ETF, any amount, weekly/monthly' },
      { text: 'Not available', na: true, sub: 'Manual orders only; no built-in DCA' },
    ],
  },
  {
    label: 'Fractional shares',
    cells: [
      { text: 'No', na: true },
      { text: 'Yes (via savings plans)', sub: 'Fractional available within plans; not standalone orders' },
      { text: 'Yes', highlight: true, sub: 'Full fractional trading on eligible securities' },
    ],
  },
  {
    label: 'Interest on cash',
    sub: 'Rate on uninvested cash (June 2026)',
    cells: [
      { text: '~2.7% (Smart Cash)', sub: 'Via Money Market fund; opt-in required' },
      { text: '~2.5% AER', sub: 'Auto-applied; up to €50,000' },
      { text: '~3.5% (EUR)', highlight: true, sub: 'Above €10k balance; rate moves with ECB; highest tier' },
    ],
  },
  {
    label: 'Stock options & derivatives',
    cells: [
      { text: 'Yes', sub: 'Options, futures, warrants — Active/Trader profile required' },
      { text: 'No', na: true },
      { text: 'Yes', highlight: true, sub: 'Full options, futures, forex — widest range' },
    ],
  },
  {
    label: 'Crypto',
    cells: [
      { text: 'No', na: true },
      { text: 'Yes', sub: 'Spot crypto; BTC, ETH and others' },
      { text: 'No', na: true, sub: 'Crypto ETPs only (no spot)' },
    ],
  },
  {
    label: 'Bonds / fixed income',
    cells: [
      { text: 'Limited', sub: 'Selected bond ETFs and some government bonds' },
      { text: 'Yes', sub: 'EU government bonds and corporate bonds; from €1' },
      { text: 'Yes', highlight: true, sub: 'Widest selection: corporate, government, convertible, EM bonds' },
    ],
  },
  {
    label: 'ISA / PEA',
    cells: [
      { text: 'None', na: true },
      { text: 'None', na: true },
      { text: 'None', na: true, sub: 'No tax wrapper; use a French bank for PEA' },
    ],
  },
  {
    label: 'Countries available',
    cells: [
      { text: 'EU + EEA', sub: '18 European countries' },
      { text: 'EU + UK', sub: '17+ countries; expanding' },
      { text: 'Global', highlight: true, sub: 'Over 200 countries and territories' },
    ],
  },
  {
    label: 'Regulation',
    cells: [
      { text: 'BaFin (DE) · AFM (NL)', sub: 'Part of flatexDEGIRO AG — listed company' },
      { text: 'BaFin (DE)', sub: 'Trade Republic Bank GmbH — full banking licence' },
      { text: 'FCA (UK) · CySEC (EU) · multiple', sub: 'Listed on Nasdaq; established 1978' },
    ],
  },
  {
    label: 'Deposit protection',
    cells: [
      { text: '€20,000 (SIPC-equivalent)', sub: 'Via Dutch DGS and investor protection' },
      { text: '€100,000 (banking DGS)', highlight: true, sub: 'Full banking licence — higher cash protection' },
      { text: '€20,000 (CySEC) · £85,000 (FCA)', sub: 'Jurisdiction-dependent' },
    ],
  },
  {
    label: 'Exchanges covered',
    cells: [
      { text: 'AEX · DAX · CAC · FTSE · + many', sub: '50+ exchanges worldwide' },
      { text: 'Major EU + US exchanges', sub: 'NYSE, Nasdaq, Euronext, Xetra, LSE' },
      { text: '150+ markets', highlight: true, sub: 'Broadest exchange access globally' },
    ],
  },
  {
    label: 'Best suited for',
    cells: [
      { text: 'Passive investors buying ETFs', sub: 'Especially via Core list; low-cost one-stop' },
      { text: 'DCA / savings plan investors', sub: 'Ideal for recurring ETF or crypto buys from €1' },
      { text: 'Active traders, multi-asset', sub: 'Options, futures, bonds, global equities — professional tools' },
    ],
  },
]

export default function BrokersPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-mid)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '24px', height: '1px', background: 'var(--accent-mid)', display: 'inline-block' }} />
              Broker Comparison
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              DEGIRO vs Trade Republic vs Interactive Brokers
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', maxWidth: '620px', lineHeight: 1.65 }}>
              Side-by-side comparison of the three most popular European brokers for ETF investors — fees, savings plans, cash interest, product range, and regulation. Data as of June 2026.
            </p>
          </div>
        </div>

        {/* Comparison table */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
              <thead>
                <tr style={{ background: 'var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', width: '22%' }}>
                    Feature
                  </th>
                  {[
                    { name: 'DEGIRO', flag: '🇳🇱', sub: 'flatexDEGIRO' },
                    { name: 'Trade Republic', flag: '🇩🇪', sub: 'TR Bank GmbH' },
                    { name: 'Interactive Brokers', flag: '🌐', sub: 'IBKR EU / UK' },
                  ].map(b => (
                    <th key={b.name} style={{ textAlign: 'left', padding: '14px 16px', width: '26%' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{b.flag} {b.name}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{b.sub}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 === 0 ? '#fff' : 'var(--paper)' }}>
                    <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>{row.label}</div>
                      {row.sub && <div style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '2px' }}>{row.sub}</div>}
                    </td>
                    {row.cells.map((cell, j) => <Td key={j} cell={cell} />)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px', padding: '16px 0', fontSize: '11px', color: 'var(--ink-4)', flexWrap: 'wrap' }}>
            <span><strong style={{ color: 'var(--ink)' }}>Bold</strong> = stands out positively in that category</span>
            <span style={{ color: 'var(--ink-4)' }}>Muted text = not available or not applicable</span>
          </div>
        </div>

        {/* Quick verdict section */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px 0' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '-0.01em' }}>Quick summary by investor type</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '48px' }}>
            {[
              {
                broker: 'DEGIRO',
                flag: '🇳🇱',
                headline: 'Best for: one-time ETF buyers',
                points: [
                  'ETF Core list makes frequent buys low-cost',
                  'Widest product range of the three (options, futures)',
                  'No savings plan automation — manual orders only',
                  'Cash interest requires opt-in (Smart Cash)',
                ],
              },
              {
                broker: 'Trade Republic',
                flag: '🇩🇪',
                headline: 'Best for: monthly DCA investors',
                points: [
                  'Free savings plans from €1/month',
                  'Built-in cash interest (auto, no opt-in)',
                  'Full banking licence — higher deposit protection',
                  'No options or derivatives; limited bond selection',
                ],
              },
              {
                broker: 'Interactive Brokers',
                flag: '🌐',
                headline: 'Best for: multi-asset & active traders',
                points: [
                  'Highest cash interest rate on EUR balances',
                  'Fractional shares on all eligible securities',
                  '150+ markets, widest range of instruments',
                  'More complex interface — steeper learning curve',
                ],
              },
            ].map(item => (
              <div key={item.broker} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{item.flag}</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>{item.broker}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.headline}</div>
                <ul style={{ paddingLeft: '16px', margin: 0 }}>
                  {item.points.map(p => (
                    <li key={p} style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '6px', lineHeight: 1.5 }}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Fee example */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px 48px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '16px', letterSpacing: '-0.01em' }}>Real-cost example: €500/month DCA into VWCE</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--ink)', marginBottom: '20px' }}>
            An investor putting €500/month into VWCE.DE via a savings plan over one year:
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600, color: 'var(--ink)' }}>Scenario</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600, color: 'var(--ink)' }}>DEGIRO</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600, color: 'var(--ink)' }}>Trade Republic</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600, color: 'var(--ink)' }}>IBKR</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Trading cost (12 orders × fee)', degiro: '€24.00', tr: '€12.00', ibkr: '€11.40' },
                  { label: 'VWCE eligibility for free list', degiro: 'Yes (Core list)', tr: '€1 applies', ibkr: 'No list' },
                  { label: 'Effective cost if Core rate applies', degiro: '€24.00*', tr: '€12.00', ibkr: '€11.40' },
                  { label: 'Savings plan automation', degiro: 'Manual', tr: 'Automated ✓', ibkr: 'Manual' },
                  { label: 'Cash idle interest (€1,000 avg float)', degiro: '~€27/yr', tr: '~€25/yr', ibkr: '~€35/yr' },
                ].map((row, i) => (
                  <tr key={row.label} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--paper)' }}>
                    <td style={{ padding: '11px 12px', color: 'var(--ink)' }}>{row.label}</td>
                    <td style={{ padding: '11px 12px', textAlign: 'right', color: 'var(--ink-3)', fontFamily: 'monospace' }}>{row.degiro}</td>
                    <td style={{ padding: '11px 12px', textAlign: 'right', color: 'var(--ink-3)', fontFamily: 'monospace' }}>{row.tr}</td>
                    <td style={{ padding: '11px 12px', textAlign: 'right', color: 'var(--ink-3)', fontFamily: 'monospace' }}>{row.ibkr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--ink-4)', marginTop: '10px', lineHeight: 1.5 }}>
            * DEGIRO VWCE.DE is on the Core list. The first trade each month in a Core ETF uses the preferred rate of €2.00; subsequent trades in that ETF cost €2.50 + 0.03%. For exactly one order/month, annual cost = 12 × €2.00 = €24. IBKR assumes 1 lot per month at minimum commission €0.95. Cash interest rates are approximate and variable.
          </p>
        </div>

        {/* Screener CTA */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px 48px' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Find ETFs available on DEGIRO and Trade Republic</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6 }}>The Boursee screener shows which ETFs are in the DEGIRO Core list and available as Trade Republic savings plans.</p>
            </div>
            <Link href="/screener" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Open ETF Screener →
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px 96px' }}>
          <div style={{ padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            Fee and rate data compiled from publicly available broker documentation as of June 2026. Subject to change without notice — always verify current terms directly with the broker before opening an account. This comparison is for informational purposes only and does not constitute a personal recommendation or regulated financial advice under MiFID II.{' '}
            <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Full disclaimer →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
