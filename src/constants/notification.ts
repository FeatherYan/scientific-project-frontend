export const NOTIFICATION_TYPE_OPTIONS = [
  { label: '全部类型', value: '' },
  { label: '审批结果', value: 'approval' },
  { label: '系统通知', value: 'system' },
] as const

export const NOTIFICATION_READ_OPTIONS = [
  { label: '全部状态', value: '' },
  { label: '未读', value: 'false' },
  { label: '已读', value: 'true' },
] as const

export const NOTIFICATION_TYPE_LABEL_MAP = {
  approval: '审批结果',
  system: '系统通知',
} as const
