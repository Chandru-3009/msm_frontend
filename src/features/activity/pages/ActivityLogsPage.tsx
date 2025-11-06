import PageHeader from '@/shared/components/Layout/PageHeader'
import ActivityTable from '../components/ActivityTable'

export default function ActivityLogsPage() {
  return (
    <div>
      <PageHeader title="Activity Logs" />
      <ActivityTable />
    </div>
  )
}


