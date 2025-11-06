import PageHeader from '@/shared/components/Layout/PageHeader'
import ForecastTable from '../components/ForecastTable'

export default function ForecastPage() {
  return (
    <div>
      <PageHeader title="Forecast" />
      <ForecastTable />
    </div>
  )
}


