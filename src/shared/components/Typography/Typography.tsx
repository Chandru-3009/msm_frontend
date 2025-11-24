import clsx from 'clsx'
import { ReactNode } from 'react'
import styles from './Typography.module.css'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type Weight = 'regular' | 'medium' | 'semibold' | 'bold'
type ColorToken = 'default' | 'muted' | 'primary' | 'danger' | 'heading' | 'subtitle' | 'secondary' | 'success'| 'subvalue' | 'blue'

type Props<TTag extends keyof JSX.IntrinsicElements = 'span'> = {
  as?: TTag
  size?: Size
  weight?: Weight
  color?: ColorToken | string
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
  clamp?: number
  className?: string
  style?: React.CSSProperties
  children: ReactNode
} & Omit<JSX.IntrinsicElements[TTag], 'color' | 'style' | 'className'>

const sizeClass: Record<Size, string> = {
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  '2xl': styles.size2xl,
  '3xl': styles.size3xl,
}

const weightClass: Record<Weight, string> = {
  regular: styles.wRegular,
  medium: styles.wMedium,
  semibold: styles.wSemibold,
  bold: styles.wBold,
}

const colorClass: Record<ColorToken, string> = {
  default: styles.cDefault,
  muted: styles.cMuted,
  primary: styles.cPrimary,
  danger: styles.cDanger,
  heading: styles.cHeading,
  subtitle: styles.cSubtitle,
  secondary: styles.cSecondary,
  success: styles.cSuccess,
  subvalue: styles.cSubvalue,
  blue: styles.cBlue
}

const alignClass = {
  left: styles.aLeft,
  center: styles.aCenter,
  right: styles.aRight,
} as const

export default function Typography<TTag extends keyof JSX.IntrinsicElements = 'span'>(
  {
    as,
    size = 'md',
    weight = 'regular',
    color = 'default',
    align = 'left',
    truncate,
    clamp,
    className,
    style,
    children,
    ...rest
  }: Props<TTag>
) {
  const Component = (as || 'span') as any

  const isTokenColor = typeof color === 'string' && (colorClass as any)[color]
  const tokenColorClass = (isTokenColor ? (color as ColorToken) : 'default') as ColorToken

  const inlineStyle: React.CSSProperties & { WebkitLineClamp?: number | undefined } = { ...style } as React.CSSProperties & { WebkitLineClamp?: number | undefined }
  if (!isTokenColor && typeof color === 'string') inlineStyle.color = color
  if (clamp != null) inlineStyle.WebkitLineClamp = clamp

  return (
    <Component
      className={clsx(
        styles.root,
        sizeClass[size],
        weightClass[weight],
        colorClass[tokenColorClass],
        alignClass[align],
        truncate && styles.truncate,
        clamp != null && styles.clamp,
        className
      )}
      style={inlineStyle}
      {...rest}
    >
      {children}
    </Component>
  )
}


