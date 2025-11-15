import { useMemo, useState } from 'react'
import styles from './LineChartCard.module.css'

type Point = {
  label: string        // x-axis label, e.g. 'Jan'
  value: number        // y value (e.g., price)
  qty?: number         // optional secondary meta for tooltip
}

type Props = {
  title: string
  points: Point[]
  yFormatter?: (n: number) => string
  qtyFormatter?: (n: number | undefined) => string
  activeRange?: string
  onRangeChange?: (range: string) => void
}

export default function LineChartCard({
  title,
  points,
  yFormatter = (n) => `$${n.toLocaleString()}`,
  qtyFormatter = (n) => (n != null ? `${n.toLocaleString()} lbs` : ''),
  activeRange = '12m',
  onRangeChange,
}: Props) {
  const [hover, setHover] = useState<{ x: number; y: number; i: number; leftPx: number; topPx: number } | null>(null)

  // chart dims
  const W = 800; const H = 220; const P = 36 // width, height, padding

  const { path, area, circles, yTicks, xTicks, maxY } = useMemo(() => {
    const max = Math.max(1, ...points.map((p) => p.value))
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
    return { path: d, area: areaD, circles: circ, yTicks: yts, xTicks: xts, maxY: max }
  }, [points])

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
    const mouseXpx = e.clientX - rect.left
    const mouseYpx = e.clientY - rect.top
    // Convert mouse position from CSS px to SVG viewBox units
    const sx = (mouseXpx / rect.width) * W
    const sy = (mouseYpx / rect.height) * H
    // snap to nearest point in SVG coords
    const idx = xTicks.reduce((best, t, i) => {
      const bx = xTicks[best].x; const dx = Math.abs(sx - t.x)
      return dx < Math.abs(sx - bx) ? i : best
    }, 0)
    // compute tooltip pixel position relative to wrapper
    const leftPx = (xTicks[idx].x / W) * rect.width
    const topPx = (circles[idx].cy / H) * rect.height
    setHover({ x: xTicks[idx].x, y: circles[idx].cy, i: idx, leftPx, topPx })
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.controls}>
          {['3m', '6m', '12m', '18m'].map((r) => (
            <button key={r} className={styles.btn} aria-pressed={activeRange === r} onClick={() => onRangeChange?.(r)}>{r}</button>
          ))}
          <button className={styles.btn} aria-pressed="false">Jan 10, 2025 – Jan 16, 2025</button>
        </div>
      </div>
      <div className={styles.chartWrap}>
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
          {/* grid y */}
          {yTicks.map((t, idx) => (
            <g key={'gy' + idx}>
              <line x1={P} y1={t.y} x2={W - P} y2={t.y} stroke="#E5E7EB" strokeDasharray="4 4" />
              <text x={8} y={t.y + 4} fontSize="12" fill="#6B7280">{yFormatter(idx === yTicks.length - 1 ? 0 : Math.round((t.v)))}</text>
            </g>
          ))}
          {/* gradient fill */}
          <defs>
            <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity=".25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#lc-fill)" />
          <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2" />
          {/* points */}
          {circles.map((c, i) => (
            <g key={'c' + i}>
              <circle cx={c.cx} cy={c.cy} r={3} fill="#3b82f6" stroke="#fff" strokeWidth="2" />
            </g>
          ))}
          {/* x labels */}
          {xTicks.map((t, i) => (
            <text key={'xl' + i} x={t.x} y={H - P + 20} fontSize="12" textAnchor="middle" fill="#6B7280">{t.label}</text>
          ))}
          {/* hover guideline */}
          {hover && (
            <>
              <line x1={hover.x} y1={P} x2={hover.x} y2={H - P} stroke="#CBD5E1" strokeDasharray="4 4" />
              <circle cx={hover.x} cy={hover.y} r={4} fill="#3b82f6" />
            </>
          )}
        </svg>
        {hover && (
          <div className={styles.tooltip} style={{ left: hover.leftPx, top: hover.topPx }}>
            <div style={{ fontWeight: 600 }}>{points[hover.i].label}</div>
            <div>Price: <span style={{ color: '#2563EB', fontWeight: 600 }}>{yFormatter(points[hover.i].value)}</span></div>
            {points[hover.i].qty != null && <div>Quantity: <span className={styles.muted}>{qtyFormatter(points[hover.i].qty)}</span></div>}
          </div>
        )}
      </div>
    </div>
  )
}


