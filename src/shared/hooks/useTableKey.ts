import { useMemo } from 'react'

/**
 * Custom hook for generating a stable table key based on filter dependencies
 * Used to reset DataTable's internal state when filters change
 * @param dependencies - Object containing all filter values that should trigger table reset
 */
export function useTableKey(dependencies: Record<string, any>) {
  return useMemo(
    () => Object.entries(dependencies)
      .map(([key, val]) => `${key}:${JSON.stringify(val)}`)
      .join('|'),
    Object.values(dependencies)
  )
}

