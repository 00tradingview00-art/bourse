import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'European Dividend Withholding Tax Guide for ETF Investors | Boursee',
  description: 'How dividend withholding tax works across Europe: Netherlands 15%, Germany 25%, France 12.8%, Italy 26%, Spain 19%. Impact on UCITS ETFs and which domicile minimises your tax drag.',
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is dividend withholding tax on ETFs?',
      acceptedAnswer: { '@type': 'Answer', text: 'Dividend withholding tax (WHT) is a tax withheld at source when a company pays a dividend. For ETF investors, it reduces the dividend income passed through by the fund. The rate depends on the country where the dividend-paying company is domiciled, the ETF\'s domicile, and any applicable tax treaties.' },
    },
    {
      '@type': 'Question',
      name: 'Which ETF domicile has the lowest withholding tax — Ireland or Luxembourg?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ireland is generally better for US dividends: Ireland has a 15% WHT treaty with the US (vs 30% for Luxembourg), so Irish-domiciled ETFs holding US stocks (S&P 500, MSCI World) retain more dividend income. For European dividends, the difference is smaller but Ireland still tends to be more tax-efficient due to broader treaty networks.' },
    },
    {
      '@type': 'Question',
      name: 'Do accumulating ETFs avoid dividend withholding tax?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Accumulating ETFs still receive dividends from the underlying stocks — these are subject to withholding tax at the ETF level. The tax drag is the same whether the ETF distributes or reinvests the income. The advantage of accumulating ETFs is that you avoid personal income tax on distributions in your home country, not the underlying WHT.' },
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

const RATES = [
  { country: 'Netherlands 🇳🇱', treaty: '15%', reduced: '10%', note: 'Partially reclaim via tax return; IR domiciled ETFs benefit from 15% treaty rate', etfDomicile: 'Ireland (0% outgoing)' },
  { country: 'Germany 🇩🇪',     treaty: '15%', reduced: '0%',  note: 'Solidarity surcharge (5.5%) adds on top; Teilfreistellung reduces taxable portion', etfDomicile: 'Ireland or Germany' },
  { country: 'France 🇫🇷',      treaty: '15%', reduced: '0%',  note: 'PEA account exempts French dividends entirely; foreign WHT still applies inside fund', etfDomicile: 'France (for PEA), Ireland otherwise' },
  { country: 'Italy 🇮🇹',       treaty: '15%', reduced: '0%',  note: '26% flat rate on capital gains and dividends; limited reclaim mechanisms', etfDomicile: 'Ireland' },
  { country: 'Spain 🇪🇸',       treaty: '15%', reduced: '0%',  note: '19% on first €6,000 gains/dividends, 23% above €50,000; treaty reclaim possible', etfDomicile: 'Ireland' },
  { country: 'UK 🇬🇧',          treaty: 'N/A', reduced: '0%',  note: 'No WHT on dividends paid out of UK companies (0% outgoing); 8.75% / 33.75% income tax on dividends received', etfDomicile: 'Ireland or UK' },
  { country: 'Sweden 🇸🇪',      treaty: '15%', reduced: '0%',  note: '30% standard WHT; reduced to 15% via treaty; ISK account structure mitigates', etfDomicile: 'Ireland' },
]

