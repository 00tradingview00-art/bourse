'use client'

import { FEATURES } from '@/lib/data'

export default function FeaturesGrid() {
  return (
    <section className="max-w-[1200px] mx-auto px-8 py-20">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, maxWidth: '480px' }}>
          Not just news.<br />Intelligence.
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--ink-3)', maxWidth: '280px', lineHeight: 1.6 }}>
          We connect what happens in the world to what moves in your portfolio.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
        {FEATURES.map((f) => (
          <div
            key={f.num}
            style={{ background: 'var(--paper)', padding: '32px 28px', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--paper)')}
          >
            <div style={{ fontSize: '11px', color: 'var(--ink-4)', letterSpacing: '0.1em', marginBottom: '16px' }}>{f.num}</div>
            <div style={{ fontSize: '24px', marginBottom: '14px', display: 'block' }}>{f.icon}</div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px', lineHeight: 1.2 }}>
              {f.title}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65 }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
