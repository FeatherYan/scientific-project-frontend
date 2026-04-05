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
  department?: string
  phone?: string
  email?: string
  researchBasis?: string
  researchContent?: string
  expectedOutcome?: string
  budgetDescription?: string
  startDate?: string
  endDate?: string
  sourceOpportunityId?: string
  approvalComment?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export type ProjectListParams = {
  keyword?: string
  status?: string
}

export type ProjectFormValues = {
  title: string
  code: string
  category: string
  amount: number
  applicantName: string
  department: string
  phone: string
  email: string
  researchBasis: string
  researchContent: string
  expectedOutcome: string
  budgetDescription: string
  period: [string, string]
}

export type SaveProjectPayload = Omit<ProjectFormValues, 'period'> & {
  startDate: string
  endDate: string
}
