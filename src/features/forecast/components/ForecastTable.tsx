import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { ForecastRow } from '../types'
import {
  fetchForecast,
  fetchForecastFilterDaysUntilStockout,
  fetchForecastFilterProductTypes,
  fetchForecastFilterStatuses,
  fetchForecastFilterValueRanges,
} from '../api'
import { useMemo } from 'react'
import { useTableFilters, useFilterOptions, useFilterState, useTableKey } from '@/shared/hooks'
import Filters, { FiltersValue } from '@/shared/components/Filters/Filters'
import downloadIcon from '@/assets/icons/download_icon.svg'
import StatusBadge from '@/shared/components/StatusBadge'
import { inferStatusVariant, type Variant as StatusVariant } from '@/shared/components/StatusBadge/StatusBadge'
import PillSelect from '@/shared/components/PillSelect/PillSelect'
import Typography from '@/shared/components/Typography/Typography'

const columns: ColumnDef<ForecastRow>[] = [
  { accessorKey: 'part_number', header: 'Part Number' },
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
  { accessorKey: 'forecast_30_days', header: '30-Day Forecast',  cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v || '-'
  } },
  { accessorKey: 'next_reorder', header: 'Next Reorder', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'days_until_stockout', header: 'Days Until Stockout',  cell: (c) => {
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
  // ✅ Fetch server-provided filter options
  const { data: productTypesData } = useQuery({ 
    queryKey: ['forecast-filter-product-types'], 
    queryFn: fetchForecastFilterProductTypes 
  })
  const { data: valueRangesData } = useQuery({ 
    queryKey: ['forecast-filter-value-ranges'], 
    queryFn: fetchForecastFilterValueRanges 
  })
  const { data: daysUntilStockoutData } = useQuery({ 
    queryKey: ['forecast-filter-days-until-stockout'], 
    queryFn: fetchForecastFilterDaysUntilStockout 
  })
  const { data: statusesData } = useQuery({ 
    queryKey: ['forecast-filter-statuses'], 
    queryFn: fetchForecastFilterStatuses 
  })

  // ✅ Simplified filter option mapping using hooks
  const { options: productTypes, valueToId: productTypeNameToId } = useFilterOptions(productTypesData)
  const { options: statuses, valueToId: statusNameToId } = useFilterOptions(statusesData)

  const valueRanges = useMemo(() => (
    (valueRangesData ?? []).map(v => ({ key: String(v.id), label: v.value }))
  ), [valueRangesData])

  const daysOptions = useMemo(() => (
    (daysUntilStockoutData ?? []).map(d => ({ key: String(d.id), label: d.value, days: 0 }))
  ), [daysUntilStockoutData])

  // ✅ Use table filters hook for pagination and debounced search
  const { pageIndex, pageSize, search, debouncedSearch, setPageIndex, setPageSize, setSearch, resetPage } = useTableFilters()

  // ✅ Use filter state hook with auto page reset
  const [filters, setFilters] = useFilterState<FiltersValue>({ types: [] }, resetPage)
  const [status, setStatus] = useFilterState<string>('', resetPage)

  // Compute server params from UI selections
  const productTypeIds = useMemo(
    () => filters.types.map((name) => productTypeNameToId[name]).filter((id): id is number => typeof id === 'number'),
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
    queryKey: ['forecast', { search: debouncedSearch, productTypeIds, valueRangeIds, daysUntilIds, statusIds, pageIndex, pageSize }],
    queryFn: () => fetchForecast({
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

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Filters
        typeOptions={productTypes}
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
            setSearch(state.globalFilter)
          }
          // Update page size when changed
          if (state.pageSize !== pageSize) {
            setPageSize(state.pageSize)
            resetPage()
          }
        }}
        initialPageSize={pageSize}
        searchPlaceholder="Search forecast..."
      />
    </div>
  )
}


