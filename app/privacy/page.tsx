import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Privacy Policy — Boursee',
  description: 'How Boursee collects, uses, and protects your personal data under GDPR.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '70vh' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 32px 96px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '12px' }}>Legal</p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '8px' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ink-4)', marginBottom: '48px' }}>
            Last updated: 1 June 2026 · Governed by GDPR (EU 2016/679)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                1. Data Controller
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Boursee is operated by Prabal Kapoor. For data protection enquiries, contact:{' '}
                <a href="mailto:privacy@bourse.io" style={{ color: 'var(--accent)', textDecoration: 'none' }}>privacy@bourse.io</a>.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                2. Data We Collect and Why
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--paper-2)', padding: '16px 20px', borderRadius: '4px', borderLeft: '3px solid var(--accent)' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>Email address (newsletter subscribers)</p>
                  <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                    Legal basis: Consent. Collected when you subscribe to the daily brief. Used only to deliver the newsletter.
                    Retained until you unsubscribe, then deleted within 30 days.
                  </p>
                </div>
                <div style={{ background: 'var(--paper-2)', padding: '16px 20px', borderRadius: '4px', borderLeft: '3px solid var(--accent)' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px' }}>Analytics (page visits)</p>
                  <p style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                    Legal basis: Legitimate interest. We use Plausible Analytics, a cookieless analytics tool that does not
                    track individuals and does not use cookies. No personal data is collected. Data is stored in the EU (Germany).
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                3. Data Recipients
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: '12px' }}>
                Your email address is shared with:
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Brevo (Sendinblue)', desc: 'Email delivery service. Data stored in France (EU). GDPR compliant.' },
                  { name: 'Vercel', desc: 'Hosting provider. Configured to EU region (Frankfurt, Germany). Processes request data to serve the website.' },
                ].map(r => (
                  <li key={r.name} style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{r.name}:</span> {r.desc}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8, marginTop: '12px' }}>
                We do not sell, rent, or share your personal data with any other third parties.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                4. International Transfers
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                All personal data is stored and processed within the EU. Our hosting (Vercel, Frankfurt region)
                and email provider (Brevo, France) are EU-based. No transfers to third countries occur.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                5. Data Retention
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Email addresses are retained for as long as your newsletter subscription is active.
                Upon unsubscription, your email address is deleted within 30 days. Analytics data
                collected by Plausible is anonymised and aggregated — no individual retention period applies.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                6. Your Rights Under GDPR
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: '12px' }}>
                You have the following rights regarding your personal data:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '0', listStyle: 'none' }}>
                {[
                  ['Right of access', 'Request a copy of the personal data we hold about you.'],
                  ['Right to rectification', 'Request correction of inaccurate personal data.'],
                  ['Right to erasure', 'Request deletion of your personal data ("right to be forgotten").'],
                  ['Right to data portability', 'Receive your personal data in a machine-readable format.'],
                  ['Right to object', 'Object to processing based on legitimate interests.'],
                  ['Right to restriction', 'Request that we restrict processing of your data.'],
                  ['Right not to be subject to automated decisions', 'We do not make automated individual decisions that produce legal effects.'],
                  ['Right to withdraw consent', 'Withdraw consent at any time by unsubscribing. Withdrawal does not affect processing carried out before withdrawal.'],
                ].map(([right, desc]) => (
                  <li key={right} style={{ fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{right}:</span> {desc}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8, marginTop: '16px' }}>
                To exercise any right, email{' '}
                <a href="mailto:privacy@bourse.io" style={{ color: 'var(--accent)', textDecoration: 'none' }}>privacy@bourse.io</a>.
                We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                7. Cookies
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                Boursee does not use cookies for tracking or analytics. We use Plausible Analytics, which is
                cookieless by design. See our{' '}
                <a href="/cookies" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Cookie Policy</a>{' '}
                for full details.
              </p>
            </section>

            <section>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>
                8. Right to Lodge a Complaint
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.8 }}>
                If you believe your data rights have not been respected, you have the right to lodge a complaint
                with the Dutch data protection authority:{' '}
                <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  autoriteitpersoonsgegevens.nl
                </a>.
              </p>
            </section>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--ink-4)', lineHeight: 1.8 }}>
                This policy may be updated. Material changes will be communicated to subscribers by email.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
