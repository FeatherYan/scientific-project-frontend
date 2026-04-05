import { request } from '../request'
import type { ApiResponse } from '../request/types'

export type NotificationRecord = {
  id: string
  title: string
  read: boolean
}

export function getNotificationList() {
  return request.get<ApiResponse<NotificationRecord[]>>('/notifications')
}
