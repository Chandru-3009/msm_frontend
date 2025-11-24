
import styles from './StatCard.module.css'
import tradeUpIcon from '@/assets/icons/appreciation_arrown_icon.svg'
import tradeDownIcon from '@/assets/icons/depreciation_arrow_icon.svg'
import Typography from '../Typography'

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
  subtext?: string
  subvalue?: string
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
  subtext,
  subvalue,
}: StatCardProps) {
  const cn = `${styles.container}${className ? ` ${className}` : ''}`
console.log(subvalue)
  const renderSubtext = () => {

    return <div className={styles.subtext}>
      {subvalue    && subtext && <img src={subvalue?.toString().includes('-') ? tradeDownIcon : tradeUpIcon} alt="" />}
     {subvalue && subtext && <Typography size="sm" color={subvalue?.toString().includes('-') ? 'danger' : 'success'}>{`${subvalue?.toString().replace('-','')}%`}</Typography>}
      {subtext && <Typography size="xs" weight="medium" color={type === 'stock' ? 'blue' : 'subvalue'}>{subtext?.replace('-', '') ?? ''}</Typography>}
    </div>

  
  }

  return (
    <div className={cn} style={style}>
      <div className={styles.titleRow}>
        <div className={styles.title}>{title}</div>
        {iconSrc && <img className={styles.icon} src={iconSrc} alt="" />}
      </div>
      <Typography size="xl"  >{value}</Typography>
      {renderSubtext()}
    </div>
  )
}


