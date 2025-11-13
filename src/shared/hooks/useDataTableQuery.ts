import { useQuery } from '@tanstack/react-query'

export type TableQueryState = {
  pageIndex: number
  pageSize: number
  sorting: any[]
  globalFilter: string
  columnFilters: any[]
}

export type FetchParams = TableQueryState & { extra?: Record<string, any> }
export type FetchResult<T> = { rows: T[]; total: number }

export function useDataTableQuery<T>(
  keyBase: string,
  fetcher: (p: FetchParams) => Promise<FetchResult<T>>,
  state: TableQueryState,
  extra?: Record<string, any>
) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [keyBase, state, extra],
    queryFn: () => fetcher({ ...state, extra }),
    keepPreviousData: true,
  })
  const rows = data?.rows ?? []
  const total = data?.total ?? rows.length
  const pageCount = Math.max(1, Math.ceil(total / (state.pageSize || 10)))
  return { rows, pageCount, isLoading, isError, error }
}


