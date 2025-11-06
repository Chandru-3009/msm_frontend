import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { fetchUsers } from '../api'
import { UserRow } from '../types'

const columns: ColumnDef<UserRow>[] = [
  { accessorKey: 'name', header: 'User' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { id: 'action', header: 'Action', cell: () => <span style={{ opacity: .7 }}>⋯</span> },
]

export default function UsersTable() {
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const rows = Array.isArray(data) ? data : []

  const [role, setRole] = useState<string>('')
  const roles = useMemo(() => Array.from(new Set(rows.map((d) => d.role))), [rows])
  const filtered = useMemo(() => rows.filter((r) => (role ? r.role === role : true)), [rows, role])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
      <option value="">All Roles</option>
      {roles.map((r) => <option key={r} value={r}>{r}</option>)}
    </select>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


