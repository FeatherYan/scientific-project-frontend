import type { MenuItemType } from 'antd/es/menu/interface'
import type { PermissionCode } from '../constants/permission'
import type { Role } from '../constants/role'
import { canAccessRoute } from './access'

type MenuRoute = {
  key: string
  label: string
  iconName?: string
  roles?: Role[]
  requiredPermissions?: PermissionCode[]
  children?: MenuRoute[]
}

export type AppMenuItem = MenuItemType & {
  iconName?: string
  children?: AppMenuItem[]
}

const menuRouteTree: MenuRoute[] = [
  {
    key: '/dashboard',
    label: '工作台',
    iconName: 'dashboard',
  },
  {
    key: '/projects/list',
    label: '项目申报',
    iconName: 'project',
    roles: ['user'],
    requiredPermissions: ['project:list'],
    children: [
      {
        key: '/projects/list',
        label: '申报列表',
        iconName: 'project',
        roles: ['user'],
        requiredPermissions: ['project:list'],
      },
      {
        key: '/projects/new',
        label: '新建申报',
        iconName: 'form',
        roles: ['user'],
        requiredPermissions: ['project:create'],
      },
      {
        key: '/projects/mine',
        label: '我的申报',
        iconName: 'mine',
        roles: ['user'],
        requiredPermissions: ['project:viewMine'],
      },
    ],
  },
  {
    key: '/approvals/list',
    label: '审批管理',
    iconName: 'approval',
    roles: ['admin'],
    requiredPermissions: ['approval:list'],
    children: [
      {
        key: '/approvals/list',
        label: '审批列表',
        iconName: 'approval',
        roles: ['admin'],
        requiredPermissions: ['approval:list'],
      },
    ],
  },
  {
    key: '/notifications',
    label: '通知中心',
    iconName: 'notification',
    roles: ['user', 'admin'],
    requiredPermissions: ['notification:list'],
  },
]

function getVisibleMenus(
  routes: MenuRoute[],
  role: Role | null,
  permissions: PermissionCode[],
): AppMenuItem[] {
  return routes
    .filter((route) =>
      canAccessRoute({
        isAuthenticated: true,
        role,
        permissions,
        requiresAuth: true,
        roles: route.roles,
        requiredPermissions: route.requiredPermissions,
      }),
    )
    .map((route) => ({
      key: route.key,
      label: route.label,
      iconName: route.iconName,
      children: route.children
        ? getVisibleMenus(route.children, role, permissions)
        : undefined,
    }) as AppMenuItem)
}

export function getMenuItems(
  role: Role | null,
  permissions: PermissionCode[],
): AppMenuItem[] {
  return getVisibleMenus(menuRouteTree, role, permissions)
}
