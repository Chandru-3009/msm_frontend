import styles from './Avatar.module.css'

type AvatarProps = {
  firstName?: string
  lastName?: string
  imageUrl?: string | null
  size?: number
  className?: string
  alt?: string
}

export default function Avatar({
  firstName,
  lastName,
  imageUrl,
  size = 48,
  className,
  alt,
}: AvatarProps) {
  const initials = `${(firstName?.[0] ?? '').toUpperCase()}${(lastName?.[0] ?? '').toUpperCase()}` || 'U'
  const style: React.CSSProperties = { width: size, height: size, fontSize: Math.max(12, Math.floor(size * 0.4)) }

  return (
    <div className={`${styles.avatar}${className ? ` ${className}` : ''}`} style={style} aria-label={alt || `${firstName ?? ''} ${lastName ?? ''}`.trim()}>
      {imageUrl ? (
        <img className={styles.image} src={imageUrl} alt={alt || initials} />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}


