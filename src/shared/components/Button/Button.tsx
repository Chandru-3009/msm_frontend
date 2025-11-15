import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export default function Button({
  variant = 'secondary',
  className,
  children,
  icon,
  iconPosition = 'left',
  ...rest
}: ButtonProps) {
  const cn = `${styles.btn} ${styles[variant]}${className ? ` ${className}` : ''}`
  return (
    <button className={cn} {...rest}>
      {icon && iconPosition === 'left' ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.label}>{children}</span>
      {icon && iconPosition === 'right' ? <span className={styles.icon}>{icon}</span> : null}
    </button>
  )
}


