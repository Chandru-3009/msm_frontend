import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useMemo } from 'react'
import downloadIcon from '@/assets/icons/download_icon.svg'
import { fetchQuotes } from '../api'
import { QuoteRow } from '../types'
import StatusBadge from '@/shared/components/StatusBadge'
import PillSelect from '@/shared/components/PillSelect/PillSelect'
import { useNavigate } from 'react-router-dom'
import { useTableFilters, useFilterState, useTableKey } from '@/shared/hooks'
import { formatCompactCurrency } from '@/shared/utils/numberFormat'  
const columns: ColumnDef<QuoteRow>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: (c) => {
      const v = c.getValue<string | undefined | null>()
      return v ? new Date(v).toLocaleDateString() : '-'
    },
  },
  { accessorKey: 'quote_number', header: 'Quote #' },
  { accessorKey: 'customer_name', header: 'Customer' },
  { accessorKey: 'items_count', header: 'Items' },
  { accessorKey: 'total_quantity_lbs', header: 'Total Qty',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  {
    accessorKey: 'order_value',
    header: 'Quote Value',
    
    cell: (c) => {
      const v = c.getValue<number | undefined | null>()
      return v == null ? '-' : `$${formatCompactCurrency(v)}`
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" />,
  },
]

export default function QuotesTable() {
  const navigate = useNavigate()

  // ✅ Use table filters hook for pagination and debounced search
  const { pageIndex, pageSize, search, debouncedSearch, setPageIndex, setPageSize, setSearch, resetPage } = useTableFilters()

  // ✅ Use filter state hook with auto page reset
  const [customer, setCustomer] = useFilterState<string>('', resetPage)
  const [status, setStatus] = useFilterState<string>('', resetPage)

  // Compute server params from UI selections
  const customerNames = useMemo(
    () => customer ? [customer] : [],
    [customer]
  )
  const statusIds = useMemo(
    () => status ? [] : [], // TODO: Add status filter logic if needed
    [status]
  )

  const { data, isLoading } = useQuery({
    queryKey: ['quotes', { search: debouncedSearch, customerNames, statusIds, pageIndex, pageSize }],
    queryFn: () => fetchQuotes({
      search: debouncedSearch || undefined,
      customerNames,
      statusIds,
      limit: pageSize,
      offset: pageIndex * pageSize,
    }),
    placeholderData: keepPreviousData,
  })

  // ✅ Simplified handlers - resetPage is now handled by useFilterState automatically
  const rows = useMemo(() => data?.data?.quotes ?? [], [data])
  const pageCount = data?.data?.pagination?.total_pages ?? 1
  const totalRecords = data?.data?.pagination?.total ?? 0

  // ✅ Use hook for table key generation (excludes search to prevent input reset)
  const tableKey = useTableKey({
    customerNames,
    statusIds,
  })

  const statuses = useMemo(() => Array.from(new Set(rows.map((d) => d.status))), [rows])
  const customers = useMemo(() => Array.from(new Set(rows.map((d) => d.customer))).sort(), [rows])

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <PillSelect
        value={status}
        onChange={setStatus}
        options={statuses.map((s) => ({ value: s, label: s }))}
        placeholder="All Status"
        allOptionLabel="All Status"
        ariaLabel="Filter by status"
      />
      <PillSelect
        value={customer}
        onChange={setCustomer}
        options={customers.map((c) => ({ value: c, label: c }))}
        placeholder="All Customers"
        allOptionLabel="All Customers"
        ariaLabel="Filter by customer"
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
            setSearch(state.globalFilter ?? '')
          }
          setPageSize(state.pageSize)
        }}
        onRowClick={(row) => navigate(`/quotes/${(row as QuoteRow).id}`)}
      />
    </div>
  )
}


