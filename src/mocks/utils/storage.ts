type LoaderOptions<T> = {
  key: string
  fallback: T
}

export const MOCK_STORAGE_KEYS = {
  projects: 'scientific-project-mock-projects',
  notifications: 'scientific-project-mock-notifications',
} as const

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

export function loadMockState<T>({ key, fallback }: LoaderOptions<T>) {
  if (!canUseStorage()) {
    return fallback
  }

  const rawValue = window.localStorage.getItem(key)

  if (!rawValue) {
    window.localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }

  try {
    return JSON.parse(rawValue) as T
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
}

export function saveMockState<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function clearMockState() {
  if (!canUseStorage()) {
    return
  }

  Object.values(MOCK_STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key)
  })
}
