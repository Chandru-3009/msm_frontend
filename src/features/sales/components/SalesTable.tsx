import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { SalesRow } from '../types'
import { fetchSales } from '../api'
import { useMemo, useState } from 'react'
import DateRangeButton from '@/shared/components/DateRange/DateRangeButton'
import downloadIcon from '@/assets/icons/download_icon.svg'

const columns: ColumnDef<SalesRow>[] = [
  { accessorKey: 'date', header: 'Date', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'orderNo', header: 'Order #' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'poNumber', header: 'PO Number' },
  { accessorKey: 'items', header: 'Items', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'qtyLbs', header: 'Qty', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'orderValue', header: 'Order Value', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'deliveryStatus', header: 'Delivery Status', cell: (c) => <span className="badge">{c.getValue<string | undefined>() ?? '-'}</span> },
]

export default function SalesTable() {
  const { data, isLoading } = useQuery({ queryKey: ['sales'], queryFn: fetchSales })
  const rows = Array.isArray(data) ? data : []

  const [status, setStatus] = useState<string>('')
  const [customer, setCustomer] = useState<string>('')
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string } | undefined>()

  const statuses = useMemo(() => Array.from(new Set(rows.map((d) => d.deliveryStatus))), [rows])
  const customers = useMemo(() => Array.from(new Set(rows.map((d) => d.customer))).sort(), [rows])

  const filtered = useMemo(() => rows.filter((r) => {
    if (status && r.deliveryStatus !== status) return false
    if (customer && r.customer !== customer) return false
    if (dateRange?.from && new Date(r.date) < new Date(dateRange.from)) return false
    if (dateRange?.to && new Date(r.date) > new Date(dateRange.to)) return false
    return true
  }), [rows, status, customer, dateRange])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className="select" value={customer} onChange={(e) => setCustomer(e.target.value)}>
        <option value="">Customer</option>
        {customers.map((s) => <option key={s} value={s}>{s}</option>)}
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


