import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { InventoryRow } from '../types'
import { fetchInventory } from '../api'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Filters, { FiltersValue, ValueRangeOption, DaysOption } from '@/shared/components/Filters/Filters'
import StatusBadge from '@/shared/components/StatusBadge'
import downloadIcon from '@/assets/icons/download_icon.svg'
import StatCard from '@/shared/components/StatCard'
import cartIcon from '@/assets/icons/cart_icon.svg'
import clockIcon from '@/assets/icons/clock_icon.svg'
import stockIcon from '@/assets/icons/stock_icon.svg'
import PillSelect from '@/shared/components/PillSelect/PillSelect'
import Typography from '@/shared/components/Typography/Typography'
import { inferStatusVariant, type Variant as StatusVariant } from '@/shared/components/StatusBadge/StatusBadge'
const columns: ColumnDef<InventoryRow>[] = [
  { accessorKey: 'partNumber', header: 'Part Number' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'totalStock', header: 'Total Stock',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'available', header: 'Available',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'allocated', header: 'Allocated',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'onOrderLbs', header: 'On Order',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'unitPrice', header: 'Unit Price',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'totalValue', header: 'Total Value',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'daysUntilStockout', header: 'Days Until Stockout',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    if (v == null) return '-'
    const statusText = (c.row.original as InventoryRow).status
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
    <>
   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
    <StatCard
        title="Total Stock"
        value={`lbs`}
        iconSrc={stockIcon}
        type="stock"
        linkText="All Products"
      />
      <StatCard
        title="Open customer Orders"
        value={`lbs`}
        iconSrc={cartIcon}
        type="customer"
        metaDate="Oct 7, 2025"
      />
     
      <StatCard
        title="Stock out"
        value={`0.9 mo`}
        iconSrc={clockIcon}
        type="stockout"
      />

      <StatCard
        title="Open vendor Orders"
        value={`lbs`}
        iconSrc={cartIcon}
        type="vendor"
        metaDate="Nov 28, 2025"
      />
    </div>
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        data={filtered}
        columns={columns}
        toolbarRight={toolbarRight}
        onRowClick={(row) => navigate(`/inventory/${(row as InventoryRow).id}`)}
      />
    </div>
    </>
  )
}


