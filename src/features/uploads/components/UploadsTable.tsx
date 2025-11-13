import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { UploadRow } from '../types'
import { fetchUploads } from '../api'
import { useMemo, useState } from 'react'
import StatusBadge from '@/shared/components/StatusBadge'

const columns: ColumnDef<UploadRow>[] = [
  { accessorKey: 'date', header: 'Date', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'fileName', header: 'File Name', cell: (c) => <a href="#">{c.getValue<string>()}</a> },
  { accessorKey: 'records', header: 'Records',cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'status', header: 'Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
  { id: 'action', header: 'Action', cell: () => <a href="#" className="small">Download</a> },
]

export default function UploadsTable() {
  const { data, isLoading } = useQuery({ queryKey: ['uploads'], queryFn: fetchUploads })
  const rows = Array.isArray(data) ? data : []

  const [type, setType] = useState<string>('')
  const types = useMemo(() => Array.from(new Set(rows.map((d) => d.type))).sort(), [rows])

  const filtered = useMemo(() => rows.filter((r) => (type ? r.type === type : true)), [rows, type])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8 }}>
      <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Data Type</option>
        {types.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <button className="btn btn-primary">Upload Data</button>
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


