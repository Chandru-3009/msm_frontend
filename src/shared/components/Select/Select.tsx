import { useEffect, useRef, useState } from 'react'
import styles from './Select.module.css'
import downArrowIcon from '../../../assets/icons/back_icon.svg'

type Option = { value: string; label: string }

type SelectProps = {
  value: string | undefined
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
}

export default function Select({ value, onChange, options, placeholder = 'Any' }: SelectProps) {
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

  const selected = options.find(o => o.value === value)

  return (
    <div ref={rootRef} className={styles.wrap}>
      <div className={styles.root} onClick={() => setOpen(o => !o)}>
        <span className={`${styles.value} ${!selected ? styles.placeholder : ''}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={styles.caret}><img src={downArrowIcon} alt="arrow" /></span>
      </div>

      {open && (
        <div className={`${styles.menu} card`} onClick={(e) => e.stopPropagation()}>
          {options.map((o) => {
            const isSel = o.value === value
            return (
              <div
                key={o.value}
                className={`${styles.option} ${isSel ? styles.optionSelected : ''}`}
                onClick={() => { onChange(o.value); setOpen(false) }}
              >
                {o.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
