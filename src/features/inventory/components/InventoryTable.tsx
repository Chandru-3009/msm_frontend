import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { InventoryRow } from '../types'
import { fetchInventory } from '../api'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Filters, { FiltersValue, ValueRangeOption, DaysOption } from '@/shared/components/Filters/Filters'
import downloadIcon from '@/assets/icons/download_icon.svg'

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
  const navigate = useNavigate()

  const typeOptions = useMemo(() => Array.from(new Set(rows.map((d) => d.type))).sort(), [rows])
  const statuses = useMemo(() => Array.from(new Set(rows.map((d) => d.status))), [rows])

  const valueRanges: ValueRangeOption[] = useMemo(() => [
    { key: 'lt100k', label: '$0–$100K', max: 100_000 },
    { key: '100to500', label: '$100K–$500K', min: 100_000, max: 500_000 },
    { key: '500to900', label: '$500K–$900K', min: 500_000, max: 900_000 },
    { key: 'gt900', label: '$900K+', min: 900_000 },
  ], [])

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
      if (filters.valueRangeKey) {
        const opt = valueRanges.find((v) => v.key === filters.valueRangeKey)
        if (opt) {
          if (opt.min != null && r.totalValue < opt.min) return false
          if (opt.max != null && r.totalValue > opt.max) return false
        }
      }
      if (filters.daysKey) {
        const opt = daysOptions.find((d) => d.key === filters.daysKey)
        if (opt && !(r.daysUntilStockout <= opt.days)) return false
      }
      return true
    })
  }, [rows, status, filters, valueRanges, daysOptions])

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
      <DataTable
        data={filtered}
        columns={columns}
        toolbarRight={toolbarRight}
        onRowClick={(row) => navigate(`/inventory/${(row as InventoryRow).id}`)}
      />
    </div>
  )
}


