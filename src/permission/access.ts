import { ROUTE_PATHS } from '../constants/route'
import { ROLES, type Role } from '../constants/role'
import type { PermissionCode } from '../constants/permission'

export function hasRole(userRole: Role | null, roles?: Role[]) {
  if (!roles || roles.length === 0) {
    return true
  }

  if (!userRole) {
    return false
  }

  return roles.includes(userRole)
}

export function hasPermission(
  userPermissions: PermissionCode[],
  requiredPermissions?: PermissionCode[],
) {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }

  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  )
}

export function canAccessRoute(params: {
  isAuthenticated: boolean
  role: Role | null
  permissions: PermissionCode[]
  requiresAuth?: boolean
  roles?: Role[]
  requiredPermissions?: PermissionCode[]
}) {
  const {
    isAuthenticated,
    role,
    permissions,
    requiresAuth,
    roles,
    requiredPermissions,
  } = params

  if (!requiresAuth) {
    return true
  }

  if (!isAuthenticated) {
    return false
  }

  return hasRole(role, roles) && hasPermission(permissions, requiredPermissions)
}

export function getDefaultHomePathByRole(role: Role | null) {
  if (role === ROLES.admin) {
    return ROUTE_PATHS.approvalList
  }

  return ROUTE_PATHS.projectList
}
