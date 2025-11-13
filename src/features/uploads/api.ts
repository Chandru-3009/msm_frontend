import { ApiClient } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import { UploadRow } from './types'
import uploadsMock from '@/mocks/uploads.json'

export async function fetchUploads(): Promise<UploadRow[]> {
  if (USE_MOCKS || !API_URL) return uploadsMock as UploadRow[]
  try {
    const { data } = await ApiClient.get<UploadRow[]>('/uploads')
    return Array.isArray(data) ? data : []
  } catch {
    return uploadsMock as UploadRow[]
  }
}


