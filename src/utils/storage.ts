import type { AuthInfo } from '../types/auth'

const AUTH_STORAGE_KEY = 'scientific-project-auth'

export function getAuthStorage() {
  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as AuthInfo
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function setAuthStorage(authInfo: AuthInfo) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authInfo))
}

export function clearAuthStorage() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getToken() {
  return getAuthStorage()?.token ?? ''
}
