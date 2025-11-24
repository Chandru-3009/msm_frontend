import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { OrderItemRow } from '@/features/customers/types'
import { fetchQuoteOrderItems } from '../api'
import OrderSummaryHeader from '@/features/customers/components/OrderSummary'

const columns: ColumnDef<OrderItemRow>[] = [
  { accessorKey: 'partNumber', header: 'Part Number' },
  { accessorKey: 'type', header: 'Specifications' },
  { accessorKey: 'qtyLbs', header: 'Quantity', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'pricePerLb', header: 'Price/lb', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'subtotalUsd', header: 'Subtotal', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'deliveryDate', header: 'Status' },
]

export default function QuoteItemsTable() {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['quote-items', id],
    queryFn: () => fetchQuoteOrderItems(id ?? ''),
    enabled: !!id,
  })

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  if (isError) return <div className="card" style={{ padding: 16, color: 'crimson' }}>Failed to load quote{(error as any)?.message ? `: ${(error as any).message}` : ''}</div>

  const items = data?.items ?? []
  const summary = data?.summary

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {summary && <OrderSummaryHeader data={summary} showRow2={false} />}
      <div className="card" style={{ padding: 16 }}>
        <DataTable enablePagination={false} enableGlobalFilter={false} data={items} columns={columns} />
      </div>
    </div>
  )
}


