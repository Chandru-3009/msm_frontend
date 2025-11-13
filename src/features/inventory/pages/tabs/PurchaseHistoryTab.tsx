import InlineAlert from '@/shared/components/InlineAlert'
import PurchaseAdvice from '@/shared/components/PurchaseAdvice'

export default function PurchaseHistoryTab() {
  return (
    <div>
      <div className="card" style={{ padding: 12 }}>
        <InlineAlert
          variant="success"
          items={[
            { label: 'Top Vendor:', value: 'Acme Steel (40% Orders)' },
            { label: 'Total Purchases (12 Months):', value: '12,000,000 lbs' },
            { label: 'Avg Price:', value: '$12.95/lb' },
          ]}
        />
      </div>

      <div className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Quantity</h3>
        <PurchaseAdvice
          variant="neutral"
          columns={3}
          items={[
            { label: 'Last 7 days', value: '7020 lbs', trendText: '+12% than previous period', trendTone: 'up' },
            { label: 'Last 15 days', value: '9880 lbs', trendText: '+2% than previous period', trendTone: 'up' },
            { label: 'Last 30 days', value: '11050 lbs', trendText: '-5% than previous period', trendTone: 'down' },
          ]}
        />
      </div>
    </div>
  )
}


