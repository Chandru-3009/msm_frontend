import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { ForecastRow } from '../types'
import { fetchForecast } from '../api'
import { useMemo, useState } from 'react'
import Filters, { FiltersValue, DaysOption } from '@/shared/components/Filters/Filters'
import downloadIcon from '@/assets/icons/download_icon.svg'
import StatusBadge from '@/shared/components/StatusBadge'

const columns: ColumnDef<ForecastRow>[] = [
  { accessorKey: 'partNumber', header: 'Part Number' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'size', header: 'Size' },
  { accessorKey: 'stock', header: 'Stock',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'available', header: 'Available',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'forecastLbs', header: '30-Day Forecast',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'nextReorder', header: 'Next Reorder', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'daysUntilStockout', header: 'Days Until Stockout',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v} days`
  } },
  { accessorKey: 'status', header: 'Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
]

export default function ForecastTable() {
  const { data, isLoading } = useQuery({ queryKey: ['forecast'], queryFn: fetchForecast })
  const rows = Array.isArray(data) ? data : []

  const typeOptions = useMemo(() => Array.from(new Set(rows.map((d) => d.type))).sort(), [rows])
  const statuses = useMemo(() => Array.from(new Set(rows.map((d) => d.status))), [rows])

  const daysOptions: DaysOption[] = useMemo(() => [
    { key: '7', label: '7 Days', days: 7 },
    { key: '14', label: '14 Days', days: 14 },
    { key: '30', label: '30 Days', days: 30 },
    { key: '60', label: '60 Days', days: 60 },
  ], [])

  const [filters, setFilters] = useState<FiltersValue>({ types: [] })
  const [status, setStatus] = useState<string>('')

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status && r.status !== status) return false
      if (filters.types.length > 0 && !filters.types.includes(r.type)) return false
      if (filters.daysKey) {
        const opt = daysOptions.find((d) => d.key === filters.daysKey)
        if (opt && !(r.daysUntilStockout <= opt.days)) return false
      }
      return true
    })
  }, [rows, status, filters, daysOptions])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Filters
        typeOptions={typeOptions}
        daysOptions={daysOptions}
        value={filters}
        onChange={setFilters}
      />
      <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button className="btn" title="Download">
        <img src={downloadIcon} alt="" width={16} height={16} />
      </button>
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


