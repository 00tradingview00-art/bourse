import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Terms of Service — Bourse',
  description: 'Terms and conditions governing use of the Bourse platform.',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 32px 96px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '8px' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-4)', marginBottom: '48px' }}>
            Effective date: 1 June 2026 · Governing law: Netherlands
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                1. Nature of the Service
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Bourse provides general market information, data, and analysis for informational and educational
                purposes only. The service does not constitute investment advice, financial advice, or a personal
                recommendation to buy or sell any financial instrument. Bourse is not a regulated investment firm
                and is not authorised by the AFM (Autoriteit Financiële Markten).
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                2. No Warranty on Data Accuracy
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Market data displayed on Bourse is sourced from third-party providers and may be delayed,
                incomplete, or inaccurate. Bourse makes no warranty, express or implied, as to the accuracy,
                timeliness, or completeness of any data, prices, or analysis. You should verify all market data
                independently before making any decisions.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                3. Limitation of Liability
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                To the fullest extent permitted by applicable law, Bourse and its operators shall not be liable
                for any direct, indirect, incidental, special, consequential, or exemplary damages arising from
                your use of or inability to use the service, including but not limited to financial losses
                resulting from reliance on content published on this platform.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                4. Prohibited Uses
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: '12px' }}>
                You may not:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '20px' }}>
                {[
                  'Reproduce, redistribute, or republish content for commercial purposes without written permission',
                  'Systematically scrape or extract data from the platform',
                  'Use the service in any way that could constitute provision of investment advice to others',
                  'Attempt to circumvent any security measures or access controls',
                  'Use automated means to access the service in a manner that degrades performance for other users',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7 }}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                5. Intellectual Property
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                All content on Bourse — including market briefs, analysis, and editorial text — is the intellectual
                property of Bourse and its operators. Market data (prices, indices) is publicly sourced and not
                claimed as proprietary. You may quote brief excerpts for non-commercial purposes with attribution.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                6. Newsletter Subscription
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                By subscribing to the Bourse newsletter, you consent to receive daily market intelligence emails.
                You may unsubscribe at any time via the link included in every email. Your email address will be
                processed in accordance with our{' '}
                <a href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</a>.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                7. Changes to the Service
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Bourse reserves the right to modify, suspend, or discontinue any part of the service at any time
                without notice. We are not liable to you or any third party for any modification, suspension, or
                discontinuation of the service.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                8. Governing Law and Disputes
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                These terms are governed by the laws of the Netherlands. Any dispute arising from use of Bourse
                shall first be subject to good-faith negotiation. If unresolved, disputes shall be submitted to
                the competent courts of the Netherlands.
              </p>
            </section>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--ink-4)', lineHeight: 1.8 }}>
                For questions about these terms, contact{' '}
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
