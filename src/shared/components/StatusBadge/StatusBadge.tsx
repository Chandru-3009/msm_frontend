import clsx from 'clsx'
import styles from './StatusBadge.module.css'
import Typography from '@/shared/components/Typography'

export type Variant = 'success' | 'active' | 'critical'
export type Radius = 'sm' | 'md' | 'lg' | 'full'

type Props = {
  label: string
  variant?: Variant
  radius?: Radius
  icon?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const radiusClass: Record<Radius, string> = {
  sm: styles.rSm,
  md: styles.rMd,
  lg: styles.rLg,
  full: styles.rFull,
}

export function inferStatusVariant(text: string | undefined | null): Variant {
  const s = (text || '').toLowerCase()
  if (s.includes('delivered') || s.includes('received') || s.includes('demand') || s.includes('ordered')) return 'success'
  if (s.includes('cancel') || s.includes('critical') || s.includes('error') || s.includes('failed') || s.includes('lost')) return 'critical'
  // defaults and in-progress-like statuses
  if (s.includes('open') || s.includes('processing') || s.includes('in transit') || s.includes('pending') || s.includes('ship')) return 'active'
  return 'active'
}

export default function StatusBadge({
  label,
  variant,
  radius = 'full',
  icon,
  className,
  style,
}: Props) {
  const resolvedVariant = variant ?? inferStatusVariant(label)
  return (
    <span
      className={clsx(styles.root, styles[resolvedVariant], radiusClass[radius], className)}
      style={style}
      role="status"
      aria-label={label}
    >
      {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null}
      <Typography as="span" size="xs" weight="medium" color="var(--sb-fg)">
        {label}
      </Typography>
    </span>
  )
}


