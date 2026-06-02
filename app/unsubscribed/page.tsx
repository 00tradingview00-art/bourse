import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Unsubscribed — Bourse',
}

export default function UnsubscribedPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            You&apos;ve been unsubscribed.
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: '12px' }}>
            You have been removed from the Bourse Brief mailing list. You will not receive any further emails from us.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--ink-4)', lineHeight: 1.7, marginBottom: '32px' }}>
            Your data will be deleted within 30 days in accordance with our{' '}
            <Link href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</Link>.
            To request immediate deletion, email{' '}
            <a href="mailto:privacy@bourse.io" style={{ color: 'var(--accent)', textDecoration: 'none' }}>privacy@bourse.io</a>.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: 'var(--ink)',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textDecoration: 'none',
            }}
          >
            Back to Bourse
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
