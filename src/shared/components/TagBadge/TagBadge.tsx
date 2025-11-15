import clsx from 'clsx'
import styles from './TagBadge.module.css'

type Radius = 'sm' | 'md' | 'lg' | 'full'

type Props = {
  label: string
  radius?: Radius
  icon?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  colorIndex?: number
  seed?: string
  isSamecolor: number
}

const radiusClass: Record<Radius, string> = {
  sm: styles.rSm,
  md: styles.rMd,
  lg: styles.rLg,
  full: styles.rFull,
}

const palette = [
  '#B45309', // brown/gold
  '#2563EB', // blue
  '#7C3AED', // purple
  '#16A34A', // green
  '#0EA5E9', // cyan
  '#EC4899', // pink
  '#F59E0B', // orange
  '#111827', // near-black
]

function hashToIndex(s: string, mod: number) {


  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i)
  return Math.abs(h) % mod

}

export default function TagBadge({
  label,
  radius = 'full',
  icon,
  className,
  style,
  colorIndex,
  seed,
  isSamecolor
}: Props) {
  const idx =  typeof colorIndex === 'number' ? colorIndex :  hashToIndex((seed || label || '').toLowerCase(), palette.length)
  const fg = palette[ isSamecolor !== 0 ? isSamecolor : idx % palette.length]

  return (
    <span
      className={clsx(styles.root, radiusClass[radius], className)}
      style={{ ...style, color: fg }}
      role="note"
      aria-label={label}
      title={label}
    >
      {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null}
      <span>{label}</span>
    </span>
  )
}


