import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { OrderItemRow } from '@/features/customers/types'
import { fetchPurchaseOrderItems } from '../api'
import OrderSummaryHeader from '@/features/customers/components/OrderSummary'

const columns: ColumnDef<OrderItemRow>[] = [
  { accessorKey: 'partNumber', header: 'Part Number' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'size', header: 'Size' },
  {
    accessorKey: 'qtyLbs',
    header: 'Qty',
    meta: { align: 'right' as const },
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `${v.toLocaleString()} lbs`
    },
  },
  {
    accessorKey: 'pricePerLb',
    header: 'Price/lb',
    meta: { align: 'right' as const },
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `$${v.toLocaleString()}`
    },
  },
  {
    accessorKey: 'subtotalUsd',
    header: 'Subtotal',
    meta: { align: 'right' as const },
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `$${v.toLocaleString()}`
    },
  },
  { accessorKey: 'lot', header: 'Lot #' },
  { accessorKey: 'deliveryDate', header: 'Delivery Date' },
]

export default function OrderItemsTable() {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['purchase-order-items', id],
    queryFn: () => fetchPurchaseOrderItems(id ?? ''),
    enabled: !!id,
  })

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  if (isError) return <div className="card" style={{ padding: 16, color: 'crimson' }}>Failed to load order{(error as any)?.message ? `: ${(error as any).message}` : ''}</div>

  const items = data?.items ?? []
  const summary = data?.summary

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {summary && <OrderSummaryHeader data={summary} />}
      <div className="card" style={{ padding: 16 }}>
        <DataTable enableGlobalFilter={false} data={items} columns={columns} />
      </div>
    </div>
  )
}


