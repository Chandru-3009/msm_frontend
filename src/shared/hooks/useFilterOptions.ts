import { useMemo } from 'react'

export type IdName = { id: number; value: string }

/**
 * Custom hook for mapping filter options from API data
 * Converts { id, value } arrays into options array and value-to-id map
 * @param data - Array of { id, value } objects from API
 */
export function useFilterOptions(data: IdName[] | undefined) {
  const options = useMemo(
    () => (data ?? []).map(item => item.value), 
    [data]
  )
  
  const valueToId = useMemo(() => {
    const map: Record<string, number> = {}
    ;(data ?? []).forEach(item => { 
      map[item.value] = item.id 
    })
    return map
  }, [data])

  return { options, valueToId }
}

