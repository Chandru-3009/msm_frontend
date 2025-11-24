import { ApiClient } from '@/shared/api/http'
import { UserRow } from './types'


export type UserQueryParams = {
  search?: string
  role?: string
}

export type UserListResponse = {
  data: {
    users: UserRow[]
  }
}

function buildQueryString(params: UserQueryParams): string {
  const query: string[] = []
  if (params.search) query.push(`search=${encodeURIComponent(params.search)}`)
  if (params.role) query.push(`role=${encodeURIComponent(params.role.toUpperCase())}`)
  
  return query.length ? `?${query.join('&')}` : ''
}

export async function fetchUsers(params: UserQueryParams = {}): Promise<UserListResponse> {

  const qs = buildQueryString(params)

  try {
    const { data } = await ApiClient.get<UserListResponse>(`/users/management/${qs}`)
    return data
  } catch { 
    return {
      data: {
        users: [],  
      },
    }
  }
}


export async function fetchRoles(): Promise<any[]> {
  try {
    const { data } = await ApiClient.get<any>('/roles')
    const roles = data?.data?.roles ?? []
    // Transform to match useFilterOptions format: { id: number, value: string }
    // Using the role name as the value for display and filtering
    return Array.isArray(roles) ? roles.map((role: any, index: number) => ({
      id: index + 1,
      value: role.name,
      originalId: role.id // Keep original ID for reference if needed
    })) : []
  } catch {
    return []
  }
}
