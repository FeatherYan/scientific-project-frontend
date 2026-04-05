import { request } from '../request'
import type { ApiResponse } from '../request/types'

export type ProjectRecord = {
  id: string
  title: string
  status: string
}

export function getProjectList() {
  return request.get<ApiResponse<ProjectRecord[]>>('/projects')
}
