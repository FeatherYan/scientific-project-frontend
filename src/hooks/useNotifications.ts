import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import {
  getNotificationList,
  markNotificationRead,
} from '../api/notification'
import type { NotificationListParams } from '../types/notification'

const notificationKeys = {
  all: ['notifications'] as const,
  list: (params: NotificationListParams) =>
    [...notificationKeys.all, 'list', params] as const,
}

export function useNotificationList(params: NotificationListParams) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotificationList(params),
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      message.success('已标记为已读')
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
