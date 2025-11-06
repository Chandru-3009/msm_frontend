export type ActivityRow = {
  id: string
  dateTime: string
  user: string
  actionType: 'Sync' | 'Upload' | 'Insight'
  description: string
  durationMin: number
  status: 'Success' | 'Warning' | 'Failed'
}


