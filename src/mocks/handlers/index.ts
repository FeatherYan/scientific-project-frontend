import { authHandlers } from './auth'
import { projectHandlers } from './project'

export const handlers = [...authHandlers, ...projectHandlers]
