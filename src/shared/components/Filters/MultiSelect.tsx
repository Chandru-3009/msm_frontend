import { useEffect, useRef, useState } from 'react'
import downArrowIcon from '../../../assets/icons/back_icon.svg'
import styles from './MultiSelect.module.css'
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
    <div ref={rootRef} className={styles.ms} onClick={() => setOpen((o) => !o)}>
      <div className={styles.msValue}>
        {value.length === 0 && <span className={styles.msPlaceholder}>{placeholder}</span>}
        {value.map((v) => (
          <span key={v} className="chip" onClick={(e) => e.stopPropagation()}>
            {v}
            <button className="chip-x" aria-label="Remove" onClick={(e) => { e.stopPropagation(); toggleOption(v) }}>×</button>
          </span>
        ))}
      </div>
      <span className={styles.msCaret}><img src={downArrowIcon} alt="down arrow" /></span>

      {open && (
        <div className={`${styles.msMenu} card`} onClick={(e) => e.stopPropagation()}>
          {options.map((opt) => {
            const selected = value.includes(opt)
            return (
              <div
                key={opt}
                className={`${styles.msOption} ${selected ? styles.msOptionSelected : ''}`}
                onClick={() => toggleOption(opt)}
              >
                <span className={styles.msCheck}>{selected ? '✓' : ''}</span>
                <span>{opt}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


