'use client'

import Link from 'next/link'
import { FEATURES } from '@/lib/data'

export default function FeaturesGrid() {
  return (
    <section className="mob-p-sm" style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, maxWidth: '480px' }}>
          Not just news.<br />Intelligence.
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ink-3)', maxWidth: '280px', lineHeight: 1.6 }}>
          We connect what happens in the world to what moves in your portfolio.
        </p>
      </div>

      <div className="mob-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
        {FEATURES.map((f) => {
          const inner = (
            <div
              key={f.num}
              style={{ background: 'var(--paper)', padding: '32px 28px', transition: 'background 0.2s', height: '100%', position: 'relative' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--paper)')}
            >
              <div style={{ fontSize: '11px', color: 'var(--ink-4)', letterSpacing: '0.1em', marginBottom: '16px' }}>{f.num}</div>
              <div style={{ fontSize: '24px', marginBottom: '14px', display: 'block' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px', lineHeight: 1.2 }}>
                {f.title}
                {f.href && <span style={{ fontSize: '12px', color: 'var(--accent)', marginLeft: '8px', fontFamily: 'var(--sans)', fontWeight: 400 }}>Live →</span>}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
                {f.description}
              </p>
            </div>
          )

          return f.href
            ? <Link key={f.num} href={f.href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>{inner}</Link>
            : <div key={f.num}>{inner}</div>
        })}
      </div>
    </section>
  )
}
