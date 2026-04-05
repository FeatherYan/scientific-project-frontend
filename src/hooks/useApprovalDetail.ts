import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import {
  approveProject,
  getApprovalDetail,
  rejectProject,
} from '../api/approval'

const approvalDetailKeys = {
  all: ['approval-detail'] as const,
  detail: (id: string) => [...approvalDetailKeys.all, id] as const,
}

export function useApprovalDetail(id: string) {
  return useQuery({
    queryKey: approvalDetailKeys.detail(id),
    queryFn: () => getApprovalDetail(id),
    enabled: Boolean(id),
  })
}

export function useApproveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      approveProject(id, comment),
    onSuccess: (data) => {
      message.success('审批已通过')
      void queryClient.invalidateQueries({ queryKey: ['approvals'] })
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
      void queryClient.setQueryData(approvalDetailKeys.detail(data.id), data)
    },
  })
}

export function useRejectProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      rejectProject(id, comment),
    onSuccess: (data) => {
      message.success('项目已退回申请人')
      void queryClient.invalidateQueries({ queryKey: ['approvals'] })
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
      void queryClient.setQueryData(approvalDetailKeys.detail(data.id), data)
    },
  })
}
