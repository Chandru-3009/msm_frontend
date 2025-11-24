import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTableFilters } from './useTableFilters'
import { useTableKey } from './useTableKey'

export type PaginationInfo = {
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next_page: boolean
  has_previous_page: boolean
}

export type ServerTableResponse<TData> = {
  items: TData[]
  pagination: PaginationInfo
}

export type ServerTableParams = {
  search?: string
  limit?: number
  offset?: number
  [key: string]: any
}

export type UseServerTableOptions<TData, TFilters extends Record<string, any>> = {
  queryKey: string
  queryFn: (params: ServerTableParams & TFilters) => Promise<ServerTableResponse<TData>>
  filters: TFilters
  initialPageSize?: number
  debounceMs?: number
  enabled?: boolean
}

/**
 * Unified hook for server-side table data fetching with filters and pagination
 * Handles:
 * - Pagination (page index, page size, offset calculation)
 * - Search with debouncing
 * - Filter state management
 * - Automatic page reset when filters change
 * - Loading states with previous data preservation
 * 
 * @example
 * ```ts
 * const { rows, pagination, isLoading, tableKey, handlers } = useServerTable({
 *   queryKey: 'inventory-list',
 *   queryFn: fetchInventory,
 *   filters: { productTypeIds, statusIds, valueRangeIds },
 * })
 * ```
 */
export function useServerTable<TData, TFilters extends Record<string, any>>({
  queryKey,
  queryFn,
  filters,
  initialPageSize = 10,
  debounceMs = 300,
  enabled = true,
}: UseServerTableOptions<TData, TFilters>) {
  
  const { 
    pageIndex, 
    pageSize, 
    search,
    debouncedSearch, 
    setPageIndex, 
    setPageSize, 
    setSearch,
    resetPage 
  } = useTableFilters(initialPageSize, debounceMs)

  // Generate table key for resetting DataTable internal state
  const tableKey = useTableKey({ 
    search: debouncedSearch, 
    ...filters 
  })

  // Fetch data with all parameters
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [queryKey, { search: debouncedSearch, ...filters, pageIndex, pageSize }],
    queryFn: () => queryFn({
      search: debouncedSearch || undefined,
      limit: pageSize,
      offset: pageIndex * pageSize,
      ...filters,
    }),
    placeholderData: keepPreviousData,
    enabled,
  })

  const rows = useMemo(() => data?.items ?? [], [data])
  const pageCount = data?.pagination?.total_pages ?? 1
  const totalRecords = data?.pagination?.total ?? 0

  // Handler for search with auto page reset
  const handleSearchChange = (searchValue: string) => {
    resetPage()
    setSearch(searchValue)
  }

  return {
    // Data
    rows,
    pagination: data?.pagination,
    
    // Derived values
    pageCount,
    totalRecords,
    tableKey,
    
    // Loading states
    isLoading,
    isFetching,
    error,
    
    // State values
    pageIndex,
    pageSize,
    search,
    
    // Handlers
    handlers: {
      setPageIndex,
      setPageSize,
      setSearch: handleSearchChange,
      resetPage,
    },
  }
}

