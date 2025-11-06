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

type Props<T extends object> = import('./types').TableProps<T>

export default function DataTable<T extends object>({
  data,
  columns,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  enableGlobalFilter = true,
  manualMode = false,
  pageCount,
  onChange,
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
    getPaginationRowModel: getPaginationRowModel(),
  })

  useMemo(() => {
    onChange?.({ pageIndex, pageSize, sorting, globalFilter, columnFilters })
  }, [pageIndex, pageSize, sorting, globalFilter, columnFilters])

  const pagesToShow = Array.from({ length: table.getPageCount() || 1 }, (_, i) => i).slice(
    Math.max(0, table.getState().pagination.pageIndex - 2),
    Math.max(0, table.getState().pagination.pageIndex - 2) + 5
  )

  return (
    <div>
      {enableGlobalFilter && (
        <div className="toolbar-row">
          <input
            className="input"
            placeholder="Search…"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{ width: 260 }}
          />
          <div className="spacer" />
          <span className="small">Rows: {data.length}</span>
          <select
            className="select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} colSpan={h.colSpan}>
                    {h.isPlaceholder ? null : (
                      <span
                        className="th-sort"
                        onClick={h.column.getToggleSortingHandler()}
                        aria-sort={h.column.getIsSorted() ? (h.column.getIsSorted() === 'desc' ? 'descending' : 'ascending') : 'none'}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <SortIcon state={h.column.getIsSorted()} />
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id} className="tr">
                {r.getVisibleCells().map((c) => (
                  <td key={c.id} className={clsx(((c.column.columnDef as any).meta?.align) === 'right' && 'cell-right')}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr><td colSpan={table.getAllLeafColumns().length} className="small" style={{ padding: 16 }}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="page-btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'‹'}</button>
        {pagesToShow.map((p) => (
          <button
            key={p}
            className="page-btn"
            aria-current={p === pageIndex ? 'page' : undefined}
            onClick={() => table.setPageIndex(p)}
          >
            {p + 1}
          </button>
        ))}
        <button className="page-btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'›'}</button>
        <div className="spacer" />
        <span className="small">
          Page {pageIndex + 1} of {table.getPageCount() || 1}
        </span>
      </div>
    </div>
  )
}

function SortIcon({ state }: { state: false | 'asc' | 'desc' }) {
  if (state === 'asc') return <span aria-hidden>▲</span>
  if (state === 'desc') return <span aria-hidden>▼</span>
  return <span aria-hidden style={{ opacity: .4 }}>⇅</span>
}


