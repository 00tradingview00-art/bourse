import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Disclaimer — Bourse',
  description: 'Important information about the nature of content published on Bourse.',
}

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 32px 96px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '8px' }}>
            Information Disclaimer
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-4)', marginBottom: '48px' }}>
            Effective date: 1 June 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                Nature of Content
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                The content published on Bourse is for general informational and educational purposes only.
                It does not constitute investment advice, a personal recommendation, or an offer or solicitation
                to buy or sell any financial instrument.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                Regulatory Status
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Bourse is not authorised or regulated by the AFM (Autoriteit Financiële Markten) or any other
                financial regulatory authority as an investment firm or financial adviser. Nothing on this
                platform should be relied upon as the basis for any investment decision.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                Investment Risk
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Financial markets involve significant risk. The value of investments can go up as well as down
                and you may lose some or all of your investment. Past performance is not indicative of future results.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                General Information Only
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Any market analysis, data, or commentary published on Bourse represents general market
                information only and has not been prepared having regard to your specific investment objectives,
                financial situation, or needs. Before making any investment decision, you should seek
                independent professional financial advice from a licensed adviser.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                Data Accuracy
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Data and prices shown are indicative and may be delayed. Bourse makes no representation as to
                the accuracy, completeness, or timeliness of market data. Market data is sourced from third-party
                providers and Bourse accepts no liability for errors or omissions.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                Third-Party References
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Bourse may reference third-party products, services, or financial instruments. These references
                do not constitute endorsements. Bourse has no fiduciary relationship with users of this platform.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                Analytical Tools
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Content is produced with the assistance of automated analytical tools. All published content
                is reviewed before publication and is for informational purposes only.
              </p>
            </section>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--ink-4)', lineHeight: 1.8 }}>
                © 2026 Bourse. Published in the Netherlands. For questions, contact{' '}
                <a href="mailto:hello@bourse.io" style={{ color: 'var(--accent)', textDecoration: 'none' }}>hello@bourse.io</a>.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
