import { request } from '../request'
import type { ApiResponse } from '../request/types'
import type { ProjectListParams, ProjectRecord } from '../types/project'

export async function getApprovalList(params: ProjectListParams = {}) {
  const response = await request.get<ApiResponse<ProjectRecord[]>>('/approvals', {
    params,
  })
  return response.data.data
}
