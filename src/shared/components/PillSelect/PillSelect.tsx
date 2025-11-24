import { useRef, useState, useEffect } from 'react'

type Option = { value: string; label: string }

type Props = {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  allOptionLabel?: string
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
  // Infinite scroll props
  onScrollBottom?: () => void
  loading?: boolean
}

export default function PillSelect({
  value,
  onChange,
  options,
  placeholder,
  allOptionLabel,
  className,
  style,
  ariaLabel,
  onScrollBottom,
  loading = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const selectingRef = useRef(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const label =
    (value ? (options.find((o) => o.value === value)?.label ?? value) : '') ||
    placeholder ||
    ''

  const withAll: Option[] = allOptionLabel != null ? [{ value: '', label: allOptionLabel }, ...options] : options

  // Infinite scroll detection
  useEffect(() => {
    const dropdown = dropdownRef.current
    if (!dropdown || !onScrollBottom) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = dropdown
      // Trigger when scrolled within 50px of bottom
      if (scrollHeight - scrollTop - clientHeight < 50) {
        onScrollBottom()
      }
    }

    dropdown.addEventListener('scroll', handleScroll)
    return () => dropdown.removeEventListener('scroll', handleScroll)
  }, [onScrollBottom])

  return (
    <div
      style={{ position: 'relative', ...style }}
      className={className}
      onBlur={(e) => {
        if (selectingRef.current) {
          selectingRef.current = false
          return
        }
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <div
        className="select select-pill select-custom"
        role="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((o) => !o)
          }
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        <span>{label}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && (
        <div 
          ref={dropdownRef}
          className="dropdown" 
          role="listbox"
          style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
          {withAll.map((opt) => (
            <div
              key={opt.value + '|' + opt.label}
              className="dropdown-item"
              role="option"
              aria-selected={value === opt.value}
              tabIndex={0}
              onMouseDown={(e) => {
                // Ensure selection fires before blur closes the dropdown
                e.preventDefault()
                selectingRef.current = true
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {opt.label}
            </div>
          ))}
          {loading && (
            <div className="dropdown-item" style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
              Loading more...
            </div>
          )}
        </div>
      )}
    </div>
  )
}


