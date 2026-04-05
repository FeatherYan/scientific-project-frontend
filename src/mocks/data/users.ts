import { ROLES } from '../../constants/role'
import type { Role } from '../../constants/role'

export type MockUserRecord = {
  id: string
  username: string
  password: string
  name: string
  role: Role
}

export const mockUsers: MockUserRecord[] = [
  {
    id: 'u_001',
    username: 'teacher',
    password: '123456',
    name: '张老师',
    role: ROLES.user,
  },
  {
    id: 'a_001',
    username: 'admin',
    password: '123456',
    name: '系统管理员',
    role: ROLES.admin,
  },
]