export default function DividendWithholdingTaxGuide() {
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
              <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>8 min read</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px' }}>🇪🇺</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Europe-wide — Tax</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              Dividend Withholding Tax in Europe — A Practical Guide for ETF Investors
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              When a European company pays a dividend, the government takes a cut before it reaches you — or your fund. Understanding withholding tax (WHT) explains why ETF domicile matters, why Ireland is so popular, and how much it actually costs you.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>What is withholding tax?</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            Withholding tax (WHT) is a tax deducted at source before a dividend is paid. The company paying the dividend withholds a percentage and remits it directly to the government. The investor — or the fund — receives only the net amount.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)' }}>
            This matters because when you hold a UCITS ETF, the fund itself is the legal recipient of dividends from its holdings. The WHT applies at the fund level, not at your personal level. This is sometimes called the "first layer" of withholding tax — and it creates a structural cost embedded in the fund's performance.
          </p>

          <Callout type="insight">
            For accumulating UCITS ETFs, you never see dividends in your account — but the fund still paid withholding tax on every dividend it received from its holdings. This WHT drag directly reduces the fund's NAV growth and is not reflected in the TER.
          </Callout>

          <Divider />

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>Why ETF domicile changes everything</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            The WHT rate a fund pays on dividends received depends not on where you live, but on where the fund is domiciled — and the tax treaty between that country and the dividend-paying country.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            This is why Ireland dominates UCITS ETF domicile. Ireland has tax treaties with most European countries at 15% — and critically, Ireland charges <strong>0% outgoing withholding tax</strong> on dividends and capital gains paid from an Irish-domiciled fund to its investors. Luxembourg charges 15% on outgoing dividends to investors, making it slightly less efficient for distributing ETFs held by non-EU investors.
          </p>

          <Callout type="tip">
            When comparing two ETFs tracking the same index, check if both are Ireland-domiciled. A Luxembourg-domiciled ETF may have a slightly lower TER but still underperform an Irish-domiciled equivalent after accounting for the 15% withholding on distributions.
          </Callout>

          <Divider />

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '20px', letterSpacing: '-0.01em' }}>Withholding tax rates by country</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '24px' }}>
            The table below shows standard domestic WHT rates, the treaty rate that typically applies between EU countries, and practical notes for ETF investors.
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--paper-2)', borderBottom: '2px solid var(--border)' }}>
                  {['Country', 'Treaty WHT', 'Outgoing WHT', 'Notes', 'Best ETF Domicile'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RATES.map((r, i) => (
                  <tr key={r.country} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--paper)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{r.country}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1a4a7a' }}>{r.treaty}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: r.reduced === '0%' ? '#16a34a' : '#ca8a04' }}>{r.reduced}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.5 }}>{r.note}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--ink-4)', whiteSpace: 'nowrap' }}>{r.etfDomicile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            WHT rates change via legislation and treaty renegotiation. Always verify current rates with a local tax advisor or the official tax authority website before making investment decisions.
          </Callout>

          <Divider />

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>The two layers of withholding tax</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            When you hold an ETF, withholding tax can apply at two distinct levels:
          </p>
          <div style={{ marginBottom: '24px' }}>
            {[
              { label: 'Layer 1 — Fund receives dividends from holdings', desc: 'When Dutch, German, or French companies in the index pay dividends, the Irish-domiciled ETF receives them after WHT is deducted by the source country (typically 15% with treaty rates). This is embedded in the ETF\'s performance and not shown in the TER.' },
              { label: 'Layer 2 — Fund pays out to investor (distributing ETFs only)', desc: 'For distributing ETFs, when the fund pays out dividends to you, the fund\'s domicile may withhold a further amount. Irish-domiciled funds charge 0% outgoing WHT to investors. Luxembourg funds charge 15% to non-EU investors.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '28px', height: '28px', background: 'var(--accent)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>{item.label}</div>
                  <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-3)', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Callout type="tip">
            Accumulating ETFs domiciled in Ireland avoid Layer 2 entirely — there is no distribution to withhold from. The fund reinvests dividends internally after paying Layer 1 WHT, and you only pay tax when you sell. This is why accumulating + Irish-domiciled is the default recommendation for long-term European ETF investors.
          </Callout>

          <Divider />

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>How much does WHT actually cost?</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)', marginBottom: '16px' }}>
            For a broad European equity ETF, dividend yield is approximately 3% per year. If the fund pays 15% WHT on those dividends across its portfolio, the annual drag is roughly <strong>0.45%</strong> (15% × 3%). This is on top of the TER.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--ink)' }}>
            Over 20 years, this 0.45% drag compounds significantly — it is not trivial. This is why experienced investors compare ETFs on "total cost of ownership" (TER + WHT drag) rather than TER alone, and why two ETFs with identical TERs can still deliver meaningfully different returns depending on their domicile and the specific treaty rates they benefit from.
          </p>

          <Divider />

          {/* CTA */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>Browse UCITS ETFs on Boursee</div>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)', margin: 0 }}>Filter by domicile, category, TER, and broker availability</p>
            </div>
            <Link href="/screener" style={{ background: 'var(--ink)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Open Screener →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px', fontSize: '13px' }}>
            <Link href="/guides/dutch-box-3" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Dutch Box 3 Guide →</Link>
            <Link href="/guides/german-vorabpauschale" style={{ color: 'var(--accent)', textDecoration: 'none' }}>German Vorabpauschale →</Link>
            <Link href="/guides/french-pea" style={{ color: 'var(--accent)', textDecoration: 'none' }}>French PEA Guide →</Link>
          </div>

          <div style={{ padding: '14px 18px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '11px', color: 'var(--ink-4)', lineHeight: 1.6 }}>
            For general educational purposes only. Not tax advice. Tax laws vary by jurisdiction and change frequently. Consult a qualified tax advisor for your specific situation. Not investment advice under MiFID II Article 24.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
