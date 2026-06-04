import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Cookie Policy — Boursee',
  description: 'Boursee does not use tracking cookies. Details of our cookieless analytics approach.',
}

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 32px 96px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '8px' }}>
            Cookie Policy
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-4)', marginBottom: '48px' }}>
            Effective date: 1 June 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <section>
              <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '4px', padding: '20px 24px', marginBottom: '24px' }}>
                <p style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>
                  Boursee does not use tracking cookies.
                </p>
                <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                  No cookie consent banner is required. Your browsing on Boursee generates no cross-site tracking data.
                </p>
              </div>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                What Are Cookies
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Cookies are small text files stored in your browser by websites you visit. They can be used to
                remember preferences, track user behaviour across sites, or serve targeted advertising.
                Boursee does not use cookies for any of these purposes.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                Analytics: Plausible (Cookieless)
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                We use{' '}
                <a href="https://plausible.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  Plausible Analytics
                </a>
                , a privacy-first analytics tool that does not use cookies, does not track individuals
                across sites, and does not collect personal data. Plausible provides aggregate, anonymised
                statistics (page views, referrers, countries) to help us understand how the platform is used.
                Data is stored in Germany (EU). No data is sent to Google or any US-based analytics service.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                Cookie Inventory
              </h2>
              <div style={{ border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--paper-2)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {['Cookie', 'Purpose', 'Status'].map(h => (
                    <span key={h} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</span>
                  ))}
                </div>
                <div style={{ padding: '16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--ink-3)' }}>—</span>
                  <span style={{ fontSize: '14px', color: 'var(--ink-3)' }}>No cookies in use</span>
                  <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>None set</span>
                </div>
              </div>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                If We Introduce Cookies in Future
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                If Boursee ever introduces features that require cookies (for example, user accounts or
                preference storage), this policy will be updated and a consent mechanism will be added
                before any cookies are set. We will inform subscribers of material changes by email.
              </p>
            </section>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--ink-4)', lineHeight: 1.8 }}>
                Questions? Contact{' '}
                <a href="mailto:privacy@bourse.io" style={{ color: 'var(--accent)', textDecoration: 'none' }}>privacy@bourse.io</a>.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
