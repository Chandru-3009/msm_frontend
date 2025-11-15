import InlineAlert from '@/shared/components/InlineAlert'
import PurchaseAdvice from '@/shared/components/PurchaseAdvice'
import DataTable from '@/shared/components/DataTable/DataTable'
export default function QuoteHistoryTab() {
  return (
    <div>
      <div className="card" style={{ padding: 12 }}>
        <InlineAlert
          variant="success"
          items={[
            { label: 'Top Requester:', value: 'XYZ Manufacturing (30% Quotes)' },
            { label: 'Total Quotes (12 Months):', value: '4,500,000 lbs' },
            { label: 'Avg Quoted Price:', value: '$14.15/lb' },
          ]}
        />
      </div>

      <div className="card" style={{ padding: 12, marginTop: 12, marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Quantity</h3>
        <PurchaseAdvice
          variant="neutral"
          columns={3}
          items={[
            { label: 'Last 7 days', value: '4020 lbs', trendText: '+8% than previous period', trendTone: 'up' },
            { label: 'Last 15 days', value: '7980 lbs', trendText: '-3% than previous period', trendTone: 'down' },
            { label: 'Last 30 days', value: '9050 lbs', trendText: '0% than previous period', trendTone: 'neutral' },
          ]}
        />
      </div>
      <DataTable
        enableGlobalFilter={false}
        data={[]}
        columns={[
          { accessorKey: 'date', header: 'Date' },
          { accessorKey: 'customer', header: 'Customer' },
          { accessorKey: 'quantity', header: 'Quantity' },
          { accessorKey: 'price', header: 'Price' },
        ]}
      />
    </div>
  )
}


