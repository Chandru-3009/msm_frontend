import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { InventoryRow } from '../types'
import { fetchInventory } from '../api'
import { useMemo, useState } from 'react'

const columns: ColumnDef<InventoryRow>[] = [
  { accessorKey: 'partNumber', header: 'Part Number' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'totalStock', header: 'Total Stock', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'available', header: 'Available', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'allocated', header: 'Allocated', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'onOrderLbs', header: 'On Order', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'unitPrice', header: 'Unit Price', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'totalValue', header: 'Total Value', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'daysUntilStockout', header: 'Days Until Stockout', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v} days`
  } },
  { accessorKey: 'status', header: 'Status', cell: (c) => <span className="badge">{c.getValue<string | undefined>() ?? '-'}</span> },
]

export default function InventoryTable() {
  const { data, isLoading } = useQuery({ queryKey: ['inventory'], queryFn: fetchInventory })
  const rows = Array.isArray(data) ? data : []

  const [status, setStatus] = useState<string>('')

  const statuses = useMemo(() => Array.from(new Set(rows.map((d) => d.status))), [rows])

  const filtered = useMemo(() => {
    return rows.filter((r) => (status ? r.status === status : true))
  }, [rows, status])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8 }}>
      <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


