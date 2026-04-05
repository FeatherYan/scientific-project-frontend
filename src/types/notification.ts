export type NotificationType = 'approval' | 'system'

export type NotificationRecord = {
  id: string
  userId: string
  title: string
  content: string
  type: NotificationType
  read: boolean
  createdAt: string
  relatedProjectId?: string
}

export type NotificationListParams = {
  keyword?: string
  read?: string
  type?: string
}
