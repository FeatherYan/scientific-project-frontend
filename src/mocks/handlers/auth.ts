import { delay, http, HttpResponse } from 'msw'
import { ROLE_PERMISSION_MAP } from '../../constants/role'
import { mockUsers } from '../data/users'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      username?: string
      password?: string
      role?: 'user' | 'admin'
    }

    await delay(700)

    const matchedUser = mockUsers.find(
      (user) =>
        user.username === body.username &&
        user.password === body.password &&
        user.role === body.role,
    )

    if (!matchedUser) {
      return HttpResponse.json(
        {
          code: 401,
          message: '用户名、密码或角色不匹配',
          data: null,
        },
        { status: 401 },
      )
    }

    return HttpResponse.json({
      code: 0,
      message: '登录成功',
      data: {
        token: `${matchedUser.role}-token`,
        role: matchedUser.role,
        permissions: [...ROLE_PERMISSION_MAP[matchedUser.role]],
        userInfo: {
          id: matchedUser.id,
          name: matchedUser.name,
        },
        isAuthenticated: true,
      },
    })
  }),
]
