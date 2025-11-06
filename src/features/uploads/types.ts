export type UploadRow = {
  id: string
  date: string
  user: string
  type: string
  fileName: string
  records: number
  status: 'Synced' | 'Failed'
}


