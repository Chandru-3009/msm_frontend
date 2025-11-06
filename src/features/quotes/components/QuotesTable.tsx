import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { fetchQuotes } from '../api'
import { QuoteRow } from '../types'

const columns: ColumnDef<QuoteRow>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: (c) => {
      const v = c.getValue<string | undefined | null>()
      return v ? new Date(v).toLocaleDateString() : '-'
    },
  },
  { accessorKey: 'quoteNo', header: 'Quote #' },
  { accessorKey: 'customer', header: 'Customer' },
  {
    accessorKey: 'qty',
    header: 'Qty',
    meta: { align: 'right' as const },
    cell: (c) => {
      const v = c.getValue<number | undefined | null>()
      return v == null ? '-' : v.toLocaleString()
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    meta: { align: 'right' as const },
    cell: (c) => {
      const v = c.getValue<number | undefined | null>()
      return v == null ? '-' : `$${v.toLocaleString()}`
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (c) => <span className="badge">{c.getValue<string | undefined>() ?? '-'}</span>,
  },
]

export default function QuotesTable() {
  const { data = [], isLoading } = useQuery({ queryKey: ['quotes'], queryFn: fetchQuotes })
  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={data} columns={columns} />
    </div>
  )
}


