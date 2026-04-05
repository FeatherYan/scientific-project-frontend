import { useQuery } from '@tanstack/react-query'
import { getApprovalList } from '../api/approval'
import type { ProjectListParams } from '../types/project'

const approvalKeys = {
  all: ['approvals'] as const,
  list: (params: ProjectListParams) => [...approvalKeys.all, 'list', params] as const,
}

export function useApprovalList(params: ProjectListParams) {
  return useQuery({
    queryKey: approvalKeys.list(params),
    queryFn: () => getApprovalList(params),
  })
}
