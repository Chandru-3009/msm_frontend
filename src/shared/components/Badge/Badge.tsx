import styles from './Badge.module.css'

type Variant = 'neutral' | 'success' | 'danger' | 'warning'

type BadgeProps = {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export default function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const cn = `${styles.badge} ${styles[variant]}${className ? ` ${className}` : ''}`
  return <span className={cn}>{children}</span>
}


