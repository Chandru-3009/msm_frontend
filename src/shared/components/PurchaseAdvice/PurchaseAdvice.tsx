import styles from './PurchaseAdvice.module.css'

type Item = { label: string; value: string; linkText?: string; trendText?: string; trendTone?: 'up' | 'down' | 'neutral' }

type PurchaseAdviceProps = {
  headlineAmount?: string
  headlineDate?: string
  vendorName?: string
  unitPrice?: string
  avgOrderQty?: string
  avgLeadTime?: string
  items?: Item[]
  columns?: 3 | 4
  variant?: 'danger' | 'neutral'
  compareLinkText?: string
  className?: string
}

export default function PurchaseAdvice({
  headlineAmount,
  headlineDate,
  vendorName,
  unitPrice,
  avgOrderQty,
  avgLeadTime,
  items,
  columns = 4,
  variant = 'danger',
  compareLinkText = 'Compare Vendors',
  className,
}: PurchaseAdviceProps) {
  const wrapperCn = `${styles.wrapper} ${variant === 'neutral' ? styles.wrapperNeutral : ''}${className ? ` ${className}` : ''}`
  const panelCn = `${styles.panel} ${variant === 'neutral' ? styles.panelNeutral : ''} ${columns === 3 ? styles.panelCols3 : ''}`

  const panelItems: Item[] = items ?? [
    { label: 'Most Ordered Vendor', value: vendorName ?? '', linkText: compareLinkText },
    { label: 'Unit Price', value: unitPrice ?? '' },
    { label: 'Avg Order Qty', value: avgOrderQty ?? '' },
    { label: 'Avg Lead Time', value: avgLeadTime ?? '' },
  ]

  return (
    <div className={wrapperCn}>
      {headlineAmount && headlineDate && variant === 'danger' && (
        <div className={styles.headline}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 8v5m0 3h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="#B91C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Purchase <strong>{headlineAmount}</strong> by <strong>{headlineDate}</strong>
        </div>
      )}

      <div className={panelCn}>
        {panelItems.map((it, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.label}>{it.label}</div>
            <div className={styles.value}>{it.value}</div>
            {it.linkText && <a className={styles.link} href="#">{it.linkText}</a>}
            {it.trendText && <div className={`${styles.trend} ${styles[it.trendTone ?? 'neutral']}`}>{it.trendText}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

 
