import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import DateRangeButton from '@/shared/components/DateRange/DateRangeButton'
import downloadIcon from '@/assets/icons/download_icon.svg'
import { fetchQuotes } from '../api'
import { QuoteRow } from '../types'

const columns: ColumnDef<QuoteRow>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: (c) => {
      const v = c.getValue<string | undefined | null>()
      return v ? new Date(v).toLocaleDateString() : '-'
    },
  },
  { accessorKey: 'quoteNo', header: 'Quote #' },
  { accessorKey: 'customer', header: 'Customer' },
  {
    accessorKey: 'qty',
    header: 'Qty',
    meta: { align: 'right' as const },
    cell: (c) => {
      const v = c.getValue<number | undefined | null>()
      return v == null ? '-' : v.toLocaleString()
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    meta: { align: 'right' as const },
    cell: (c) => {
      const v = c.getValue<number | undefined | null>()
      return v == null ? '-' : `$${v.toLocaleString()}`
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (c) => <span className="badge">{c.getValue<string | undefined>() ?? '-'}</span>,
  },
]

export default function QuotesTable() {
  const { data, isLoading } = useQuery({ queryKey: ['quotes'], queryFn: fetchQuotes })
  const rows = Array.isArray(data) ? data : []

  const [status, setStatus] = useState<string>('')
  const [product, setProduct] = useState<string>('')
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string } | undefined>()
  const statuses = useMemo(() => Array.from(new Set(rows.map((d) => d.status))), [rows])

  const filtered = useMemo(() => rows.filter((r) => {
    if (status && r.status !== status) return false
    if (dateRange?.from && new Date(r.date) < new Date(dateRange.from)) return false
    if (dateRange?.to && new Date(r.date) > new Date(dateRange.to)) return false
    return true
  }), [rows, status, dateRange])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className="select" value={product} onChange={(e) => setProduct(e.target.value)}>
        <option value="">All Products</option>
      </select>
      <DateRangeButton value={dateRange} onChange={setDateRange} />
      <button className="btn" title="Download"><img src={downloadIcon} alt="" width={16} height={16} /></button>
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


