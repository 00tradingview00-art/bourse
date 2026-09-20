import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Cookie Policy — Boursee',
  description: 'Boursee sets analytics cookies only if you accept them. What we use, why, and how to change your choice.',
}

const h2: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }
const body: React.CSSProperties = { fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }

const COOKIES = [
  { name: '_ga', purpose: 'Distinguishes visitors so page views can be counted (Google Analytics)', duration: 'Up to 2 years' },
  { name: '_ga_<container ID>', purpose: 'Keeps track of the current visit (Google Analytics)', duration: 'Up to 2 years' },
]

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
            Last updated: 20 September 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <section>
              <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '4px', padding: '20px 24px' }}>
                <p style={{ fontSize: '15px', color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>
                  Boursee sets analytics cookies only if you accept them.
                </p>
                <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                  We do not use advertising or cross-site tracking cookies. If you decline, or do not choose, Google Analytics is not loaded and no analytics cookies are set.
                </p>
              </div>
            </section>

            <section>
              <h2 style={h2}>What are cookies</h2>
              <p style={body}>
                Cookies are small text files stored in your browser by websites you visit. They can be used to
                remember preferences, measure how a site is used, or serve targeted advertising. Boursee uses
                them for one purpose only: audience measurement, and only with your consent.
              </p>
            </section>

            <section>
              <h2 style={h2}>Analytics: Google Analytics</h2>
              <p style={body}>
                If you accept, we load Google Analytics 4, a service provided by Google. It sets the cookies listed below
                and sends information about your visit, such as the pages you view, your approximate location, your device
                and browser type and how you arrived at the site, to Google. Google may process this information outside
                the European Economic Area. We use the resulting statistics to understand which pages are useful and to
                improve the platform. Legal basis: your consent, which you can withdraw at any time.
              </p>
            </section>

            <section>
              <h2 style={h2}>Cookie inventory</h2>
              <div style={{ border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--paper-2)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '8px' }}>
                  {['Cookie', 'Purpose', 'Duration'].map(h => (
                    <span key={h} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</span>
                  ))}
                </div>
                {COOKIES.map((c, i) => (
                  <div key={c.name} style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '8px', alignItems: 'start', borderBottom: i < COOKIES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: '13px', color: 'var(--ink)', fontFamily: 'monospace' }}>{c.name}</span>
                    <span style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.6 }}>{c.purpose}</span>
                    <span style={{ fontSize: '13px', color: 'var(--ink-3)' }}>{c.duration}</span>
                  </div>
                ))}
              </div>
              <p style={{ ...body, fontSize: '13px', marginTop: '10px' }}>
                Both are set only after you accept. No other cookies are set by Boursee.
              </p>
            </section>

            <section>
              <h2 style={h2}>Your choice</h2>
              <p style={body}>
                The first time you visit you are asked to accept or decline analytics cookies. You can change your mind at any time
                using “Cookie settings” in the footer, which clears your saved choice and shows the banner again. Withdrawing
                consent stops data collection and removes the analytics cookies. You can also delete cookies in your browser settings.
              </p>
            </section>

            <section>
              <h2 style={h2}>Local storage</h2>
              <p style={body}>
                Boursee also stores your cookie choice and your watchlist in your browser’s local storage. These stay on your device
                and are not sent to us or to any third party.
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
