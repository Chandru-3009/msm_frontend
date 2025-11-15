import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { ForecastRow } from '../types'
import { fetchForecast } from '../api'
import { useMemo, useState } from 'react'
import Filters, { FiltersValue, DaysOption, ValueRangeOption } from '@/shared/components/Filters/Filters'
import downloadIcon from '@/assets/icons/download_icon.svg'
import StatusBadge from '@/shared/components/StatusBadge'
import { inferStatusVariant, type Variant as StatusVariant } from '@/shared/components/StatusBadge/StatusBadge'
import PillSelect from '@/shared/components/PillSelect/PillSelect'
import Typography from '@/shared/components/Typography/Typography'

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
    if (v == null) return '-'
    const statusText = (c.row.original as ForecastRow).status
    const variant = inferStatusVariant(statusText)
    const colorByVariant: Record<StatusVariant, string> = {
      success: 'success',  // green
      active: 'primary',   // blue
      critical: 'danger',  // red
    }
    return <Typography as="span" size="md" weight="medium" color={colorByVariant[variant]}>{v} days</Typography>
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
  const valueRanges: ValueRangeOption[] = useMemo(() => [
    { key: 'lt100k', label: '$0–$100K', max: 100_000 },
    { key: '100to500', label: '$100K–$500K', min: 100_000, max: 500_000 },
    { key: '500to900', label: '$500K–$900K', min: 500_000, max: 900_000 },
    { key: 'gt900', label: '$900K+', min: 900_000 },
  ], [])
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
        valueRanges={valueRanges}
        daysOptions={daysOptions}
        value={filters}
        onChange={setFilters}
      />
        <PillSelect
          value={status}
          onChange={setStatus}
          options={statuses.map((s) => ({ value: s, label: s }))}
          placeholder="All Status"
          allOptionLabel="All Status"
          ariaLabel="Filter by status"
        />
      <button className="icon-pill" title="Download">
        <img src={downloadIcon} alt="" />
      </button>
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


