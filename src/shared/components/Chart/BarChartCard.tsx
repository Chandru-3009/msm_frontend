import { useMemo, useState } from 'react'
import styles from './BarChartCard.module.css'

type BarPoint = {
  label: string        // x-axis label, e.g. 'CCT', 'HOU', 'Reserved'
  value: number        // y value (quantity in lbs)
  color?: string       // optional custom color for bar
}

type Props = {
  title: string
  bars: BarPoint[]
  yLabel?: string      // Y-axis label (e.g., "Quantity (lbs)")
  summaryStats?: {
    inHand?: number
    reserved?: number
    allocated?: number
  }
}

export default function BarChartCard({
  title,
  bars,
  yLabel = 'Quantity (lbs)',
  summaryStats,
}: Props) {
  const [hover, setHover] = useState<{ x: number; y: number; i: number; leftPx: number; topPx: number } | null>(null)

  // chart dims
  const W = 750; const H = 220; const P = 25 

  // Helper function to round to nice numbers
  const roundToNice = (value: number): number => {
    if (value === 0) return 0
    
    // Add 5% padding
    value = value * 1.05
    
    // Get the order of magnitude
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)) - 1)
    
    // Round up to nearest nice increment (10, 20, 50, 100, 200, 500, etc.)
    return Math.ceil(value / magnitude) * magnitude
  }

  const chartData = useMemo(() => {
    const filteredBars = bars.filter(b => b.value !== 0)
    const dataMax = Math.max(1, ...filteredBars.map(b => b.value))
    const max = roundToNice(dataMax)
    const min = 0

    const barWidth = (W - P * 2) / bars.length * 0.6 // 60% width for spacing
    const barSpacing = (W - P * 2) / bars.length
    
    const scaleY = (v: number) => {
      const t = (v - min) / (max - min || 1)
      return H - P - t * (H - P * 2)
    }

    const barData = bars.map((bar, i) => {
      const x = P + i * barSpacing + (barSpacing - barWidth) / 2
      const height = scaleY(0) - scaleY(bar.value)
      const y = scaleY(bar.value)
      
      // Use provided color or default to blue
      const color = bar.color || '#3B82F6'

      return {
        x,
        y,
        width: barWidth,
        height: Math.max(0, height),
        value: bar.value,
        label: bar.label,
        color,
      }
    })

    const ticks = 6
    const yTicks = Array.from({ length: ticks + 1 }, (_, i) => {
      const v = (i / ticks) * max
      return { y: scaleY(v), v }
    })

    const xTicks = bars.map((bar, i) => ({
      x: P + i * barSpacing + barSpacing / 2,
      label: bar.label,
    }))

    return { barData, yTicks, xTicks, maxY: max }
  }, [bars])

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    const mouseXpx = e.clientX - rect.left
    const mouseYpx = e.clientY - rect.top
    
    // Convert mouse position from CSS px to SVG viewBox units
    const sx = (mouseXpx / rect.width) * W
    const sy = (mouseYpx / rect.height) * H

    // Find which bar we're hovering over (check if mouse is within bar bounds or near it)
    // Add some margin for easier hovering
    const hoveredBarIndex = chartData.barData.findIndex(bar => {
      const margin = 5 // pixels in SVG coordinates
      return sx >= bar.x - margin && 
             sx <= bar.x + bar.width + margin && 
             sy >= bar.y - margin && 
             sy <= H - P + 20 // Include label area below
    })

    if (hoveredBarIndex >= 0) {
      const bar = chartData.barData[hoveredBarIndex]
      // Position tooltip at top of bar (bar.y is the top of the bar)
      // Convert SVG coordinates to container pixel coordinates
      // Tooltip uses transform: translate(-50%, -100%) which positions it above the point
      // So we position at the top of the bar, and the tooltip will appear above it
      const topPx = (bar.y / H) * rect.height // Top of the bar in container pixels
      const leftPx = ((bar.x + bar.width / 2) / W) * rect.width // Center of bar in container pixels
      
      setHover({
        x: bar.x + bar.width / 2,
        y: bar.y,
        i: hoveredBarIndex,
        leftPx: leftPx, // Relative to container
        topPx: topPx, // Relative to container (top of bar - tooltip appears above via transform)
      })
    } else {
      setHover(null)
    }
  }

  const yFormatter = (n: number) => `${n.toLocaleString()}`

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.chartWrap}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          onMouseMove={handleMove}
          onMouseLeave={() => setHover(null)}
        >
          {/* Y-axis vertical line */}
          <line x1={P} y1={P} x2={P} y2={H - P} stroke="#E5E7EB" strokeWidth="1" />

          {/* X-axis horizontal line */}
          <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#E5E7EB" strokeWidth="1" />

          {/* Y-axis label */}
         

          {/* Grid lines */}
          {chartData.yTicks.map((t, idx) => (
            <g key={'gy' + idx}>
              <line x1={P} y1={t.y} x2={W - P} y2={t.y} stroke="#E5E7EB" strokeDasharray="4 4" />
              <text x={P - 8} y={t.y + 4} fontSize="12" fill="#6B7280" textAnchor="end">
                {yFormatter(Math.round(t.v))}
              </text>
            </g>
          ))}

          {/* Bars */}
          {chartData.barData.map((bar, i) => (
            <g key={`bar-${i}`}>
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                fill={hover?.i === i ? bar.color : bar.color}
                opacity={hover?.i === i ? 0.9 : 0.8}
                style={{ transition: 'opacity 0.2s' }}
              />
              {/* Bar label */}
              <text
                x={bar.x + bar.width / 2}
                y={H - P + 18}
                fontSize="12"
                fill="#6B7280"
                textAnchor="middle"
              >
                {bar.label}
              </text>
            </g>
          ))}

          {/* Hover guideline and circle indicator */}
          {hover && (
            <>
              <line
                x1={hover.x}
                y1={P}
                x2={hover.x}
                y2={H - P}
                stroke="#CBD5E1"
                strokeDasharray="4 4"
              />
              <circle
                cx={hover.x}
                cy={hover.y}
                r={4}
                fill={chartData.barData[hover.i].color}
              />
            </>
          )}
        </svg>

        {/* Tooltip */}
        {hover && (
          <div
            className={styles.tooltip}
            style={{ left: hover.leftPx, top: hover.topPx }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{chartData.barData[hover.i].label}</div>
            <div style={{ color: '#6B7280', fontSize: 11 }}>
              {chartData.barData[hover.i].value.toLocaleString()} lbs
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {summaryStats && (
        <div className={styles.summaryStats}>
          {summaryStats.inHand != null && (
            <div>
              <div className={styles.summaryLabel}>In Hand</div>
              <div className={styles.summaryValue} style={{ color: '#3B82F6' }}>
                {summaryStats.inHand.toLocaleString()} lbs
              </div>
            </div>
          )}
          {summaryStats.reserved != null && (
            <div>
              <div className={styles.summaryLabel}>Reserved</div>
              <div className={styles.summaryValue} style={{ color: '#F59E0B' }}>
                {summaryStats.reserved.toLocaleString()} lbs
              </div>
            </div>
          )}
          {summaryStats.allocated != null && (
            <div>
              <div className={styles.summaryLabel}>Allocated</div>
              <div className={styles.summaryValue} style={{ color: '#10B981' }}>
                {summaryStats.allocated.toLocaleString()} lbs
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

