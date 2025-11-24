import { useState, useCallback } from 'react'

/**
 * Custom hook for managing filter state with automatic page reset
 * When filter value changes, it automatically resets pagination to page 0
 * @param initialValue - Initial filter value
 * @param resetPage - Callback to reset page to 0
 */
export function useFilterState<T>(
  initialValue: T,
  resetPage: () => void
) {
  const [value, setValue] = useState(initialValue)

  const setValueAndReset = useCallback((next: T | ((prev: T) => T)) => {
    resetPage()
    setValue(next)
  }, [resetPage])

  return [value, setValueAndReset] as const
}

