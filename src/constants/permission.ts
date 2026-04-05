export const PERMISSIONS = {
  authLogin: 'auth:login',
  authLogout: 'auth:logout',
  projectList: 'project:list',
  projectCreate: 'project:create',
  projectEdit: 'project:edit',
  projectDelete: 'project:delete',
  projectSubmit: 'project:submit',
  projectViewMine: 'project:viewMine',
  approvalList: 'approval:list',
  approvalDetail: 'approval:detail',
  approvalApprove: 'approval:approve',
  approvalReject: 'approval:reject',
  notificationList: 'notification:list',
} as const

export type PermissionCode =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
