import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export default function Button({ variant = 'secondary', className, children, ...rest }: ButtonProps) {
  const cn = `${styles.btn} ${styles[variant]}${className ? ` ${className}` : ''}`
  return (
    <button className={cn} {...rest}>
      {children}
    </button>
  )
}


