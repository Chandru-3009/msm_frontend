import styles from './InlineStats.module.css'

type Trend = 'up' | 'down' | 'neutral'

type Segment = {
  label: string // e.g., Quote(6000 lbs)
  trend?: Trend
}

type InlineStatsProps = {
  prefix?: string // e.g., Last 7 days:
  segments: Segment[]
  className?: string
}

export default function InlineStats({ prefix, segments, className }: InlineStatsProps) {
  return (
    <div className={`${styles.wrap}${className ? ` ${className}` : ''}`}>
      {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
      <span className={styles.segments}>
        {segments.map((seg, i) => (
          <span key={i} className={styles.segments}>
            {i > 0 && <span className={styles.pipe}>|</span>}
            <span className={styles.seg}>
              <span>{seg.label}</span>
              {seg.trend && <span className={styles[seg.trend]}>{seg.trend === 'up' ? '↗' : seg.trend === 'down' ? '↘' : '↔'}</span>}
            </span>
          </span>
        ))}
      </span>
    </div>
  )
}


