import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { SalesRow } from '../types'
import { fetchSales } from '../api'
import { useMemo, useState } from 'react'

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

  const statuses = useMemo(() => Array.from(new Set(rows.map((d) => d.deliveryStatus))), [rows])
  const customers = useMemo(() => Array.from(new Set(rows.map((d) => d.customer))).sort(), [rows])

  const filtered = useMemo(() => rows.filter((r) =>
    (status ? r.deliveryStatus === status : true) && (customer ? r.customer === customer : true)
  ), [rows, status, customer])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8 }}>
      <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <select className="select" value={customer} onChange={(e) => setCustomer(e.target.value)}>
        <option value="">Customer</option>
        {customers.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


