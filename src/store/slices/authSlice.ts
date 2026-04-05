import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { ROLE_PERMISSION_MAP, type Role } from '../../constants/role'
import type { PermissionCode } from '../../constants/permission'
import { clearAuthStorage, getAuthStorage, setAuthStorage } from '../../utils/storage'
import type { RootState } from '../index'
import type { UserInfo } from '../../types/auth'

type AuthState = {
  token: string
  role: Role | null
  permissions: PermissionCode[]
  userInfo: UserInfo | null
  isAuthenticated: boolean
}

type LoginPayload = {
  token: string
  role: Role
  userInfo: UserInfo
}

const persistedAuth = getAuthStorage()

const initialState: AuthState = persistedAuth ?? {
  token: '',
  role: null,
  permissions: [],
  userInfo: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginPayload>) {
      state.token = action.payload.token
      state.role = action.payload.role
      state.userInfo = action.payload.userInfo
      state.isAuthenticated = true
      state.permissions = [...ROLE_PERMISSION_MAP[action.payload.role]]
      setAuthStorage(state)
    },
    logout() {
      clearAuthStorage()
      return {
        token: '',
        role: null,
        permissions: [],
        userInfo: null,
        isAuthenticated: false,
      }
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer
