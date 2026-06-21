import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'AEX, DAX, CAC 40, FTSE 100 Explained: European Stock Indices Guide | Boursee',
  description: 'A plain-English guide to the major European stock indices — AEX, DAX, CAC 40, FTSE 100, IBEX 35, and FTSE MIB — what they measure, how they differ, and what moves them.',
}

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the AEX index?',
      acceptedAnswer: { '@type': 'Answer', text: 'The AEX (Amsterdam Exchange Index) is the benchmark stock index of Euronext Amsterdam. It contains the 25 largest Dutch-listed companies by free-float market capitalisation. Major constituents include ASML, Shell, ING, Unilever, Heineken, and Philips. The AEX is heavily weighted towards technology (ASML) and energy (Shell), making it sensitive to semiconductor cycles and oil prices.' },
    },
    {
      '@type': 'Question',
      name: 'How is the DAX different from the CAC 40?',
      acceptedAnswer: { '@type': 'Answer', text: 'The DAX contains 40 German companies listed on Xetra, dominated by industrials, chemicals, and autos (Volkswagen, BASF, Siemens, BMW). The CAC 40 contains 40 French companies and is more weighted towards luxury (LVMH, Hermès, L\'Oréal) and energy (TotalEnergies). The DAX is a total return index (dividends reinvested), while the CAC 40 is a price return index — this makes direct comparison misleading.' },
    },
    {
      '@type': 'Question',
      name: 'Is the FTSE 100 a European index?',
      acceptedAnswer: { '@type': 'Answer', text: 'The FTSE 100 is a UK index (London Stock Exchange) and, since Brexit, is no longer part of the EU single market. However, it remains a key European investing benchmark. The FTSE 100 is heavily weighted towards energy (Shell, BP), mining (Rio Tinto, Glencore), and financials (HSBC, Barclays). Around 70-75% of FTSE 100 revenue comes from outside the UK, making it a global rather than UK-domestic index.' },
    },
    {
      '@type': 'Question',
      name: 'What is the Euro Stoxx 50?',
      acceptedAnswer: { '@type': 'Answer', text: 'The Euro Stoxx 50 is a pan-European index of the 50 largest eurozone companies across 11 member states. It is the most widely used benchmark for European equity derivatives and ETFs that want eurozone-wide exposure. Major constituents include ASML, LVMH, SAP, TotalEnergies, Siemens, and Sanofi. Unlike country-specific indices, it provides a single eurozone snapshot.' },
    },
  ],
}

