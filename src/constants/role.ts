import { PERMISSIONS } from './permission'

export const ROLES = {
  user: 'user',
  admin: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABEL_MAP: Record<Role, string> = {
  user: '普通用户',
  admin: '管理员',
}

export const ROLE_PERMISSION_MAP = {
  user: [
    PERMISSIONS.projectList,
    PERMISSIONS.projectCreate,
    PERMISSIONS.projectEdit,
    PERMISSIONS.projectDelete,
    PERMISSIONS.projectSubmit,
    PERMISSIONS.projectViewMine,
    PERMISSIONS.notificationList,
  ],
  admin: [
    PERMISSIONS.approvalList,
    PERMISSIONS.approvalDetail,
    PERMISSIONS.approvalApprove,
    PERMISSIONS.approvalReject,
    PERMISSIONS.notificationList,
  ],
} as const
