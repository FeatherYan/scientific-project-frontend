export const PROJECT_STATUS = {
  draft: 'draft',
  submitted: 'submitted',
  approving: 'approving',
  approved: 'approved',
  rejected: 'rejected',
} as const

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS]

export const PROJECT_STATUS_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '草稿', value: PROJECT_STATUS.draft },
  { label: '已提交', value: PROJECT_STATUS.submitted },
  { label: '审批中', value: PROJECT_STATUS.approving },
  { label: '已通过', value: PROJECT_STATUS.approved },
  { label: '已退回', value: PROJECT_STATUS.rejected },
] as const

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  draft: { label: '草稿', color: 'default' },
  submitted: { label: '已提交', color: 'processing' },
  approving: { label: '审批中', color: 'blue' },
  approved: { label: '已通过', color: 'success' },
  rejected: { label: '已退回', color: 'error' },
}
