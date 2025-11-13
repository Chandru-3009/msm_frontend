import { ColumnDef } from '@tanstack/react-table'
import type { FetchParams, FetchResult } from '@/shared/hooks/useDataTableQuery'

export type TableChange = {
  pageIndex: number
  pageSize: number
  sorting: { id: string; desc: boolean }[]
  globalFilter: string
  columnFilters: { id: string; value: unknown }[]
}

export type ToolbarStatus = { options: string[]; value: string; onChange: (v: string) => void }
export type ToolbarConfig = {
  status?: ToolbarStatus | false
  filters?: React.ReactNode | false
  dateRangeNode?: React.ReactNode | false
  download?: { onClick: () => void } | false
  right?: React.ReactNode
}

export type TableProps<T extends object> = {
  data: T[]
  columns: ColumnDef<T, any>[]
  initialPageSize?: number
  pageSizeOptions?: number[]
  enableGlobalFilter?: boolean
  searchPlaceholder?: string
  toolbarRight?: React.ReactNode | ((state: TableChange) => React.ReactNode)
  toolbar?: ToolbarConfig
  manualMode?: boolean
  pageCount?: number
  onChange?: (s: TableChange) => void
  onRowClick?: (row: T) => void

  // Optional managed mode: DataTable calls your fetcher with table state
  fetcher?: (p: FetchParams) => Promise<FetchResult<T>>
  queryKey?: string
}


