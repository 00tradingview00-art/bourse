'use client'

import { useEffect, useRef } from 'react'

export interface OHLCVBar {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface Props {
  data: OHLCVBar[]
  currentPrice: number
}

export default function PriceChart({ data, currentPrice }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return

    let chart: import('lightweight-charts').IChartApi | null = null

    import('lightweight-charts').then(({ createChart, CrosshairMode, LineStyle, AreaSeries }) => {
      if (!containerRef.current) return

      chart = createChart(containerRef.current, {
        autoSize: true,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#94a3b8',
          fontFamily: 'DM Sans, system-ui, sans-serif',
          fontSize: 11,
        },
        grid: {
          vertLines: { color: '#f1f5f9' },
          horzLines: { color: '#f1f5f9' },
        },
        crosshair: {
          mode: CrosshairMode.Magnet,
          vertLine: { color: '#94a3b8', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1a4a2e' },
          horzLine: { color: '#94a3b8', width: 1, style: LineStyle.Dashed, labelBackgroundColor: '#1a4a2e' },
        },
        timeScale: { borderColor: '#e2e8f0' },
        rightPriceScale: {
          borderColor: '#e2e8f0',
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        handleScroll: { mouseWheel: false, pressedMouseMove: true },
        handleScale: { mouseWheel: false, pinch: true },
      })

      const firstClose = data[0]?.close ?? currentPrice
      const isUp       = currentPrice >= firstClose
      const lineColor  = isUp ? '#16a34a' : '#dc2626'
      const topColor   = isUp ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.08)'

      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor,
        topColor,
        bottomColor: 'rgba(255,255,255,0)',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: lineColor,
      })

      areaSeries.setData(data.map(d => ({ time: d.time as import('lightweight-charts').Time, value: d.close })))

      areaSeries.createPriceLine({
        price: currentPrice,
        color: lineColor,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: '',
      })

      chart.timeScale().fitContent()
    })

    return () => { chart?.remove() }
  }, [data, currentPrice])

  if (data.length === 0) return null

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '4px', padding: '20px 24px 12px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
          1-Year Price
        </div>
        <div style={{ fontSize: '11px', color: 'var(--ink-4)' }}>
          Prices may be delayed up to 15 min
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '260px' }} />
    </div>
  )
}
