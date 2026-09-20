import { ImageResponse } from 'next/og'

export const alt = 'Boursee — European Market Intelligence'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0a1f12',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Boursee<span style={{ color: '#4ade80' }}>.</span>
        </div>
        <div style={{ display: 'flex', fontSize: 44, marginTop: 24, color: '#d1fae5' }}>
          European Market Intelligence
        </div>
        <div style={{ display: 'flex', fontSize: 28, marginTop: 32, color: '#86efac' }}>
          Daily briefs on Euronext, DAX, FTSE and the ECB
        </div>
      </div>
    ),
    { ...size },
  )
}
