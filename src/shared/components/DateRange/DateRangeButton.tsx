import { useEffect, useRef, useState } from 'react'

type Props = {
  label?: string
  value?: { from?: string; to?: string }
  onChange?: (v: { from?: string; to?: string } | undefined) => void
}

export default function DateRangeButton({ label = 'Custom Date', value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<{ from?: string; to?: string }>(value || {})
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => setDraft(value || {}), [value])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const text = draft.from && draft.to ? `${draft.from} – ${draft.to}` : label

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="btn" onClick={() => setOpen((o) => !o)}>{text}</button>
      {open && (
        <div className="card" style={{ position: 'absolute', top: 40, right: 0, padding: 12, width: 260, display: 'grid', gap: 8 }}>
          <label style={{ display: 'grid', gap: 4 }}>
            <span className="small">From</span>
            <input className="input" type="date" value={draft.from || ''} onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))} />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            <span className="small">To</span>
            <input className="input" type="date" value={draft.to || ''} onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))} />
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn" onClick={() => { setDraft({}); onChange?.(undefined) }}>Clear</button>
            <div className="spacer" />
            <button className="btn btn-primary" onClick={() => { onChange?.(draft); setOpen(false) }}>Apply</button>
          </div>
        </div>
      )}
    </div>
  )
}


