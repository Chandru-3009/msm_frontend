import stockIcon from '@/assets/icons/stock_icon.svg'
import styles from './StatCard.module.css'

type StatCardProps = {
  title: string
  value: string | number
  actionLabel?: string
  actionHref?: string
  onActionClick?: () => void
  iconSrc?: string
  className?: string
  style?: React.CSSProperties
}

export default function StatCard({
  title,
  value,
  actionLabel,
  actionHref,
  onActionClick,
  iconSrc,
  className,
  style,
}: StatCardProps) {
  const cn = `${styles.container}${className ? ` ${className}` : ''}`
  const icon = iconSrc || stockIcon

  return (
    <div className={cn} style={style}>
      <div className={styles.titleRow}>
        <div className={styles.title}>{title}</div>
        <img className={styles.icon} src={icon} alt="" />
      </div>
      <div className={styles.value}>{value}</div>
      {actionLabel ? (
        actionHref ? (
          <a className={styles.action} href={actionHref}>{actionLabel}</a>
        ) : (
          <button className={styles.actionButton} type="button" onClick={onActionClick}>
            {actionLabel}
          </button>
        )
      ) : null}
    </div>
  )
}


