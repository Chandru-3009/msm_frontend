import TagBadge from '../TagBadge'
import Typography from '../Typography'
import styles from './ListCard.module.css'
import stockIcon from '@/assets/icons/stock_icon.svg'
import attentionIcon from '@/assets/icons/attention_icon.svg'
import trolleyIcon from '@/assets/icons/trolly_icon.svg'
import dollarIcon from '@/assets/icons/dollar_cion.svg'

export type ListItem = {
  name: string
  badge?: string
  rightPrimary?: string
  rightSecondary?: string
  rightTertiary?: string
}

type Props = {
  title: string
  subtitle?: string
  items: ListItem[]
  viewAllText?: string
  type?: 'critical-stock' | 'fast-moving' | 'slow-moving' | 'top-quoted' | 'top-customers' | 'top-vendors'
}

export default function ListCard({ title, subtitle, items, viewAllText = 'View All', type }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
       
         <Typography as="span" size="md" weight="medium" color="heading">{viewAllText}</Typography>
       
      </div>
      <div className={styles.list}>
        {items.map((it, idx) => (
          <div key={it.name + '|' + idx} className={styles.row}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography as="span" size="md" weight="medium">{ it.rightTertiary ? it.badge : it.name}</Typography>
              {it.badge && <TagBadge  isSamecolor={type === 'top-customers' ? 3 : type === 'top-vendors' ? 1 : 0} label= {it.rightTertiary ? `${it.name} ${type === 'top-customers' ? 'Revenue' : 'purchased'}` : it.badge} radius="sm" />}
              </div>
            </div>
            
            {it.rightPrimary && <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={ it.rightTertiary ? trolleyIcon : stockIcon} alt="" />
              <Typography as="span" size="md" weight="medium" color="secondary">{it.rightPrimary}</Typography>
            </span>}
            {it.rightSecondary && <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={ it.rightTertiary ? stockIcon : attentionIcon} alt="" />
              <Typography as="span" size="md" weight="medium" color="secondary">{it.rightSecondary}</Typography>
            </span>}
            {it.rightTertiary && <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={dollarIcon} alt="" />
              <Typography as="span" size="md" weight="medium" color="secondary">{it.rightTertiary}</Typography>
            </span>}
          </div>
          
        ))}
      </div>
    </div>
  )
}


