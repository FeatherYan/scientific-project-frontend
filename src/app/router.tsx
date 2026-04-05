import { RouterProvider } from 'react-router-dom'
import { router } from '../router/routes'

export function AppRouter() {
  return <RouterProvider router={router} />
}
