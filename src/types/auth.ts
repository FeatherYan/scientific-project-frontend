import type { PermissionCode } from '../constants/permission'
import type { Role } from '../constants/role'

export type UserInfo = {
  id: string
  name: string
}

export type AuthInfo = {
  token: string
  role: Role | null
  permissions: PermissionCode[]
  userInfo: UserInfo | null
  isAuthenticated: boolean
}
