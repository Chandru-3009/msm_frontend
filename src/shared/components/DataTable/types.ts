import { ColumnDef } from '@tanstack/react-table'

export type TableChange = {
  pageIndex: number
  pageSize: number
  sorting: { id: string; desc: boolean }[]
  globalFilter: string
  columnFilters: { id: string; value: unknown }[]
}

export type TableProps<T extends object> = {
  data: T[]
  columns: ColumnDef<T, any>[]
  initialPageSize?: number
  pageSizeOptions?: number[]
  enableGlobalFilter?: boolean
  manualMode?: boolean
  pageCount?: number
  onChange?: (s: TableChange) => void
}


