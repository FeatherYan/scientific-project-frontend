export const ROUTE_PATHS = {
  root: '/',
  login: '/login',
  dashboard: '/dashboard',
  projectList: '/projects/list',
  projectDetail: '/projects/:id',
  projectNew: '/projects/new',
  projectEdit: '/projects/:id/edit',
  projectMine: '/projects/mine',
  approvalList: '/approvals/list',
  approvalDetail: '/approvals/:id',
  notificationList: '/notifications',
  forbidden: '/403',
} as const
