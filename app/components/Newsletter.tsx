'use client'

import { useState } from 'react'

const BADGES = ['AEX', 'DAX', 'CAC 40', 'FTSE 100', 'ECB', 'EUR/USD', 'EUR/INR']

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
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
          Join investors across Europe getting the Bourse Brief — independent market intelligence delivered at 6:30 AM CET before the opening bell.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', maxWidth: '420px', margin: '0 auto 16px' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRight: 'none',
                color: '#fff', fontFamily: 'var(--sans)', fontSize: '14px',
                padding: '13px 16px', borderRadius: '3px 0 0 3px', outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--accent)', color: '#fff', border: 'none',
                fontFamily: 'var(--sans)', fontSize: '13px', fontWeight: 500,
                letterSpacing: '0.04em', padding: '13px 22px',
                borderRadius: '0 3px 3px 0', cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Subscribe Free
            </button>
          </form>
        ) : (
          <div style={{ maxWidth: '420px', margin: '0 auto 16px', padding: '16px', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '3px', color: '#4ade80', fontSize: '14px', fontWeight: 500 }}>
            ✓ You&apos;re on the list. First brief arrives tomorrow at 6:30 AM CET.
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
