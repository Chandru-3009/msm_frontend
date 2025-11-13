import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { fetchUsers } from '../api'
import { UserRow } from '../types'
import downloadIcon from '@/assets/icons/download_icon.svg'
import PillSelect from '@/shared/components/PillSelect/PillSelect'

const columns: ColumnDef<UserRow>[] = [
  { accessorKey: 'name', header: 'User' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { id: 'action', header: 'Action', cell: () => <span style={{ opacity: .7 }}>⋯</span> },
]

export default function UsersTable() {
  const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const [role, setRole] = useState<string>('')
  const rows = Array.isArray(data) ? data : []

  const roles = useMemo(() => Array.from(new Set(rows.map((d) => d.role))), [rows])
  const filtered = useMemo(() => rows.filter((r) => (role ? r.role === role : true)), [rows, role])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
     
      <PillSelect
        value={role}
        onChange={setRole}
        options={roles.map((s) => ({ value: s, label: s }))}
        placeholder="All Roles"
        allOptionLabel="All Roles"
        ariaLabel="Filter by role"
      />
      <button className="icon-pill" title="Download">
        <img src={downloadIcon} alt="" />
      </button>
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


