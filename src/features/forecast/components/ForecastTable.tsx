import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { ForecastRow } from '../types'
import { fetchForecast } from '../api'
import { useMemo, useState } from 'react'

const columns: ColumnDef<ForecastRow>[] = [
  { accessorKey: 'partNumber', header: 'Part Number' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'size', header: 'Size' },
  { accessorKey: 'stock', header: 'Stock', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'available', header: 'Available', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'forecastLbs', header: '30-Day Forecast', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'nextReorder', header: 'Next Reorder', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'daysUntilStockout', header: 'Days Until Stockout', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v} days`
  } },
  { accessorKey: 'status', header: 'Status', cell: (c) => <span className="badge">{c.getValue<string | undefined>() ?? '-'}</span> },
]

export default function ForecastTable() {
  const { data, isLoading } = useQuery({ queryKey: ['forecast'], queryFn: fetchForecast })
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


