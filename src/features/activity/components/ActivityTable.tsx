import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ActivityRow } from '../types'
import { fetchActivity } from '../api'

const columns: ColumnDef<ActivityRow>[] = [
  { accessorKey: 'dateTime', header: 'Date', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleString() : '-'
  } },
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'actionType', header: 'Action Type' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'durationMin', header: 'Duration', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v} min`
  } },
  { accessorKey: 'status', header: 'Status', cell: (c) => <span className="badge">{c.getValue<string | undefined>() ?? '-'}</span> },
]

export default function ActivityTable() {
  const { data, isLoading } = useQuery({ queryKey: ['activity'], queryFn: fetchActivity })
  const rows = Array.isArray(data) ? data : []

  const [status, setStatus] = useState<string>('')
  const statuses = useMemo(() => Array.from(new Set(rows.map((d) => d.status))), [rows])
  const filtered = useMemo(() => rows.filter((r) => (status ? r.status === status : true)), [rows, status])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <button className="btn">Filters</button>
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


