import PageHeader from '@/shared/components/Layout/PageHeader'
import UsersTable from '../components/UsersTable'

export default function UserManagementPage() {
  return (
    <div>
      <PageHeader title="User Management" />
      <UsersTable />
    </div>
  )
}


