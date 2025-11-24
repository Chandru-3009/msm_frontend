import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { InventoryRow } from '../types'
import {
  fetchInventory,
  fetchInventoryFilterDaysUntilStockout,
  fetchInventoryFilterProductTypes,
  fetchInventoryFilterStatuses,
  fetchInventoryFilterValueRanges,
  fetchInventoryMetrics,
} from '../api'
import { useMemo } from 'react'
import { useTableFilters, useFilterOptions, useFilterState, useTableKey } from '@/shared/hooks'
import { useNavigate } from 'react-router-dom'
import Filters, { FiltersValue, ValueRangeOption, DaysOption } from '@/shared/components/Filters/Filters'
import StatusBadge from '@/shared/components/StatusBadge'
import downloadIcon from '@/assets/icons/download_icon.svg'
import StatCard from '@/shared/components/StatCard'
import stockIcon from '@/assets/icons/stock_icon.svg'
import PillSelect from '@/shared/components/PillSelect/PillSelect'
import dollarIcon from '@/assets/icons/dollar_cion.svg'
import Typography from '@/shared/components/Typography/Typography'
import { inferStatusVariant, type Variant as StatusVariant } from '@/shared/components/StatusBadge/StatusBadge'
import { formatCompactCurrency, formatCompactNumber } from '@/shared/utils/numberFormat'
const columns: ColumnDef<InventoryRow>[] = [
  { accessorKey: 'part_number', header: 'Part Number' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'total_stock', header: 'Total Stock',  cell: (c) => {
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
  { accessorKey: 'on_order', header: 'On Order',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'unit_price', header: 'Unit Price',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'total_value', header: 'Total Value',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'days_until_stockout', header: 'Days Until Stockout',  cell: (c) => {
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
  const navigate = useNavigate()

  // Server-provided filters
  const { data: statusesData } = useQuery({ queryKey: ['inventory-filter-statuses'], queryFn: fetchInventoryFilterStatuses })
  const { data: productTypesData } = useQuery({ queryKey: ['inventory-filter-product-types'], queryFn: fetchInventoryFilterProductTypes })
  const { data: valueRangesData } = useQuery({ queryKey: ['inventory-filter-value-ranges'], queryFn: fetchInventoryFilterValueRanges })
  const { data: daysUntilData } = useQuery({ queryKey: ['inventory-filter-days-until'], queryFn: fetchInventoryFilterDaysUntilStockout })

  // ✅ Simplified filter option mapping using hooks
  const { options: productTypeOptions, valueToId: productTypeNameToId } = useFilterOptions(productTypesData)
  const { options: statuses, valueToId: statusNameToId } = useFilterOptions(statusesData)

  const valueRanges: ValueRangeOption[] = useMemo(() => (
    (valueRangesData ?? []).map(v => ({ key: String(v.id), label: v.value }))
  ), [valueRangesData])

  const daysOptions: DaysOption[] = useMemo(() => (
    (daysUntilData ?? []).map(d => ({ key: String(d.id), label: d.value, days: 0 }))
  ), [daysUntilData])

  // ✅ Use table filters hook for pagination and debounced search
  const { pageIndex, pageSize, search, debouncedSearch, setPageIndex, setPageSize, setSearch, resetPage } = useTableFilters()

  // ✅ Use filter state hook with auto page reset
  const [filters, setFilters] = useFilterState<FiltersValue>({ types: [] }, resetPage)
  const [status, setStatus] = useFilterState<string>('', resetPage)

  // Compute server params from UI selections
  const productTypeIds = useMemo(
    () => (filters.types ?? []).map(n => productTypeNameToId[n]).filter((v): v is number => typeof v === 'number'),
    [filters.types, productTypeNameToId]
  )
  const valueRangeIds = useMemo(
    () => (filters.valueRangeKey ? [Number(filters.valueRangeKey)] : []),
    [filters.valueRangeKey]
  )
  const daysUntilIds = useMemo(
    () => (filters.daysKey ? [Number(filters.daysKey)] : []),
    [filters.daysKey]
  )
  const statusIds = useMemo(

    () => (status ? [statusNameToId[status]].filter((v): v is number => typeof v === 'number') : []),
    [status, statusNameToId]
  )

  const { data, isLoading } = useQuery({
    queryKey: ['inventory-dashboard', { search: debouncedSearch, productTypeIds, valueRangeIds, daysUntilIds, statusIds, pageIndex, pageSize }],
    queryFn: () => fetchInventory({
      search: debouncedSearch || undefined,
      productTypeIds,
      valueRangeIds,
      daysUntilStockoutIds: daysUntilIds,
      statusIds,
      limit: pageSize,
      offset: pageIndex * pageSize,
    }),
    placeholderData: keepPreviousData,
  })
  const { data: metricsData } = useQuery({
    queryKey: ['inventory-metrics'],
    queryFn: fetchInventoryMetrics,
  })

  // ✅ Simplified handlers - resetPage is now handled by useFilterState automatically

  const rows = useMemo(() => data?.data?.items ?? [], [data])
  const pageCount = data?.data?.pagination?.total_pages ?? 1
  const totalRecords = data?.data?.pagination?.total ?? 0

  // ✅ Use hook for table key generation (excludes search to prevent input reset)
  const tableKey = useTableKey({
    productTypeIds,
    valueRangeIds,
    daysUntilIds,
    statusIds,
  })

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Filters
        typeOptions={productTypeOptions}
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
        title="Total Item"
        value={formatCompactNumber(Number(metricsData?.data?.total_items))}
        iconSrc={stockIcon}
        type="stock"
        subtext="All Products"
      />
      <StatCard
        title="Total Value"
        value={formatCompactCurrency(Number(metricsData?.data?.total_value))}
        iconSrc={dollarIcon}
        type="customer"
        subvalue={metricsData?.data?.total_value_change}
        subtext="vs last month"
      />
     
      <StatCard
        title="Available Value"
        value={formatCompactCurrency(Number(metricsData?.data?.available_value))}
        iconSrc={dollarIcon}
        type="stockout"
        subvalue={metricsData?.data?.available_value_change}
        subtext="vs last month"
      />

      <StatCard
        title="Allocated Value"
        value={formatCompactCurrency(Number(metricsData?.data?.allocated_value))}
        iconSrc={dollarIcon}
        type="vendor"
        subvalue={metricsData?.data?.allocated_value_change}
        subtext="vs last month"
      />
    </div>
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        key={tableKey}
        loading={isLoading}
        totalRecords={totalRecords}
        data={rows}
        columns={columns}
        toolbarRight={toolbarRight}
        manualMode
        pageCount={pageCount}
        onChange={(state) => {
          // Only update pageIndex if it's a pagination change (not search)
          if (state.globalFilter === search) {
            setPageIndex(state.pageIndex)
          } else {
            // Search changed, reset page and update search
            resetPage()
            setSearch(state.globalFilter ?? '')
          }
          setPageSize(state.pageSize)
        }}
        onRowClick={(row) => navigate(`/inventory/${(row as InventoryRow).id}`)}
      />
    </div>
    </>
  )
}


