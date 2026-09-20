import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { SCREENER_AS_OF } from '@/lib/dataFreshness'

export const metadata: Metadata = {
  title: 'Data Sources and Methodology — Where Boursee Numbers Come From | Boursee',
  description: 'Where Boursee gets its market, ECB and bond data, how often each page updates, what the screener indicators mean, and the limits of the data.',
}

const SOURCES = [
  {
    what: 'Stock and ETF pages, screener, sectors, index pages',
    from: 'Daily price history and fundamentals from Yahoo Finance and Financial Modeling Prep',
    refresh: `End-of-day closing prices, rewritten each weekday evening after the European close (currently as of ${SCREENER_AS_OF})`,
  },
  {
    what: 'Homepage market strip, index levels, Brent, gold, macro-bridge',
    from: 'Yahoo Finance market data',
    refresh: 'Refreshed about every 10 minutes while markets are open; can lag the exchange by up to 15 minutes',
  },
  {
    what: 'EUR/USD and EUR/INR',
    from: 'Frankfurter API, which publishes the ECB reference exchange rates',
    refresh: 'Daily reference rates',
  },
  {
    what: 'ECB deposit rate, rate history, next decision date',
    from: 'ECB Data Portal (deposit facility rate) and the ECB monetary policy meeting calendar',
    refresh: 'Rate feed checked every few hours; meeting dates follow the published ECB calendar',
  },
  {
    what: 'Government bond yields',
    from: 'ECB Data Portal long-term interest rate series',
    refresh: 'Monthly series. If a series cannot be loaded, the page says it is showing reference values',
  },
]

const CONTENT = [
  {
    what: 'Daily Brief',
    how: 'Written each weekday morning by an AI language model from that morning’s market data, and published automatically. It is not reviewed by an editor before it goes live.',
  },
  {
    what: 'Flash Intelligence',
    how: 'Short items written by an AI language model when automated monitoring picks up a European news headline. The model works from the headline, and every item is labelled “AI-generated”.',
  },
  {
    what: 'Explainer articles',
    how: 'Drafted weekly by an AI language model from a planned list of topics, and published without an editor’s review.',
  },
]

const INDICATORS = [
  { name: 'RSI', meaning: 'A momentum gauge. It reads high after a run of unusually strong gains and low after unusually weak ones. Boursee labels the extremes “overbought” and “oversold”; both describe recent price action, not a forecast.' },
  { name: 'MACD', meaning: 'A trend-and-momentum indicator built from moving averages. The screener shows whether the trend is bullish or bearish and when the signal lines have just crossed.' },
  { name: 'SuperTrend', meaning: 'A trend-following line that adjusts to recent volatility. It shows whether the price is trading above (bullish) or below (bearish) that line.' },
  { name: 'Relative strength', meaning: 'How a stock has performed against its own index over the last 30 days. A positive number means it has outperformed the index.' },
  { name: 'Volume signal', meaning: 'Compares the latest trading volume with its recent average. “Surge” means volume was well above normal.' },
  { name: '52-week range', meaning: 'The lowest and highest prices the share has traded at over the past year, and where the latest close sits between them.' },
]

const h2: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 16px' }
const card: React.CSSProperties = { background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px 20px' }

export default function MethodologyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '80vh' }}>
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '20px' }}>
              Methodology
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '16px', lineHeight: 1.1 }}>
              Where Boursee’s numbers come from
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: '620px' }}>
              What each page shows, where the data is sourced, how fresh it is, and what the screener indicators mean.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '48px 32px 96px', display: 'flex', flexDirection: 'column', gap: '48px' }}>

          <section>
            <h2 style={h2}>Data sources and freshness</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SOURCES.map(s => (
                <div key={s.what} style={card}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>{s.what}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6 }}><strong style={{ color: 'var(--ink-2)' }}>Source:</strong> {s.from}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6 }}><strong style={{ color: 'var(--ink-2)' }}>Freshness:</strong> {s.refresh}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={h2}>How content is produced</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {CONTENT.map(c => (
                <div key={c.what} style={card}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>{c.what}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65 }}>{c.how}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--ink-2)', margin: '16px 0 0' }}>
              AI-written text can contain mistakes, including in how it describes a number. The figures on stock, ETF, ECB and bond pages are pulled directly from the sources above rather than written by a model.
              Treat the written pieces as market context and check the original source before relying on a detail.
            </p>
          </section>

          <section>
            <h2 style={h2}>Currencies</h2>
            <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--ink-2)', margin: 0 }}>
              Each price is shown in the currency the share is quoted in, without conversion. Most listings are in euros (€).
              London-listed shares are quoted in pence sterling, shown with a “p” (100p = £1), and Stockholm-listed shares in Swedish krona (SEK).
            </p>
          </section>

          <section>
            <h2 style={h2}>What the indicators mean</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {INDICATORS.map(i => (
                <div key={i.name} style={{ ...card, display: 'flex', gap: '16px', alignItems: 'baseline' }}>
                  <div style={{ flexShrink: 0, minWidth: '110px', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{i.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65 }}>{i.meaning}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={h2}>Limits of the data</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
              <li>Third-party data can contain errors or gaps. Where a figure is unavailable Boursee leaves it out, or labels it as reference data, rather than estimating it, so some pages show fewer metrics than others.</li>
              <li>The screener covers a fixed universe of European stocks and UCITS ETFs and does not include every member of every index.</li>
              <li>Indicators describe past price action. None of them predicts future performance.</li>
              <li>Boursee provides general information under Article 24 of MiFID II. It is not personalised investment advice and is not regulated by the AFM or FCA. See the <Link href="/disclaimer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>full disclaimer</Link>.</li>
            </ul>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
