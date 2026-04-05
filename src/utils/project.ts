import { PROJECT_STATUS } from '../constants/project'
import type { PermissionCode } from '../constants/permission'
import { PERMISSIONS } from '../constants/permission'
import type { ProjectRecord } from '../types/project'

export function canEditProject(project: ProjectRecord) {
  return project.status === PROJECT_STATUS.draft || project.status === PROJECT_STATUS.rejected
}

export function canDeleteProject(project: ProjectRecord) {
  return project.status === PROJECT_STATUS.draft
}

export function canSubmitProject(project: ProjectRecord) {
  return project.status === PROJECT_STATUS.draft || project.status === PROJECT_STATUS.rejected
}

export function hasActionPermission(
  permissions: PermissionCode[],
  permission: PermissionCode,
) {
  return permissions.includes(permission)
}

export function getActionDisabledReason(
  project: ProjectRecord,
  action: 'edit' | 'delete' | 'submit',
) {
  if (action === 'edit' && !canEditProject(project)) {
    return '只有草稿或已退回项目可以编辑'
  }

  if (action === 'delete' && !canDeleteProject(project)) {
    return '只有草稿项目可以删除'
  }

  if (action === 'submit' && !canSubmitProject(project)) {
    return '只有草稿或已退回项目可以提交'
  }

  return ''
}

export const PROJECT_ACTION_PERMISSION_MAP = {
  edit: PERMISSIONS.projectEdit,
  delete: PERMISSIONS.projectDelete,
  submit: PERMISSIONS.projectSubmit,
} as const
