import './Filters.css'
import { useEffect, useMemo, useState } from 'react'
import MultiSelect from './MultiSelect'
import Select from '@/shared/components/Select/Select'
import Button from '@/shared/components/Button'

export type ValueRangeOption = { key: string; label: string; min?: number; max?: number }
export type DaysOption = { key: string; label: string; days: number }

export type FiltersValue = {
  types: string[]
  valueRangeKey?: string
  daysKey?: string
}

type Props = {
  typeOptions: string[]
  valueRanges?: ValueRangeOption[]
  daysOptions?: DaysOption[]
  value: FiltersValue
  onChange: (value: FiltersValue) => void
}

export default function Filters({ typeOptions, valueRanges, daysOptions, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<FiltersValue>(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  const chips = useMemo(() => {
    const results: { key: string; label: string }[] = []
    // Outside chips: show a single summary chip when multiple types are selected
    if (value.types.length > 1) {
      results.push({ key: 'types', label: `${value.types.length} selected` })
    } else {
      value.types.forEach((t) => results.push({ key: `type:${t}`, label: t }))
    }
    if (value.valueRangeKey && valueRanges) {
      const opt = valueRanges.find((v) => v.key === value.valueRangeKey)
      if (opt) results.push({ key: `vr:${opt.key}`, label: opt.label })
    }
    if (value.daysKey && daysOptions) {
      const opt = daysOptions.find((d) => d.key === value.daysKey)
      if (opt) results.push({ key: `d:${opt.key}`, label: opt.label })
    }
    return results
  }, [value, valueRanges, daysOptions])

  const removeChip = (chipKey: string) => {
    const [kind, id] = chipKey.split(':')
    if (chipKey === 'types') onChange({ ...value, types: [] })
    if (kind === 'type') onChange({ ...value, types: value.types.filter((t) => t !== id) })
    if (kind === 'vr') onChange({ ...value, valueRangeKey: undefined })
    if (kind === 'd') onChange({ ...value, daysKey: undefined })
  }

  return (
    <div className="filters">
      <button className="trigger" onClick={() => setOpen((o) => !o)}>
        <svg className="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>Filters</span>
      </button>

      <div className="chips">
        {chips.map((c) => (
          <span key={c.key} className="chip">
            {c.label}
            <button aria-label="Remove" className="chip-x" onClick={() => removeChip(c.key)}>×</button>
          </span>
        ))}
      </div>

      {open && (
        <div className="filters-popover card">
          {!!typeOptions.length && (
            <div className="field">
              <div className="label">Product Type/Material</div>
              <MultiSelect
                options={typeOptions}
                value={draft.types}
                onChange={(next) => setDraft((d) => ({ ...d, types: next }))}
                placeholder="Select types"
              />
            </div>
          )}

          {valueRanges && valueRanges.length > 0 && (
            <div className="field">
              <div className="label">Value Range</div>
              <Select
                value={draft.valueRangeKey}
                onChange={(v) => setDraft((d) => ({ ...d, valueRangeKey: v || undefined }))}
                options={(valueRanges ?? []).map(vr => ({ value: vr.key, label: vr.label }))}
              />
            </div>
          )}

          {daysOptions && daysOptions.length > 0 && (
            <div className="field">
              <div className="label">Days Until Stockout</div>
              <Select
                value={draft.daysKey}
                onChange={(v) => setDraft((d) => ({ ...d, daysKey: v || undefined }))}
                options={(daysOptions ?? []).map(d => ({ value: d.key, label: d.label }))}
              />
            </div>
          )}

          <div className="actions">
            <Button
              variant="secondary"
              onClick={() => {
                setDraft({ types: [], valueRangeKey: undefined, daysKey: undefined })
                onChange({ types: [], valueRangeKey: undefined, daysKey: undefined })
              }}
            >
              Clear All
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onChange(draft)
                setOpen(false)
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


