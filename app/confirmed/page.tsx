import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Subscription Confirmed — Boursee',
}

export default function ConfirmedPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--paper)', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '20px' }}>✓</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            You&apos;re subscribed.
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: '32px' }}>
            Your subscription is confirmed. Your first Boursee Brief arrives tomorrow morning at 6:30 AM CET — independent European market intelligence, before the opening bell.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: 'var(--accent)',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textDecoration: 'none',
            }}
          >
            Back to Boursee
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
