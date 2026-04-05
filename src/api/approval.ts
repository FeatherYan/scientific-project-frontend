import { request } from '../request'
import type { ApiResponse } from '../request/types'
import type { ProjectListParams, ProjectRecord } from '../types/project'

export async function getApprovalList(params: ProjectListParams = {}) {
  const response = await request.get<ApiResponse<ProjectRecord[]>>('/approvals', {
    params,
  })
  return response.data.data
}

export async function getApprovalDetail(id: string) {
  const response = await request.get<ApiResponse<ProjectRecord>>(`/approvals/${id}`)
  return response.data.data
}

export async function approveProject(id: string, comment: string) {
  const response = await request.post<ApiResponse<ProjectRecord>>(
    `/approvals/${id}/approve`,
    { comment },
  )
  return response.data.data
}

export async function rejectProject(id: string, comment: string) {
  const response = await request.post<ApiResponse<ProjectRecord>>(
    `/approvals/${id}/reject`,
    { comment },
  )
  return response.data.data
}
