import type { StockCopy } from '@/lib/stockCopy'

/** Data-derived description and FAQ block for a stock page (server component). */
export default function StockAbout({ name, copy }: { name: string; copy: StockCopy }) {
  return (
    <section style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', marginBottom: '14px' }}>
        About {name}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-2)' }}>
        {copy.paragraphs.map((p, i) => (
          <p key={i} style={{ margin: 0 }}>{p}</p>
        ))}
      </div>

      <h2 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '24px 0 14px' }}>
        Frequently asked questions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {copy.faqs.map(f => (
          <div key={f.q}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 4px' }}>{f.q}</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--ink-3)', margin: 0 }}>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
