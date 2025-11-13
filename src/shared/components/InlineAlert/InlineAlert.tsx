import styles from './InlineAlert.module.css'

type Variant = 'warning' | 'success'

type InlineAlertProps = {
  label?: string
  value?: string
  suffix?: string
  limitLabel?: string
  limitValue?: string
  items?: { label: string; value: string }[]
  variant?: Variant
  className?: string
}

export default function InlineAlert({
  label,
  value,
  suffix,
  limitLabel = 'limit',
  limitValue,
  items,
  variant = 'warning',
  className,
}: InlineAlertProps) {
  const cn = `${styles.banner} ${styles[variant] || ''}${className ? ` ${className}` : ''}`
  return (
    <div className={cn}>
      {variant === 'warning' && (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 8v5m0 3h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      )}
      {items?.length ? (
        <div className={styles.items}>
          {items.map((it, idx) => (
            <div key={idx} className={styles.item}>
              <span className={styles.itemLabel}>{it.label}</span>
              <span className={styles.itemValue}>{it.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.text}>
          <span className={styles.strong}>{label} {value}</span>
          {suffix ? <> {suffix} </> : ' '}
          {limitValue ? <><span className={styles.muted}>{limitLabel} </span><span className={styles.strong}>{limitValue}</span>.</> : null}
        </div>
      )}
    </div>
  )
}
 

