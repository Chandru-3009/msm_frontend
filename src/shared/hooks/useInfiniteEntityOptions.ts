import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

export type EntityOption = {
  value: string
  label: string
}

type InfiniteEntityConfig<T> = {
  queryKey: string[]
  queryFn: (params: { limit: number; offset: number }) => Promise<{
    data: T[]
    pagination: {
      total: number
      page: number
      page_size: number
      total_pages: number
      has_next_page: boolean
      has_previous_page: boolean
    }
  }>
  getValue: (item: T) => string
  getLabel: (item: T) => string
  pageSize?: number
}

/**
 * Hook for infinite scrolling dropdowns (customers, vendors, users)
 * Loads data in pages and accumulates all results
 * 
 * @example
 * ```ts
 * const customers = useInfiniteEntityOptions({
 *   queryKey: ['customers-infinite'],
 *   queryFn: ({ limit, offset }) => fetchCustomers({ limit, offset }),
 *   getValue: (c) => c.customer_name,
 *   getLabel: (c) => c.customer_name,
 * })
 * 
 * <PillSelect
 *   options={customers.options}
 *   onScrollBottom={customers.loadMore}
 *   loading={customers.isFetchingNextPage}
 * />
 * ```
 */
export function useInfiniteEntityOptions<T>({
  queryKey,
  queryFn,
  getValue,
  getLabel,
  pageSize = 50,
}: InfiniteEntityConfig<T>) {
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) => queryFn({
      limit: pageSize,
      offset: pageParam,
    }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_next_page) {
        return lastPage.pagination.page * lastPage.pagination.page_size
      }
      return undefined
    },
    initialPageParam: 0,
  })

  // Flatten all pages into single array
  const allItems = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data]
  )

  // Convert to options format
  const options = useMemo(
    () => allItems.map(item => ({
      value: getValue(item),
      label: getLabel(item),
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allItems]
  )

  // Create lookup map: display label -> API value
  const labelToValue = useMemo(() => {
    const map: Record<string, string> = {}
    allItems.forEach(item => {
      const label = getLabel(item)
      const value = getValue(item)
      map[label] = value
    })
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems])

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return {
    options,           // All accumulated options
    labelToValue,      // Label -> value map
    allItems,          // Raw items
    loadMore,          // Function to load next page
    hasNextPage,       // Can load more?
    isFetchingNextPage,// Loading next page?
    isLoading,         // Initial loading?
  }
}

