'use client'

import { useState } from 'react'

const BADGES = ['AEX', 'DAX', 'CAC 40', 'FTSE 100', 'ECB', 'EUR/USD', 'EUR/INR']

type State = 'idle' | 'loading' | 'check-email' | 'already-subscribed' | 'error'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || state === 'loading') return
    setState('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setState('error')
      } else if (data.alreadySubscribed) {
        setState('already-subscribed')
      } else {
        setState('check-email')
      }
    } catch {
      setState('error')
    }
  }

  return (
    <section id="subscribe" style={{ background: 'var(--ink)', padding: '80px 32px', textAlign: 'center' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4ade80', fontWeight: 500, marginBottom: '16px' }}>
          Free · No credit card · Unsubscribe anytime
        </div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '14px' }}>
          Your European markets.<br />Every morning.
        </h2>
        <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.6, marginBottom: '32px' }}>
          Join investors across Europe getting the Boursee Brief — independent market intelligence delivered at 6:30 AM CET before the opening bell.
        </p>

        {state === 'idle' || state === 'loading' ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', maxWidth: '420px', margin: '0 auto 16px' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={state === 'loading'}
              style={{
                flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRight: 'none',
                color: '#fff', fontFamily: 'var(--sans)', fontSize: '14px',
                padding: '13px 16px', borderRadius: '3px 0 0 3px', outline: 'none',
                opacity: state === 'loading' ? 0.6 : 1,
              }}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              style={{
                background: state === 'loading' ? '#2d6b42' : 'var(--accent)',
                color: '#fff', border: 'none',
                fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500,
                letterSpacing: '0.04em', padding: '13px 22px',
                borderRadius: '0 3px 3px 0', cursor: state === 'loading' ? 'default' : 'pointer',
                whiteSpace: 'nowrap', transition: 'background 0.15s',
              }}
            >
              {state === 'loading' ? '...' : 'Subscribe Free'}
            </button>
          </form>
        ) : state === 'check-email' ? (
          <div style={{ maxWidth: '420px', margin: '0 auto 16px', padding: '16px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '3px', color: '#4ade80', fontSize: '14px', fontWeight: 500 }}>
            ✓ Check your inbox to confirm your subscription.
          </div>
        ) : state === 'already-subscribed' ? (
          <div style={{ maxWidth: '420px', margin: '0 auto 16px', padding: '16px', background: 'rgba(184,146,42,0.1)', border: '1px solid rgba(184,146,42,0.3)', borderRadius: '3px', color: 'var(--gold)', fontSize: '14px' }}>
            You&apos;re already subscribed. Check your inbox for the Boursee Brief.
          </div>
        ) : (
          <div style={{ maxWidth: '420px', margin: '0 auto 16px', padding: '16px', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '3px', color: 'var(--red)', fontSize: '14px' }}>
            Something went wrong. Please try again or email{' '}
            <a href="mailto:hello@boursee.com" style={{ color: 'inherit', textDecoration: 'underline' }}>hello@boursee.com</a>.
          </div>
        )}

        <div style={{ fontSize: '11px', color: '#555', letterSpacing: '0.02em' }}>
          Daily brief · European market screener · Independent research · No spam
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
          {BADGES.map(b => (
            <span key={b} style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '5px 12px', border: '1px solid #2a2a2a', borderRadius: '2px', color: '#555' }}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
