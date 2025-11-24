import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing table filter state with debounced search
 * @param initialPageSize - Initial page size (default: 10)
 * @param debounceMs - Debounce delay for search in milliseconds (default: 300)
 */
export function useTableFilters(initialPageSize = 10, debounceMs = 300) {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), debounceMs)
    return () => clearTimeout(timer)
  }, [search, debounceMs])

  // Reset page to 0
  const resetPage = useCallback(() => setPageIndex(0), [])

  return {
    pageIndex,
    pageSize,
    search,
    debouncedSearch,
    setPageIndex,
    setPageSize,
    setSearch,
    resetPage,
  }
}

