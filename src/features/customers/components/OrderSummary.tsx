import styles from './OrderSummaryHeader.module.css'
import { OrderSummary } from '../types'
import Typography from '@/shared/components/Typography'
import StatusBadge from '@/shared/components/StatusBadge'

type Props = {
  data: OrderSummary
}

export default function OrderSummaryHeader({ data }: Props) {
  const unitPrice = data.totalQuantityLbs > 0 ? data.totalValueUsd / data.totalQuantityLbs : 0
  return (
    <div className={styles.wrap}>
      <div className={styles.row1}>
        <div>
          <Typography size="xl" weight="semibold" color="heading">Order #{data.orderNumber}</Typography>
          <StatusBadge className={styles.statusBadge} label={data.status} radius="sm" />
          <div className={styles.leftMeta}>
            <Typography size="sm" color="muted">Date: <Typography as="span" weight="medium" color="default">{data.date}</Typography></Typography>
            {data.customerOrder && (
              <Typography size="sm" color="muted">Customer Order: <Typography as="span" weight="medium" color="default">{data.customerOrder}</Typography></Typography>
            )}
            {data.leadTimeDays != null && (
              <Typography size="sm" color="muted">Lead Time: <Typography as="span" weight="medium" color="default">{data.leadTimeDays} days</Typography></Typography>
            )}
          </div>
        </div>
        <div className={styles.amountBox}>
          <Typography size="sm" color="muted">Total Order Value</Typography>
          <Typography size="xl" weight="semibold" color="default">${data.totalValueUsd.toLocaleString()}</Typography>
          <Typography size="sm" color="primary">
            {data.totalQuantityLbs.toLocaleString()} lbs • ${unitPrice.toFixed(2)}/lb
          </Typography>
        </div>
      </div>
      <div className={styles.row2}>
        <div className={styles.innerRow}>
          <Typography size="sm" color="muted">Vendor</Typography>
          <Typography weight="medium" color="default">{data.vendor ?? '-'}</Typography>
        </div>
        <div className={styles.innerRow}>
          <Typography size="sm" color="muted">Payment Terms</Typography>
          <Typography weight="medium" color="default">{data.paymentTerms}</Typography>
        </div>
        <div className={styles.innerRow}>
          <Typography size="sm" color="muted">Ship Via</Typography>
          <Typography weight="medium" color="default">{data.shipVia}</Typography>
        </div>
        <div className={styles.innerRow}>
          <Typography size="sm" color="muted">FOB</Typography>
          <Typography weight="medium" color="default">{data.fob ?? '-'}</Typography>
        </div>
        <div className={styles.innerRow}>
          <Typography size="sm" color="muted">Freight Cost</Typography>
          <Typography weight="medium" color="default">{data.freightCostUsd != null ? `$${data.freightCostUsd.toFixed(2)}` : '-'}</Typography>
        </div>
        <div className={styles.innerRow}>
          <Typography size="sm" color="muted">Expected Delivery</Typography>
          <Typography weight="medium" color="default">{data.expectedDelivery ?? '-'}</Typography>
        </div>
      </div>
    </div>
  )
}


