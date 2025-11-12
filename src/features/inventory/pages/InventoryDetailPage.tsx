import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchInventoryDetail } from '../api'
import Tabs from '@/shared/components/Tabs'


export default function InventoryDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({ queryKey: ['inventory-detail', id], queryFn: () => fetchInventoryDetail(id), enabled: !!id })
  const tabs = [
    { to: 'stocksales', label: 'Stock Status' },
    { to: 'saleshistory', label: 'Sales History' },
    { to: 'purchasehistory', label: 'Purchase History' },
    { to: 'quotehistory', label: 'Quote History' },
  ]

  if (!id) return <div className="card" style={{ padding: 16 }}>Invalid item</div>
  if (isLoading || !data) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <button className="btn" onClick={() => navigate(-1)}>{'‹ Back'}</button>
        <h2 style={{ margin: 0 }}>{data.partNumber}</h2>
        <span className="badge" style={{ marginLeft: 8 }}>{data.status}</span>
      </div>

      <Tabs items={tabs} />
      <div style={{ height: 12 }} />

      <Outlet context={{ detail: data }} />
    </div>
  )
}


