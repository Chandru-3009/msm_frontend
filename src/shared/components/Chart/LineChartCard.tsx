import { useMemo, useState } from 'react'
import styles from './LineChartCard.module.css'
import { DateRangePicker } from '../DateRange'

type Point = {
  label: string        // x-axis label, e.g. 'Jan'
  value: number        // y value (e.g., price)
  qty?: number         // optional secondary meta for tooltip
  vendor?: string      // optional vendor name for pricing history
  total?: number       // optional total value for pricing history
}

type DateRange = {
  from: string
  to: string
}

type LegendItem = {
  label: string
  color: string
  isDashed?: boolean
}

type Props = {
  title: string
  points: Point[]
  yFormatter?: (n: number) => string
  qtyFormatter?: (n: number | undefined) => string
  activeRange?: string
  onRangeChange?: (range: string) => void
  dateRange?: DateRange | null
  onDateRangeChange?: (range: DateRange | null) => void
  dualLine?: boolean
  primaryLabel?: string
  secondaryLabel?: string
  showPricingTooltip?: boolean  // Show pricing history format with vendor, quantity, total
}

export default function LineChartCard({
  title,
  points,
  yFormatter = (n) => `$${n.toLocaleString()}`,
  qtyFormatter = (n) => (n != null ? `${n.toLocaleString()} lbs` : ''),
  activeRange = '12m',
  onRangeChange,
  dateRange,
  onDateRangeChange,
  dualLine = false,
  primaryLabel = 'Demand (lbs)',
  secondaryLabel = 'Supply (lbs)',
  showPricingTooltip = false,
}: Props) {
  const [hover, setHover] = useState<{ x: number; yPrimary: number; ySecondary: number; i: number; leftPx: number; topPx: number } | null>(null)

  // chart dims
  const W = 800; const H = 220; const P = 25 // width, height, padding

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
    if (dualLine) {
      // For dual line mode: value is primary (demand), qty is secondary (supply)
      const allValues = [...points.map(p => p.value), ...points.map(p => p.qty || 0)]
      const dataMax = Math.max(1, ...allValues)
      const max = roundToNice(dataMax)
      const min = 0
      const xStep = (W - P * 2) / Math.max(1, points.length - 1)
      const scaleX = (i: number) => P + i * xStep
      const scaleY = (v: number) => {
        const t = (v - min) / (max - min || 1)
        return H - P - t * (H - P * 2)
      }
      
      const primaryPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(p.value)}`).join(' ')
      const secondaryPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(p.qty || 0)}`).join(' ')
      
      // Create area between the two lines
      const primaryReversed = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(points.length - 1 - i)} ${scaleY(points[points.length - 1 - i].qty || 0)}`).join(' ')
      const areaBetweenLines = `${primaryPath} ${primaryReversed.replace('M', 'L')} Z`
      
      const areaD = `${primaryPath} L ${P + (points.length - 1) * xStep} ${H - P} L ${P} ${H - P} Z`
      
      const primaryCircles = points.map((p, i) => ({ cx: scaleX(i), cy: scaleY(p.value) }))
      const secondaryCircles = points.map((p, i) => ({ cx: scaleX(i), cy: scaleY(p.qty || 0) }))
      
      const ticks = 4
      const yts = Array.from({ length: ticks + 1 }, (_, i) => {
        const v = (i / ticks) * max
        return { y: scaleY(v), v }
      })
      const xts = points.map((p, i) => ({ x: scaleX(i), label: p.label }))
      
      return { 
        primaryPath, 
        secondaryPath, 
        area: areaD, 
        areaBetween: areaBetweenLines,
        primaryCircles, 
        secondaryCircles, 
        yTicks: yts, 
        xTicks: xts, 
        maxY: max 
      }
    } else {
      // Single line mode (original)
      const dataMax = Math.max(1, ...points.map((p) => p.value))
      const max = roundToNice(dataMax)
      const min = 0
      const xStep = (W - P * 2) / Math.max(1, points.length - 1)
      const scaleX = (i: number) => P + i * xStep
      const scaleY = (v: number) => {
        const t = (v - min) / (max - min || 1)
        return H - P - t * (H - P * 2)
      }
      const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(p.value)}`).join(' ')
      const areaD = `${d} L ${P + (points.length - 1) * xStep} ${H - P} L ${P} ${H - P} Z`
      const circ = points.map((p, i) => ({ cx: scaleX(i), cy: scaleY(p.value) }))
      const ticks = 4
      const yts = Array.from({ length: ticks + 1 }, (_, i) => {
        const v = (i / ticks) * max
        return { y: scaleY(v), v }
      })
      const xts = points.map((p, i) => ({ x: scaleX(i), label: p.label }))
      return { 
        primaryPath: d, 
        secondaryPath: '', 
        area: areaD, 
        areaBetween: '',
        primaryCircles: circ, 
        secondaryCircles: [], 
        yTicks: yts, 
        xTicks: xts, 
        maxY: max 
      }
    }
  }, [points, dualLine])

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    const mouseXpx = e.clientX - rect.left
    const mouseYpx = e.clientY - rect.top
    // Convert mouse position from CSS px to SVG viewBox units
    const sx = (mouseXpx / rect.width) * W
    const sy = (mouseYpx / rect.height) * H
    // snap to nearest point in SVG coords
    const idx = chartData.xTicks.reduce((best, t, i) => {
      const bx = chartData.xTicks[best].x; const dx = Math.abs(sx - t.x)
      return dx < Math.abs(sx - bx) ? i : best
    }, 0)
    // compute tooltip pixel position relative to wrapper
    const leftPx = (chartData.xTicks[idx].x / W) * rect.width
    const topPx = (chartData.primaryCircles[idx].cy / H) * rect.height
    setHover({ 
      x: chartData.xTicks[idx].x, 
      yPrimary: chartData.primaryCircles[idx].cy, 
      ySecondary: chartData.secondaryCircles[idx]?.cy || 0,
      i: idx, 
      leftPx, 
      topPx 
    })
  }

  const legends: LegendItem[] = dualLine 
    ? [
        { label: primaryLabel, color: '#3B82F6', isDashed: false },
        { label: secondaryLabel, color: '#EF4444', isDashed: true }
      ]
    : []

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.controls}>
          {['3m', '6m', '12m', '18m'].map((r) => (
            <button key={r} className={styles.btn} aria-pressed={activeRange === r} onClick={() => onRangeChange?.(r)}>{r}</button>
          ))}
          <DateRangePicker value={dateRange || undefined} onChange={onDateRangeChange} onApply={onDateRangeChange} />
        </div>
      </div>
      <div className={styles.chartWrap}>
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
          {/* Y-axis vertical line */}
          <line x1={P} y1={P} x2={P} y2={H - P} stroke="#E5E7EB" strokeWidth="1" />
          
          {/* X-axis horizontal line */}
          <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#E5E7EB" strokeWidth="1" />
          
          {/* grid y */}
          {chartData.yTicks.map((t, idx) => (
            <g key={'gy' + idx}>
              <line x1={P} y1={t.y} x2={W - P} y2={t.y} stroke="#E5E7EB" strokeDasharray="4 4" />
              <text x={P - 8} y={t.y + 4} fontSize="12" fill="#6B7280" textAnchor="end">{yFormatter(Math.round(t.v))}</text>
            </g>
          ))}
          {/* gradient fill */}
          <defs>
            <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity=".25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lc-dual-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity=".35" />
              <stop offset="100%" stopColor="#DDD6FE" stopOpacity=".15" />
            </linearGradient>
          </defs>
          {!dualLine && <path d={chartData.area} fill="url(#lc-fill)" />}
          {dualLine && <path d={chartData.areaBetween} fill="url(#lc-dual-fill)" />}
          <path d={chartData.primaryPath} fill="none" stroke="#3b82f6" strokeWidth="2" />
          {dualLine && (
            <path d={chartData.secondaryPath} fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="6 4" />
          )}
          {/* points */}
          {chartData.primaryCircles.map((c, i) => (
            <g key={'c' + i}>
              <circle cx={c.cx} cy={c.cy} r={3} fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            </g>
          ))}
          {dualLine && chartData.secondaryCircles.map((c, i) => (
            <g key={'c2' + i}>
              <circle cx={c.cx} cy={c.cy} r={3} fill="#EF4444" stroke="#fff" strokeWidth="2" />
            </g>
          ))}
          {/* x labels */}
          {chartData.xTicks.map((t, i) => (
            <text key={'xl' + i} x={t.x} y={H - P + 20} fontSize="12" textAnchor="middle" fill="#6B7280">{t.label}</text>
          ))}
          {/* hover guideline */}
          {hover && (
            <>
              <line x1={hover.x} y1={P} x2={hover.x} y2={H - P} stroke="#CBD5E1" strokeDasharray="4 4" />
              <circle cx={hover.x} cy={hover.yPrimary} r={4} fill="#3b82f6" />
              {dualLine && <circle cx={hover.x} cy={hover.ySecondary} r={4} fill="#EF4444" />}
            </>
          )}
        </svg>
        {hover && (
          <div className={styles.tooltip} style={{ left: hover.leftPx, top: hover.topPx }}>
            <div style={{ fontWeight: 600 }}>{points[hover.i].label}</div>
            {showPricingTooltip ? (
              <>
                {points[hover.i].vendor && <div>Vendor: <span style={{ color: '#10B981', fontWeight: 600 }}>{points[hover.i].vendor}</span></div>}
                <div>Avg Price: <span style={{ color: '#A78BFA', fontWeight: 600 }}>{yFormatter(points[hover.i].value)}/lb</span></div>
                {points[hover.i].qty != null && <div>Quantity: <span style={{ color: '#A78BFA', fontWeight: 600 }}>{(points[hover.i].qty || 0).toLocaleString()} lbs</span></div>}
                {points[hover.i].total != null && <div>Total: <span style={{ color: '#A78BFA', fontWeight: 600 }}>${(points[hover.i].total || 0).toLocaleString()}</span></div>}
              </>
            ) : dualLine ? (
              <>
                <div>{primaryLabel}: <span style={{ color: '#3B82F6', fontWeight: 600 }}>{yFormatter(points[hover.i].value)}</span></div>
                <div>{secondaryLabel}: <span style={{ color: '#EF4444', fontWeight: 600 }}>{yFormatter(points[hover.i].qty || 0)}</span></div>
              </>
            ) : (
              <>
                <div>Price: <span style={{ color: '#2563EB', fontWeight: 600 }}>{yFormatter(points[hover.i].value)}</span></div>
                {points[hover.i].qty != null && <div>Quantity: <span className={styles.muted}>{qtyFormatter(points[hover.i].qty)}</span></div>}
              </>
            )}
          </div>
        )}
      </div>
      {dualLine && legends.length > 0 && (
        <div className={styles.legend}>
          {legends.map((legend, idx) => (
            <div key={idx} className={styles.legendItem}>
              <div 
                className={styles.legendColor} 
                style={{ backgroundColor: legend.color }}
              />
              <span>{legend.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}




