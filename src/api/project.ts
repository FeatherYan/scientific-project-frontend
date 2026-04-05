import { request } from '../request'
import type { ApiResponse } from '../request/types'
import type { ProjectListParams, ProjectRecord } from '../types/project'
import type { ProjectOpportunity } from '../types/projectOpportunity'

export async function getProjectOpportunityList(params: ProjectListParams = {}) {
  const response = await request.get<ApiResponse<ProjectOpportunity[]>>(
    '/project-opportunities',
    {
      params,
    },
  )
  return response.data.data
}

export async function getProjectOpportunityDetail(id: string) {
  const response = await request.get<ApiResponse<ProjectOpportunity>>(
    `/project-opportunities/${id}`,
  )
  return response.data.data
}

export async function applyProjectOpportunity(id: string) {
  const response = await request.post<ApiResponse<ProjectRecord>>(
    `/project-opportunities/${id}/apply`,
  )
  return response.data.data
}

export async function getMyProjectList(params: ProjectListParams = {}) {
  const response = await request.get<ApiResponse<ProjectRecord[]>>('/projects', {
    params,
  })
  return response.data.data
}

export async function submitProject(id: string) {
  const response = await request.post<ApiResponse<ProjectRecord>>(
    `/projects/${id}/submit`,
  )
  return response.data.data
}

export async function deleteProject(id: string) {
  const response = await request.delete<ApiResponse<{ id: string }>>(
    `/projects/${id}`,
  )
  return response.data.data
}
