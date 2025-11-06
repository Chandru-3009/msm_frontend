import PageHeader from '@/shared/components/Layout/PageHeader'
import InventoryTable from '../components/InventoryTable'

export default function InventoryPage() {
  return (
    <div>
      <PageHeader title="Inventory Master" />
      <InventoryTable />
    </div>
  )
}


