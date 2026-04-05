import { delay, http, HttpResponse } from 'msw'
import {
  mockNotifications,
  persistMockNotifications,
} from '../data/notifications'

function getCurrentUserId(request: Request) {
  const authHeader = request.headers.get('authorization')

  if (authHeader === 'Bearer user-token') {
    return 'u_001'
  }

  if (authHeader === 'Bearer admin-token') {
    return 'a_001'
  }

  return ''
}

export const notificationHandlers = [
  http.get('/api/notifications', async ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')?.trim() ?? ''
    const read = url.searchParams.get('read')?.trim() ?? ''
    const type = url.searchParams.get('type')?.trim() ?? ''
    const currentUserId = getCurrentUserId(request)

    await delay(300)

    const data = mockNotifications
      .filter((item) => item.userId === currentUserId)
      .filter((item) => {
        const matchKeyword =
          !keyword ||
          item.title.includes(keyword) ||
          item.content.includes(keyword)

        const matchRead =
          !read || String(item.read) === read

        const matchType = !type || item.type === type

        return matchKeyword && matchRead && matchType
      })
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))

    return HttpResponse.json({
      code: 0,
      message: '获取成功',
      data,
    })
  }),

  http.post('/api/notifications/:id/read', async ({ params }) => {
    await delay(200)

    const matched = mockNotifications.find((item) => item.id === params.id)

    if (!matched) {
      return HttpResponse.json(
        { code: 404, message: '通知不存在', data: null },
        { status: 404 },
      )
    }

    matched.read = true
    persistMockNotifications()

    return HttpResponse.json({
      code: 0,
      message: '已读成功',
      data: matched,
    })
  }),
]
