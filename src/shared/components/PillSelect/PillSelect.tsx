import { useState } from 'react'

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
}: Props) {
  const [open, setOpen] = useState(false)
  const label =
    (value ? (options.find((o) => o.value === value)?.label ?? value) : '') ||
    placeholder ||
    ''

  const withAll: Option[] = allOptionLabel != null ? [{ value: '', label: allOptionLabel }, ...options] : options

  return (
    <div
      style={{ position: 'relative', ...style }}
      className={className}
      onBlur={(e) => {
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
        <div className="dropdown" role="listbox">
          {withAll.map((opt) => (
            <div
              key={opt.value + '|' + opt.label}
              className="dropdown-item"
              role="option"
              aria-selected={value === opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


