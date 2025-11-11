import { useEffect, useRef, useState } from 'react'

type Props = {
  options: string[]
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

export default function MultiSelect({ options, value, onChange, placeholder = 'Select…' }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const toggleOption = (opt: string) => {
    const exists = value.includes(opt)
    onChange(exists ? value.filter((v) => v !== opt) : [...value, opt])
  }

  return (
    <div ref={rootRef} className="ms" onClick={() => setOpen((o) => !o)}>
      <div className="ms-value">
        {value.length === 0 && <span className="ms-placeholder">{placeholder}</span>}
        {value.map((v) => (
          <span key={v} className="chip" onClick={(e) => e.stopPropagation()}>
            {v}
            <button className="chip-x" aria-label="Remove" onClick={(e) => { e.stopPropagation(); toggleOption(v) }}>×</button>
          </span>
        ))}
      </div>
      <span className="ms-caret">▾</span>

      {open && (
        <div className="ms-menu card" onClick={(e) => e.stopPropagation()}>
          {options.map((opt) => {
            const selected = value.includes(opt)
            return (
              <div
                key={opt}
                className={`ms-option ${selected ? 'ms-option-selected' : ''}`}
                onClick={() => toggleOption(opt)}
              >
                <span className="ms-check">{selected ? '✓' : ''}</span>
                <span>{opt}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


