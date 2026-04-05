import { request } from '../request'
import type { ApiResponse } from '../request/types'
import type {
  NotificationListParams,
  NotificationRecord,
} from '../types/notification'

export async function getNotificationList(
  params: NotificationListParams = {},
) {
  const response = await request.get<ApiResponse<NotificationRecord[]>>(
    '/notifications',
    { params },
  )
  return response.data.data
}

export async function markNotificationRead(id: string) {
  const response = await request.post<ApiResponse<NotificationRecord>>(
    `/notifications/${id}/read`,
  )
  return response.data.data
}
