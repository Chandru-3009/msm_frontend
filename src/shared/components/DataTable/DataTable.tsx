import './DataTable.css'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import clsx from 'clsx'
import Pagination from '@/shared/components/Pagination'
import SearchInput from '@/shared/components/inputs/SearchInput'

type Props<T extends object> = import('./types').TableProps<T>

export default function DataTable<T extends object>({
  data,
  columns,
  loading = false,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  enableGlobalFilter = true,
  searchPlaceholder,
  toolbarRight,
  manualMode = false,
  enablePagination = true,
  pageCount,
  totalRecords,
  onChange,
  onRowClick,
}: Props<T>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<any>([])
  const [columnFilters, setColumnFilters] = useState<any>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<T, any>[],
    state: { sorting, globalFilter, columnFilters, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater: any) => {
      const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater
      setPageIndex(next.pageIndex)
      setPageSize(next.pageSize)
    },
    manualSorting: manualMode,
    manualFiltering: manualMode,
    manualPagination: manualMode,
    pageCount: manualMode ? pageCount : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(enablePagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
  })

  useMemo(() => {
    onChange?.({ pageIndex, pageSize, sorting, globalFilter, columnFilters })
  }, [pageIndex, pageSize, sorting, globalFilter, columnFilters])

  const pageCountComputed = table.getPageCount() || 1

  return (
    <div>
      {(enableGlobalFilter || toolbarRight) && (
        <div className="toolbar-row">
          <div style={{ display: 'flex',justifyContent: 'space-between', width: '100%',alignItems: 'center'}}>
          <div>total {totalRecords}</div>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {enableGlobalFilter && <SearchInput value={globalFilter ?? ''} onChange={(v) => setGlobalFilter(v)} placeholder={searchPlaceholder} />}
          
         
          {typeof toolbarRight === 'function'
            ? toolbarRight({ pageIndex, pageSize, sorting, globalFilter, columnFilters })
            : toolbarRight}
               </div>
         </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    colSpan={h.colSpan}
                    className={clsx(
                      (((h.column.columnDef as any).meta?.align) === 'right') && 'cell-right',
                      (((h.column.columnDef as any).meta?.align) === 'center') && 'cell-center',
                    )}
                  >
                    {h.isPlaceholder ? null : (
                      <span
                        className="th-sort"
                        onClick={h.column.getToggleSortingHandler()}
                        aria-sort={h.column.getIsSorted() ? (h.column.getIsSorted() === 'desc' ? 'descending' : 'ascending') : 'none'}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr
                key={r.id}
                className="tr"
                onClick={onRowClick ? () => onRowClick(r.original as T) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {r.getVisibleCells().map((c) => (
                  <td
                    key={c.id}
                    className={clsx(
                      (((c.column.columnDef as any).meta?.align) === 'right') && 'cell-right',
                      (((c.column.columnDef as any).meta?.align) === 'center') && 'cell-center',
                    )}
                  >
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {loading && table.getRowModel().rows.length === 0 && (
              <tr><td colSpan={table.getAllLeafColumns().length} className="small" style={{ padding: 16 }}>Loading…</td></tr>
            )}
            {!loading && table.getRowModel().rows.length === 0 && (
              <tr><td colSpan={table.getAllLeafColumns().length} className="small" style={{ padding: 16 }}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <Pagination
        page={pageIndex}
        pageCount={pageCountComputed}
          onPageChange={(p) => table.setPageIndex(p)}
        />
      )}
    </div>
  )
}




