import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { CustomerRow } from '../types'
import { fetchCustomers } from '../api'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useTableFilters, useTableKey } from '@/shared/hooks'

const columns: ColumnDef<CustomerRow>[] = [
  { accessorKey: 'customer_name', header: 'Customer' },
  { accessorKey: 'total_orders', header: 'Total Orders',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  {
    accessorKey: 'total_qty',
    header: 'Total Quantity',
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `${v.toLocaleString()} lbs`
    },
  },
  {
    accessorKey: 'total_value',
    header: 'Total Value',
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `$${v.toLocaleString()}`
      
    },
  },
]

export default function CustomersTable() {
  const navigate = useNavigate()

  // ✅ Use table filters hook for pagination and debounced search
  const { pageIndex, pageSize, search, debouncedSearch, setPageIndex, setPageSize, setSearch, resetPage } = useTableFilters()

  const { data, isLoading } = useQuery({
    queryKey: ['customers', { search: debouncedSearch, pageIndex, pageSize }],
    queryFn: () => fetchCustomers({
      search: debouncedSearch || undefined,
      limit: pageSize,
      offset: pageIndex * pageSize,
    }),
    placeholderData: keepPreviousData,
  })

  // Debug: Log the API response


  const rows = useMemo(() => data?.data?.customers ?? [], [data])
  const pageCount = data?.data?.pagination?.total_pages ?? 1
  const totalRecords = data?.data?.pagination?.total ?? 0

  // Debug: Log extracted data
  console.log('Rows:', rows.length, 'Page Count:', pageCount, 'Total Records:', totalRecords)

  // ✅ Use hook for table key generation
  const tableKey = useTableKey({
    // Add filter params here if you add filters later
  })

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        key={tableKey}
        loading={isLoading}
        totalRecords={totalRecords}
        data={rows}
        columns={columns}
        searchPlaceholder="Search customers..."
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
        onRowClick={(row) => navigate(`/customers/${(row as CustomerRow).id}`)}
      />
    </div>
  )
}


