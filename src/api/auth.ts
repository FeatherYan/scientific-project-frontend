import { request } from '../request'
import type { AuthInfo } from '../types/auth'
import type { ApiResponse } from '../request/types'

export type LoginParams = {
  username: string
  password: string
  role: 'user' | 'admin'
}

export async function login(payload: LoginParams) {
  const response = await request.post<ApiResponse<AuthInfo>>('/auth/login', payload)
  return response.data.data
}
