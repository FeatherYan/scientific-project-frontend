import { Spin } from 'antd'
import { Suspense, lazy, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PERMISSIONS } from '../constants/permission'
import { ROUTE_PATHS } from '../constants/route'
import { ROLES } from '../constants/role'
import { AuthLayout } from '../layout/AuthLayout'
import { BasicLayout } from '../layout/BasicLayout'
import { getDefaultHomePathByRole } from '../permission/access'
import { RouteGuard } from '../permission/routeGuard'
import { useAppSelector } from '../store/hooks'
import { selectAuth } from '../store/slices/authSlice'

const LoginPage = lazy(() => import('../pages/login'))
const DashboardPage = lazy(() => import('../pages/dashboard'))
const ProjectListPage = lazy(() => import('../pages/project/list'))
const ProjectFormPage = lazy(() => import('../pages/project/form'))
const MyProjectsPage = lazy(() => import('../pages/project/mine'))
const ApprovalListPage = lazy(() => import('../pages/approval/list'))
const ApprovalDetailPage = lazy(() => import('../pages/approval/detail'))
const NotificationListPage = lazy(() => import('../pages/notification/list'))
const ForbiddenPage = lazy(() => import('../pages/exception/403'))
const NotFoundPage = lazy(() => import('../pages/exception/404'))

function PageFallback() {
  return <Spin size="large" fullscreen />
}

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>
}

function RoleHomeRedirect() {
  const { role } = useAppSelector(selectAuth)
  return <Navigate replace to={getDefaultHomePathByRole(role)} />
}

export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.login,
    element: withSuspense(
      <RouteGuard>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </RouteGuard>,
    ),
  },
  {
    path: ROUTE_PATHS.root,
    element: withSuspense(
      <RouteGuard requiresAuth>
        <BasicLayout />
      </RouteGuard>,
    ),
    children: [
      {
        index: true,
        element: <RoleHomeRedirect />,
      },
      {
        path: 'dashboard',
        element: withSuspense(<DashboardPage />),
      },
      {
        element: (
          <RouteGuard
            requiresAuth
            roles={[ROLES.user]}
            requiredPermissions={[PERMISSIONS.projectList]}
          />
        ),
        children: [
          {
            path: 'projects/list',
            element: withSuspense(<ProjectListPage />),
          },
          {
            path: 'projects/new',
            element: withSuspense(<ProjectFormPage />),
          },
          {
            path: 'projects/:id/edit',
            element: withSuspense(<ProjectFormPage />),
          },
          {
            path: 'projects/mine',
            element: withSuspense(<MyProjectsPage />),
          },
        ],
      },
      {
        element: (
          <RouteGuard
            requiresAuth
            roles={[ROLES.admin]}
            requiredPermissions={[PERMISSIONS.approvalList]}
          />
        ),
        children: [
          {
            path: 'approvals/list',
            element: withSuspense(<ApprovalListPage />),
          },
          {
            path: 'approvals/:id',
            element: withSuspense(<ApprovalDetailPage />),
          },
        ],
      },
      {
        element: (
          <RouteGuard
            requiresAuth
            roles={[ROLES.user, ROLES.admin]}
            requiredPermissions={[PERMISSIONS.notificationList]}
          />
        ),
        children: [
          {
            path: 'notifications',
            element: withSuspense(<NotificationListPage />),
          },
        ],
      },
    ],
  },
  {
    path: ROUTE_PATHS.forbidden,
    element: withSuspense(<ForbiddenPage />),
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
])
