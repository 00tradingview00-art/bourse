import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 style={{
        fontFamily: 'var(--serif)',
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--ink)',
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
        marginTop: '32px',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border)',
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{
        fontFamily: 'var(--serif)',
        fontSize: '17px',
        fontWeight: 700,
        color: 'var(--ink)',
        marginTop: '24px',
        marginBottom: '8px',
      }}>
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p style={{
        fontSize: '16px',
        color: 'var(--ink-2)',
        lineHeight: 1.8,
        marginBottom: '16px',
      }}>
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul style={{
        paddingLeft: '20px',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li style={{
        fontSize: '15px',
        color: 'var(--ink-2)',
        lineHeight: 1.7,
      }}>
        {children}
      </li>
    ),
    strong: ({ children }) => (
      <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>
        {children}
      </strong>
    ),
    a: ({ href, children }) => (
      <a href={href} style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{
        borderLeft: '3px solid var(--accent)',
        paddingLeft: '20px',
        margin: '24px 0',
        fontStyle: 'italic',
        color: 'var(--ink-3)',
      }}>
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }} />
    ),
    ...components,
  }
}
