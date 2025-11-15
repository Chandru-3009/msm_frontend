import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { UploadRow } from '../types'
import { fetchUploads } from '../api'
import { useMemo, useState } from 'react'
import StatusBadge from '@/shared/components/StatusBadge'
import PillSelect from '@/shared/components/PillSelect/PillSelect'
import Button from '@/shared/components/Button/Button'
import downloadIcon from '@/assets/icons/download_icon.svg'
import downloadLinkIcon from '@/assets/icons/doc_icon.svg'
import Typography from '@/shared/components/Typography/Typography'



const columns: ColumnDef<UploadRow>[] = [
  { accessorKey: 'date', header: 'Date', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'fileName', header: 'File Name', cell: (c) => <Typography as="span" size="md" weight="medium" color="primary">{c.getValue<string>()}</Typography> },
  { accessorKey: 'records',  header: 'Records',cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'status', header: 'Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
  { id: 'action', header: 'Action', meta: { align: 'center' as const }, cell: () => <img src={downloadLinkIcon} alt="Download" /> },
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
      <PillSelect
        value={type}
        onChange={setType}
        options={types.map((t) => ({ value: t, label: t }))}
        placeholder="All Data Types"
        allOptionLabel="All Data Types"
        ariaLabel="Filter by data type"
      />
        <Button variant="primary" icon={<img src={downloadIcon} alt="Download" />}>
          Upload Data
        </Button>
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable data={filtered} columns={columns} toolbarRight={toolbarRight} />
    </div>
  )
}


