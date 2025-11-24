import { Outlet, useParams } from 'react-router-dom'
import BackHeader from '@/shared/components/BackHeader/BackHeader'
import Tabs from '@/shared/components/Tabs'
import styles from './InventoryDetailPage.module.css'
import InlineStats from '@/shared/components/InlineStats'
import StatusBadge from '@/shared/components/StatusBadge'

export default function InventoryDetailPage() {
  const { id = '' } = useParams()
  
  const tabs = [
    { to: 'stocksales', label: 'Stock Status' },
    { to: 'saleshistory', label: 'Sales History' },
    { to: 'purchasehistory', label: 'Purchase History' },
    { to: 'quotehistory', label: 'Quote History' },
  ]

  if (!id) return <div className={`card ${styles.pad16}`}>Invalid item</div>

  return (
    <div className={`${styles.container}`}>
      <BackHeader
        to="/inventory"
        title={<h2 className={styles.title}>Inventory Item #{id}</h2>}
        right={<>
          <StatusBadge label="Active" radius="sm" />
          <StatusBadge label="Demand increasing" radius="sm" />
        </>}
      />
      <div className={styles.statsRow}>
        <InlineStats
          segments={[
            { label: '304FWR' },
            { label: '0.0080" 304 SS FINE WIRE ROD' },
            { label: 'lb' },
          ]}
        />
        <InlineStats
          prefix="Last 7 days:"
          segments={[
            { label: 'Quote(6000 lbs)', trend: 'up' },
            { label: 'SO(4000 lbs)', trend: 'down' },
            { label: 'PO(2500 lbs)', trend: 'up' },
          ]}
        />
      </div>

      <Tabs items={tabs} />
      <div className={styles.spacer12} />

      <Outlet />
    </div>
  )
}


