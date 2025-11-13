import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { fetchPurchases } from '../api'
import { PurchaseRow } from '../types'
import { useMemo, useState } from 'react'
import DateRangeButton from '@/shared/components/DateRange/DateRangeButton'
import StatusBadge from '@/shared/components/StatusBadge'

const columns: ColumnDef<PurchaseRow>[] = [
  { accessorKey: 'date', header: 'Date', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'po', header: 'PO#' },
  { accessorKey: 'vendor', header: 'Vendor' },
  { accessorKey: 'customerPo', header: 'Customer PO' },
  { accessorKey: 'items', header: 'Items',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'weightLbs', header: 'Weight',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'eta', header: 'ETA', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'status', header: 'Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
]

export default function PurchaseTable() {
  const { data, isLoading } = useQuery({ queryKey: ['purchases'], queryFn: fetchPurchases })

  const rows = Array.isArray(data) ? data : []

  const [vendor, setVendor] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string } | undefined>()

  const vendors = useMemo(() => Array.from(new Set(rows.map((d) => d.vendor))).sort(), [rows])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (vendor && r.vendor !== vendor) return false
      if (status && r.status !== status) return false
      if (dateRange?.from && new Date(r.date) < new Date(dateRange.from)) return false
      if (dateRange?.to && new Date(r.date) > new Date(dateRange.to)) return false
      return true
    })
  }, [rows, vendor, status, dateRange])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value="Received">Received</option>
        <option value="In Transit">In Transit</option>
        <option value="Ordered">Ordered</option>
      </select>
      <select className="select" value={vendor} onChange={(e) => setVendor(e.target.value)}>
        <option value="">All Vendors</option>
        {vendors.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
      <DateRangeButton value={dateRange} onChange={setDateRange} />
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} searchPlaceholder="Search" />
    </div>
  )
}


