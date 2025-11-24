import { useEffect, useRef, useState } from 'react'
import styles from './DateRangePicker.module.css'

type DateRange = {
  from: string
  to: string
}

type Props = {
  value?: DateRange
  onChange?: (range: DateRange | null) => void
  onApply?: (range: DateRange | null) => void
}

type PresetType = 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'this-year' | 'last-year'

export default function DateRangePicker({ value, onChange, onApply }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | null>(value || null)
  const [selectedPreset, setSelectedPreset] = useState<PresetType | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDraft(value || null)
  }, [value])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getPresetRange = (preset: PresetType): DateRange => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()

    switch (preset) {
      case 'today':
        return { from: formatDateForInput(today), to: formatDateForInput(today) }
      
      case 'yesterday': {
        const yesterday = new Date(year, month, day - 1)
        return { from: formatDateForInput(yesterday), to: formatDateForInput(yesterday) }
      }
      
      case 'this-week': {
        const dayOfWeek = today.getDay()
        const startOfWeek = new Date(year, month, day - dayOfWeek)
        return { from: formatDateForInput(startOfWeek), to: formatDateForInput(today) }
      }
      
      case 'last-week': {
        const dayOfWeek = today.getDay()
        const startOfLastWeek = new Date(year, month, day - dayOfWeek - 7)
        const endOfLastWeek = new Date(year, month, day - dayOfWeek - 1)
        return { from: formatDateForInput(startOfLastWeek), to: formatDateForInput(endOfLastWeek) }
      }
      
      case 'this-month': {
        const startOfMonth = new Date(year, month, 1)
        return { from: formatDateForInput(startOfMonth), to: formatDateForInput(today) }
      }
      
      case 'last-month': {
        const startOfLastMonth = new Date(year, month - 1, 1)
        const endOfLastMonth = new Date(year, month, 0)
        return { from: formatDateForInput(startOfLastMonth), to: formatDateForInput(endOfLastMonth) }
      }
      
      case 'this-year': {
        const startOfYear = new Date(year, 0, 1)
        return { from: formatDateForInput(startOfYear), to: formatDateForInput(today) }
      }
      
      case 'last-year': {
        const startOfLastYear = new Date(year - 1, 0, 1)
        const endOfLastYear = new Date(year - 1, 11, 31)
        return { from: formatDateForInput(startOfLastYear), to: formatDateForInput(endOfLastYear) }
      }
    }
  }

  const handlePresetClick = (preset: PresetType) => {
    const range = getPresetRange(preset)
    setDraft(range)
    setSelectedPreset(preset)
  }

  const handleApply = () => {
    onChange?.(draft)
    onApply?.(draft)
    setOpen(false)
  }

  const handleReset = () => {
    setDraft(null)
    setSelectedPreset(null)
    onChange?.(null)
  }

  const handleDateClick = (date: Date) => {
    const dateStr = formatDateForInput(date)
    
    if (!draft?.from || (draft.from && draft.to)) {
      // Start new selection
      setDraft({ from: dateStr, to: dateStr })
      setSelectedPreset(null)
    } else if (draft.from && !draft.to) {
      // Complete the range
      if (new Date(dateStr) >= new Date(draft.from)) {
        setDraft({ ...draft, to: dateStr })
      } else {
        setDraft({ from: dateStr, to: draft.from })
      }
    }
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay() // 0 = Sunday
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    const startDayMonday = startDay === 0 ? 6 : startDay - 1
    const daysInMonth = lastDay.getDate()
    
    const days: (Date | null)[] = []
    
    // Add previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDayMonday - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i))
    }
    
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    // Add next month days to complete the grid
    const remainingDays = 42 - days.length // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }
    
    return days
  }

  const isDateInRange = (date: Date): boolean => {
    if (!draft?.from) return false
    const dateStr = formatDateForInput(date)
    const from = new Date(draft.from)
    const to = draft.to ? new Date(draft.to) : from
    const current = new Date(dateStr)
    return current >= from && current <= to
  }

  const isDateSelected = (date: Date): boolean => {
    if (!draft?.from) return false
    const dateStr = formatDateForInput(date)
    return dateStr === draft.from || dateStr === draft.to
  }

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const displayText = draft?.from && draft?.to 
    ? `${formatDateDisplay(draft.from)} – ${formatDateDisplay(draft.to)}`
    : 'Custom Date'

  return (
    <div ref={ref} className={styles.wrapper}>
      <button className={styles.trigger} onClick={() => setOpen(!open)}>
        {displayText}
      </button>
      
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.content}>
            {/* Quick Select Presets */}
            <div className={styles.presets}>
              <button 
                className={`${styles.presetBtn} ${selectedPreset === 'today' ? styles.presetActive : ''}`}
                onClick={() => handlePresetClick('today')}
              >
                Today
              </button>
              <button 
                className={`${styles.presetBtn} ${selectedPreset === 'yesterday' ? styles.presetActive : ''}`}
                onClick={() => handlePresetClick('yesterday')}
              >
                Yesterday
              </button>
              <button 
                className={`${styles.presetBtn} ${selectedPreset === 'this-week' ? styles.presetActive : ''}`}
                onClick={() => handlePresetClick('this-week')}
              >
                This week
              </button>
              <button 
                className={`${styles.presetBtn} ${selectedPreset === 'last-week' ? styles.presetActive : ''}`}
                onClick={() => handlePresetClick('last-week')}
              >
                Last week
              </button>
              <button 
                className={`${styles.presetBtn} ${selectedPreset === 'this-month' ? styles.presetActive : ''}`}
                onClick={() => handlePresetClick('this-month')}
              >
                This month
              </button>
              <button 
                className={`${styles.presetBtn} ${selectedPreset === 'last-month' ? styles.presetActive : ''}`}
                onClick={() => handlePresetClick('last-month')}
              >
                Last month
              </button>
              <button 
                className={`${styles.presetBtn} ${selectedPreset === 'this-year' ? styles.presetActive : ''}`}
                onClick={() => handlePresetClick('this-year')}
              >
                This year
              </button>
              <button 
                className={`${styles.presetBtn} ${selectedPreset === 'last-year' ? styles.presetActive : ''}`}
                onClick={() => handlePresetClick('last-year')}
              >
                Last year
              </button>
            </div>

            {/* Calendar */}
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <button 
                  className={styles.navBtn}
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  ‹
                </button>
                <div className={styles.monthYear}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <button 
                  className={styles.navBtn}
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  ›
                </button>
              </div>

              <div className={styles.weekdays}>
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                  <div key={day} className={styles.weekday}>{day}</div>
                ))}
              </div>

              <div className={styles.days}>
                {generateCalendarDays().map((date, idx) => {
                  if (!date) return <div key={idx} className={styles.day} />
                  
                  return (
                    <button
                      key={idx}
                      className={`${styles.day} ${!isCurrentMonth(date) ? styles.otherMonth : ''} ${
                        isDateSelected(date) ? styles.selected : ''
                      } ${isDateInRange(date) && !isDateSelected(date) ? styles.inRange : ''} ${
                        isToday(date) ? styles.today : ''
                      }`}
                      onClick={() => handleDateClick(date)}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer with date inputs and actions */}
          <div className={styles.footer}>
            <div className={styles.dateInputs}>
              <input
                type="text"
                className={styles.dateInput}
                value={draft?.from ? formatDateDisplay(draft.from) : ''}
                readOnly
                placeholder="Nov 12, 2025"
              />
              <span className={styles.separator}>–</span>
              <input
                type="text"
                className={styles.dateInput}
                value={draft?.to ? formatDateDisplay(draft.to) : ''}
                readOnly
                placeholder="Nov 31, 2025"
              />
            </div>
            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className={styles.applyBtn} onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

