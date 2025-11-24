import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchUsers, fetchRoles } from '../api'
import { UserRow } from '../types'
import downloadIcon from '@/assets/icons/download_icon.svg'
import PillSelect from '@/shared/components/PillSelect/PillSelect'
import { useFilterOptions, useTableFilters, useFilterState } from '@/shared/hooks'

const columns: ColumnDef<UserRow>[] = [
  { accessorKey: 'username', header: 'User' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
  { id: 'action', header: 'Action', cell: () => <span style={{ opacity: .7 }}>⋯</span> },
]

export default function UsersTable() {
  // ✅ Use table filters hook for debounced search
  const { search, debouncedSearch, setSearch } = useTableFilters()
  
  const { data: rolesData } = useQuery({ queryKey: ['roles'], queryFn: fetchRoles }) as { data: any[] }
  const { options: rolesOptions, valueToId: roleNameToId } = useFilterOptions(rolesData)
  
  // ✅ Use filter state hook
  const [role, setRole] = useFilterState<string>('', () => {})
  
  const roleIds = useMemo(
    () => (role ? [roleNameToId[role]].filter((v): v is number => typeof v === 'number') : []),
    [role, roleNameToId]
  )
  
  const { data, isLoading } = useQuery({ 
    queryKey: ['users', { role: roleIds, search: debouncedSearch }], 
    queryFn: () => fetchUsers({ role, search: debouncedSearch || undefined }) 
  })
  const users = data?.data?.users ?? []

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
     
      <PillSelect
        value={role}
        onChange={setRole}
        options={rolesOptions.map((r) => ({ value: r, label: r }))}
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
      <DataTable
        enablePagination={false}
        loading={isLoading}
        data={users}
        columns={columns}
        toolbarRight={toolbarRight}
        searchPlaceholder="Search users..."
        onChange={(state) => {
          setSearch(state.globalFilter ?? '')
        }}
      />
    </div>
  )
}


