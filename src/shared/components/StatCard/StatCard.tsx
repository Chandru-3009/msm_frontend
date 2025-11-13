
import styles from './StatCard.module.css'

type StatCardType = 'stock' | 'customer' | 'vendor' | 'stockout' | 'reorder'

type StatCardProps = {
  title: string
  value: string | number
  iconSrc?: string
  className?: string
  style?: React.CSSProperties
  type?: StatCardType
  linkText?: string
  metaDate?: string
  quantity?: string
}

export default function StatCard({
  title,
  value,
  iconSrc,
  className,
  style,
  type,
  linkText,
  metaDate,
  quantity,
}: StatCardProps) {
  const cn = `${styles.container}${className ? ` ${className}` : ''}`

  const renderSubtext = () => {
    switch (type) {
      case 'stock':
        return <span className={`${styles.subtext} ${styles.link}`}>{linkText || 'All Products'}</span>
      case 'customer':
      case 'vendor':
        return (
          <span className={`${styles.subtext} ${styles.muted}`}>
            Last Order: <span className={styles.link}>{metaDate || '—'}</span>
          </span>
        )
      case 'stockout':
        return (
          <span className={styles.subtext}>
            <span className={styles.danger}>Excl.</span> <span className={styles.muted}>Incoming POs</span>
          </span>
        )
      case 'reorder':
        return (
          <span className={`${styles.subtext} ${styles.muted}`}>
            Quantity: <span className={styles.link}>{quantity || '—'}</span>
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn} style={style}>
      <div className={styles.titleRow}>
        <div className={styles.title}>{title}</div>
        {iconSrc && <img className={styles.icon} src={iconSrc} alt="" />}
      </div>
      <div className={styles.value}>{value}</div>
      {renderSubtext()}
    </div>
  )
}


