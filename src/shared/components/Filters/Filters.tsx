import './Filters.css'
import { useEffect, useMemo, useState } from 'react'
import MultiSelect from './MultiSelect'

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
    // Outside chips reflect applied value with separate chips per type
    value.types.forEach((t) => results.push({ key: `type:${t}`, label: t }))
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
    if (kind === 'type') onChange({ ...value, types: value.types.filter((t) => t !== id) })
    if (kind === 'vr') onChange({ ...value, valueRangeKey: undefined })
    if (kind === 'd') onChange({ ...value, daysKey: undefined })
  }

  return (
    <div className="filters">
      <button className="btn" onClick={() => setOpen((o) => !o)}>
        {/* simple icon mimic */}
        <span style={{ marginRight: 6 }}>☰</span> Filters
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
              <select
                className="select"
                value={draft.valueRangeKey ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, valueRangeKey: e.target.value || undefined }))}
              >
                <option value="">Any</option>
                {valueRanges.map((vr) => (
                  <option key={vr.key} value={vr.key}>{vr.label}</option>
                ))}
              </select>
            </div>
          )}

          {daysOptions && daysOptions.length > 0 && (
            <div className="field">
              <div className="label">Days Until Stockout</div>
              <select
                className="select"
                value={draft.daysKey ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, daysKey: e.target.value || undefined }))}
              >
                <option value="">Any</option>
                {daysOptions.map((d) => (
                  <option key={d.key} value={d.key}>{d.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="actions">
            <button
              className="btn"
              onClick={() => {
                setDraft({ types: [], valueRangeKey: undefined, daysKey: undefined })
                onChange({ types: [], valueRangeKey: undefined, daysKey: undefined })
              }}
            >
              Clear All
            </button>
            <div className="spacer" />
            <button
              className="btn btn-primary"
              onClick={() => {
                onChange(draft)
                setOpen(false)
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


