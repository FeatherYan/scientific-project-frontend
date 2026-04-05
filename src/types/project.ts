import type { ProjectStatus } from '../constants/project'

export type ProjectRecord = {
  id: string
  title: string
  code: string
  category: string
  amount: number
  status: ProjectStatus
  applicantId: string
  applicantName: string
  createdAt: string
  updatedAt: string
}

export type ProjectListParams = {
  keyword?: string
  status?: string
}
