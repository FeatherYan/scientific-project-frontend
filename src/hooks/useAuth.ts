import { ROLE_LABEL_MAP } from '../constants/role'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout, selectAuth } from '../store/slices/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)
  const roleLabel = auth.role ? ROLE_LABEL_MAP[auth.role] : ''

  return {
    ...auth,
    roleLabel,
    logout: () => dispatch(logout()),
  }
}
