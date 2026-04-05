import { request } from '../request'
import type { ApiResponse } from '../request/types'

export type ApprovalRecord = {
  id: string
  projectTitle: string
  status: string
}

export function getApprovalList() {
  return request.get<ApiResponse<ApprovalRecord[]>>('/approvals')
}
