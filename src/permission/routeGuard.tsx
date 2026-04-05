import type { PropsWithChildren } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTE_PATHS } from '../constants/route'
import { useAppSelector } from '../store/hooks'
import { selectAuth } from '../store/slices/authSlice'
import { canAccessRoute } from './access'
import type { PermissionCode } from '../constants/permission'
import type { Role } from '../constants/role'

type RouteGuardProps = PropsWithChildren<{
  requiresAuth?: boolean
  roles?: Role[]
  requiredPermissions?: PermissionCode[]
}>

export function RouteGuard({
  children,
  requiresAuth = false,
  roles,
  requiredPermissions,
}: RouteGuardProps) {
  const location = useLocation()
  const auth = useAppSelector(selectAuth)

  const passed = canAccessRoute({
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
    permissions: auth.permissions,
    requiresAuth,
    roles,
    requiredPermissions,
  })

  if (!requiresAuth) {
    return children ? <>{children}</> : <Outlet />
  }

  if (!auth.isAuthenticated) {
    return (
      <Navigate
        to={ROUTE_PATHS.login}
        replace
        state={{ redirect: location.pathname }}
      />
    )
  }

  if (!passed) {
    return <Navigate to={ROUTE_PATHS.forbidden} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