function Callout({ type, children }: { type: 'insight' | 'tip'; children: React.ReactNode }) {
  const styles = {
    insight: { bg: '#f0f7ff', border: '#bcd6f5', label: 'Key insight', labelColor: '#1a6bc4' },
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

const INDICES = [
  { flag: '🇳🇱', name: 'AEX', full: 'Amsterdam Exchange Index', exchange: 'Euronext Amsterdam', count: 25, weight: 'ASML (~25%), Shell, ING, Heineken', character: 'Tech-heavy (ASML dominates). Sensitive to semiconductor cycles and EUR/USD.' },
  { flag: '🇩🇪', name: 'DAX', full: 'Deutscher Aktienindex', exchange: 'Xetra (Frankfurt)', count: 40, weight: 'SAP, Siemens, Allianz, BASF, Volkswagen', character: 'Industrial & chemical-heavy. Total return index (dividends reinvested). Export-driven — sensitive to global trade and EUR/USD.' },
  { flag: '🇫🇷', name: 'CAC 40', full: 'Cotation Assistée en Continu', exchange: 'Euronext Paris', count: 40, weight: 'LVMH (~15%), TotalEnergies, Hermès, L\'Oréal, Sanofi', character: 'Luxury and energy-heavy. Price return index (dividends not included). Strong global luxury exposure through LVMH/Hermès.' },
  { flag: '🇬🇧', name: 'FTSE 100', full: 'Financial Times Stock Exchange 100', exchange: 'London Stock Exchange', count: 100, weight: 'Shell, HSBC, AstraZeneca, Unilever, BP', character: '70%+ of revenues from outside UK. Mining, energy, pharma, and banking. GBP-denominated — sensitive to GBP/USD.' },
  { flag: '🇪🇸', name: 'IBEX 35', full: 'Índice Bursátil Español', exchange: 'Bolsa de Madrid', count: 35, weight: 'Banco Santander, BBVA, Inditex, Iberdrola, Telefónica', character: 'Banking, utilities, telecoms, and retail (Inditex/Zara). High LatAm exposure via Santander and BBVA.' },
  { flag: '🇮🇹', name: 'FTSE MIB', full: 'FTSE Milano Italia Borsa', exchange: 'Borsa Italiana (Milan)', count: 40, weight: 'Enel, Intesa Sanpaolo, Unicredit, Ferrari, Stellantis', character: 'Banking-heavy with significant BTP spread sensitivity. Ferrari and Stellantis add luxury and auto exposure.' },
]

export default function EuropeanIndicesGuide() {
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
              <span style={{ fontSize: '26px' }}>📊</span>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Europe-wide — Market Structure</span>
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.15 }}>
              European Stock Indices Explained
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: '620px' }}>
              AEX, DAX, CAC 40, FTSE 100, IBEX 35, FTSE MIB — six major indices, six very different market characters. Here is what each measures and why they move differently.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px' }}>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', letterSpacing: '-0.01em' }}>The six major European indices</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '24px' }}>
            Each index measures the performance of the largest companies listed on its national exchange, weighted by free-float market capitalisation. But "largest companies" means very different things across Europe — ASML dominates the AEX, LVMH dominates the CAC, Shell sits atop the FTSE 100. The sector mix of each index determines how it responds to macro events.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
            {INDICES.map(idx => (
              <div key={idx.name} style={{ border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '22px' }}>{idx.flag}</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>{idx.name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--ink-4)' }}>{idx.full} · {idx.exchange} · {idx.count} stocks</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '6px' }}><strong style={{ color: 'var(--ink)' }}>Top weights:</strong> {idx.weight}</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65 }}>{idx.character}</div>
              </div>
            ))}
          </div>

          <Callout type="insight">
            The DAX is a total return index — dividends from DAX companies are reinvested into the index. The CAC 40 is a price return index — dividends are not included. This means DAX long-run performance looks better than CAC 40 on a like-for-like basis, even if the underlying companies performed similarly.
          </Callout>

          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '14px', marginTop: '36px', letterSpacing: '-0.01em' }}>The Euro Stoxx 50: pan-European benchmark</h2>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)', marginBottom: '16px' }}>
            For investors wanting a single eurozone benchmark rather than six country-specific indices, the Euro Stoxx 50 is the standard. It contains the 50 largest eurozone companies across 11 member states. Most European equity ETFs tracking "the European market" use Euro Stoxx 50 or MSCI Europe as their benchmark.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--ink)' }}>
            Key constituents: ASML, LVMH, SAP, TotalEnergies, Siemens, Sanofi, Airbus, Allianz, L'Oréal, Schneider Electric. It is notably absent of UK stocks (post-Brexit) and Nordic companies not in the eurozone.
          </p>

          <Callout type="tip">
            Track all six European indices in real time on Boursee. The sector heatmap shows which sectors are outperforming or underperforming today across all major European exchanges.
          </Callout>

          <div style={{ marginTop: '32px', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Live European index data and sector heatmap</div>
              <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.6 }}>Track AEX, DAX, CAC 40, FTSE 100, IBEX 35, and FTSE MIB in real time. Filter the screener by index.</p>
            </div>
            <Link href="/sectors" style={{ background: 'var(--accent)', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>Sector Heatmap →</Link>
          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Related guides</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px' }}>
              <Link href="/guides/ecb-interest-rates-explained" style={{ color: 'var(--accent)', textDecoration: 'none' }}>ECB Interest Rates →</Link>
              <Link href="/guides/bond-yields-and-stocks" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Bond Yields and Stocks →</Link>
              <Link href="/screener" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Stock Screener →</Link>
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px 20px', background: 'var(--paper-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--border)', borderRadius: '3px', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
            For informational purposes only. Not investment advice under MiFID II Article 24. Index compositions and weightings change. Verify current constituents with the relevant index provider.
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
