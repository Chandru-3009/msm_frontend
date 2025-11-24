import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { fetchPurchases } from '../api'
import { PurchaseRow } from '../types'
import { useMemo } from 'react'
import StatusBadge from '@/shared/components/StatusBadge'
import PillSelect from '@/shared/components/PillSelect'
import { useNavigate } from 'react-router-dom'
import { useTableFilters, useFilterState, useTableKey } from '@/shared/hooks'

const columns: ColumnDef<PurchaseRow>[] = [
  { accessorKey: 'date', header: 'Date', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'vendor_name', header: 'Vendor' },
  { accessorKey: 'vendor_po', header: 'Vendor PO' },
  { accessorKey: 'items_count', header: 'Items',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'quantity_lbs', header: 'Weight',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'eta_date', header: 'ETA', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'status', header: 'Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
]

export default function PurchaseTable() {
  const navigate = useNavigate()

  // ✅ Use table filters hook for pagination and debounced search
  const { pageIndex, pageSize, search, debouncedSearch, setPageIndex, setPageSize, setSearch, resetPage } = useTableFilters()

  // ✅ Use filter state hook with auto page reset
  const [vendor, setVendor] = useFilterState<string>('', resetPage)
  const [status, setStatus] = useFilterState<string>('', resetPage)

  // Compute server params from UI selections
  const vendorNames = useMemo(
    () => vendor ? [vendor] : [],
    [vendor]
  )
  const statusIds = useMemo(
    () => status ? [] : [], // TODO: Add status filter logic if needed
    [status]
  )

  const { data, isLoading } = useQuery({
    queryKey: ['purchases', { search: debouncedSearch, vendorNames, statusIds, pageIndex, pageSize }],
    queryFn: () => fetchPurchases({
      search: debouncedSearch || undefined,
      vendorNames,
      statusIds,
      limit: pageSize,
      offset: pageIndex * pageSize,
    }),
    placeholderData: keepPreviousData,
  })

  // ✅ Simplified handlers - resetPage is now handled by useFilterState automatically
  const rows = useMemo(() => data?.data?.purchases ?? [], [data])
  const pageCount = data?.data?.pagination?.total_pages ?? 1
  const totalRecords = data?.data?.pagination?.total ?? 0

  // ✅ Use hook for table key generation (excludes search to prevent input reset)
  const tableKey = useTableKey({
    vendorNames,
    statusIds,
  })

  const vendors = useMemo(() => Array.from(new Set(rows?.map((d) => d.vendor) ?? [])).sort(), [rows])

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <PillSelect
        value={vendor}
        onChange={setVendor}
        options={vendors.map((v) => ({ value: v, label: v }))}
        placeholder="All Vendors"
        allOptionLabel="All Vendors"
        ariaLabel="Filter by vendor"
      />
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
        searchPlaceholder="Search"
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
        onRowClick={(row) => navigate(`/purchase/${(row as PurchaseRow).id}`)}
      />
    </div>
  )
}


