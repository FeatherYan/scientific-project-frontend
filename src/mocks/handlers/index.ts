import { authHandlers } from './auth'
import { notificationHandlers } from './notification'
import { projectHandlers } from './project'

export const handlers = [...authHandlers, ...projectHandlers, ...notificationHandlers]
