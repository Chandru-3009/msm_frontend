import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { SalesRow } from '../types'
import { fetchSales, fetchSalesFilterCustomers, fetchSalesFilterDeliveryStatuses, fetchSalesMetrics } from '../api'
import { useMemo } from 'react'
import downloadIcon from '@/assets/icons/download_icon.svg'
import StatCard from '@/shared/components/StatCard'
import stockIcon from '@/assets/icons/stock_icon.svg'
import cartIcon from '@/assets/icons/cart_icon.svg'
import clockIcon from '@/assets/icons/clock_icon.svg'
import StatusBadge from '@/shared/components/StatusBadge'
import PillSelect from '@/shared/components/PillSelect'
import { useNavigate } from 'react-router-dom'
import { formatCompactCurrency, formatCompactNumber } from '@/shared/utils/numberFormat'
import { useTableFilters, useFilterOptions, useFilterState, useTableKey } from '@/shared/hooks'
import { useInfiniteEntityOptions } from '@/shared/hooks/useInfiniteEntityOptions'

const columns: ColumnDef<SalesRow>[] = [
  { accessorKey: 'order_date', header: 'Date', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'customer_name', header: 'Customer' },
  { accessorKey: 'po_number', header: 'PO Number' },
  { accessorKey: 'order_items', header: 'Items',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'order_qty', header: 'Qty',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'total_order_value', header: 'Order Value',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'order_status_display', header: 'Delivery Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
]

export default function SalesTable() {
  const navigate = useNavigate()

  // ✅ Infinite scroll for customers dropdown
  const customers = useInfiniteEntityOptions({
    queryKey: ['sales-filter-customers-infinite'],
    queryFn: fetchSalesFilterCustomers,
    getValue: (customer) => customer.customer_name,
    getLabel: (customer) => customer.customer_name,
    pageSize: 50,
  })

  // Server-provided filters (simple)
  const { data: deliveryStatusesData } = useQuery({ 
    queryKey: ['sales-filter-delivery-statuses'], 
    queryFn: fetchSalesFilterDeliveryStatuses 
  })

  // ✅ Simplified filter option mapping using hooks
  const { options: statuses, valueToId: statusNameToId } = useFilterOptions(deliveryStatusesData)

  // ✅ Use table filters hook for pagination and debounced search
  const { pageIndex, pageSize, search, debouncedSearch, setPageIndex, setPageSize, setSearch, resetPage } = useTableFilters()

  // ✅ Use filter state hook with auto page reset
  const [customer, setCustomer] = useFilterState<string>('', resetPage)
  const [deliveryStatus, setDeliveryStatus] = useFilterState<string>('', resetPage)

  // Compute server params from UI selections
  const customerNames = useMemo(
    () => customer ? [customers.labelToValue[customer] || customer] : [],
    [customer, customers.labelToValue]
  )
  const statusIds = useMemo(
    () => (deliveryStatus ? [statusNameToId[deliveryStatus]].filter((v): v is number => typeof v === 'number') : []),
    [deliveryStatus, statusNameToId]
  )

  const { data, isLoading } = useQuery({
    queryKey: ['sales', { search: debouncedSearch, customerNames, statusIds, pageIndex, pageSize }],
    queryFn: () => fetchSales({
      search: debouncedSearch || undefined,
      customerNames,
      statusIds,
      limit: pageSize,
      offset: pageIndex * pageSize,
    }),
    placeholderData: keepPreviousData,
  })

  const { data: metricsData } = useQuery({
    queryKey: ['sales-metrics'],
    queryFn: fetchSalesMetrics,
  })

  // ✅ Simplified handlers - resetPage is now handled by useFilterState automatically
  const rows = useMemo(() => data?.data?.items ?? [], [data])
  const pageCount = data?.data?.pagination?.total_pages ?? 1
  const totalRecords = data?.data?.pagination?.total ?? 0

  // ✅ Use hook for table key generation (excludes search to prevent input reset)
  const tableKey = useTableKey({
    customerNames,
    statusIds,
  })

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <PillSelect
        value={customer}
        onChange={setCustomer}
        options={customers.options}
        placeholder={customers.isLoading ? "Loading customers..." : "All Customers"}
        allOptionLabel="All Customers"
        ariaLabel="Filter by customer"
        onScrollBottom={customers.loadMore}
        loading={customers.isFetchingNextPage}
      />
      <PillSelect
        value={deliveryStatus}
        onChange={setDeliveryStatus}
        options={statuses.map((s: string) => ({ value: s, label: s }))}
        placeholder="All Delivery Status"
        allOptionLabel="All Delivery Status"
        ariaLabel="Filter by delivery status"
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
        title="Total orders"
        value={formatCompactNumber(Number(metricsData?.data?.total_orders))}
        
        iconSrc={stockIcon}
        type="stock"
        subtext="All Products"
      />
      <StatCard
        title="Total Revenue"
        value={formatCompactCurrency(Number(metricsData?.data?.total_revenue))}
        subvalue={metricsData?.data?.total_revenue_change}
        iconSrc={cartIcon}
        type="customer"
        subtext="vs last month"
      />
     
      <StatCard
        title="Total Quantity"
      value={formatCompactNumber(Number(metricsData?.data?.total_quantity_lbs))}
        subvalue={metricsData?.data?.total_quantity_lbs_change}
        iconSrc={clockIcon} 
        type="stockout"
        subtext="vs last month"
      />

      <StatCard
        title="Avg Order Value"
        value={formatCompactCurrency(Number(metricsData?.data?.avg_order_value))}
        subvalue={metricsData?.data?.avg_order_value_change}
        iconSrc={cartIcon}
        type="vendor"
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
        onRowClick={(row) => {
          const salesRow = row as SalesRow
          // Extract numeric ID from format "#00001" -> "1"
          const numericId = salesRow.id.replace('#', '').replace(/^0+/, '') || '0'
          navigate(`/sales/${numericId}`)
        }}
      />
    </div>
    </>
  )
}


