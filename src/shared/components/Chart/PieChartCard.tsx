import styles from './PieChartCard.module.css'

 type Slice = { label: string; value: number; color: string }

 type Props = {
   title: string
   data: Slice[]
   totalCenterLabel?: string
   showlabels?: boolean
   showvalues?: boolean
   showtotal?: boolean
   legendColumns?: number
   gapPx?: number
 }

 export default function PieChartCard({ title, data, totalCenterLabel, showlabels = true, showvalues = true, legendColumns = 1, gapPx = 2 }: Props) {
  const total = data.reduce((s, d) => s + (Number.isFinite(d.value) ? d.value : 0), 0)
  const radius = 80
  const circumference = 2 * Math.PI * radius
  let acc = 0

  return (
    <div className={styles.card}>
      <div style={{ gridColumn: '1 / -1' }}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>{title}</div>
          </div>
        </div>
      </div>
      <div className={styles.chartWrap}>
        <svg width={200} height={200} viewBox="0 0 200 200" role="img" aria-label={title}>
          <g transform="translate(100,100)">
             {data.map((s, i) => {
              const fraction = total > 0 ? s.value / total : 0
               const dash = Math.max(0, fraction * circumference - gapPx)
              const gap = circumference - dash
              const rotate = (acc / total) * 360
              acc += s.value
              return (
                <circle
                  key={s.label + i}
                  r={radius}
                  cx={0}
                  cy={0}
                  fill="transparent"
                  stroke={s.color}
                  strokeWidth={24}
                  strokeDasharray={`${dash} ${gap}`}
                  transform={`rotate(${rotate - 90})`}
                   strokeLinecap="round"
                   
                 >
                   <title>{`${s.label}: ${s.value.toLocaleString()} (${total > 0 ? Math.round((s.value / total) * 100) : 0}%)`}</title>
                 </circle>
              )
            })}
            <circle r={radius - 24} cx={0} cy={0} fill="#fff" />
            <text x="0" y="-4" textAnchor="middle" fontSize="20" fontWeight="600" fill="#111827">
              {showlabels && totalCenterLabel ? totalCenterLabel : ''}
            </text>
          </g>
        </svg>
      </div>
       <div className={styles.legend} style={{ gridTemplateColumns: legendColumns > 1 ? `repeat(${legendColumns}, max-content)` : undefined }}>
        {data.map((s) => (
          <div key={s.label} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: s.color }} />
            <span>{s.label}</span>
            {showvalues && s.value && <span style={{ marginLeft: 'auto', color: '#374151' }}>{s.value.toLocaleString()}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}


