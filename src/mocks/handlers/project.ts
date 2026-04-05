import { delay, http, HttpResponse } from 'msw'
import { PROJECT_STATUS } from '../../constants/project'
import type { SaveProjectPayload } from '../../types/project'
import {
  mockNotifications,
  persistMockNotifications,
} from '../data/notifications'
import { mockProjects, persistMockProjects } from '../data/projects'
import { mockProjectOpportunities } from '../data/projectOpportunities'

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

function createApprovalNotification(params: {
  userId: string
  projectId: string
  title: string
  content: string
}) {
  const nextId = `n_${String(mockNotifications.length + 1).padStart(3, '0')}`

  mockNotifications.unshift({
    id: nextId,
    userId: params.userId,
    title: params.title,
    content: params.content,
    type: 'approval',
    read: false,
    createdAt: new Date().toISOString(),
    relatedProjectId: params.projectId,
  })

  persistMockNotifications()
}

export const projectHandlers = [
  http.get('/api/project-opportunities', async ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')?.trim() ?? ''

    await delay(400)

    const data = mockProjectOpportunities.filter((project) => {
      if (!keyword) {
        return true
      }

      return (
        project.title.includes(keyword) ||
        project.code.toLowerCase().includes(keyword.toLowerCase())
      )
    })

    return HttpResponse.json({
      code: 0,
      message: '获取成功',
      data,
    })
  }),

  http.get('/api/project-opportunities/:id', async ({ params }) => {
    await delay(300)

    const matchedProject = mockProjectOpportunities.find(
      (project) => project.id === params.id,
    )

    if (!matchedProject) {
      return HttpResponse.json(
        { code: 404, message: '项目不存在', data: null },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      code: 0,
      message: '获取成功',
      data: matchedProject,
    })
  }),

  http.post('/api/project-opportunities/:id/apply', async ({ params }) => {
    await delay(400)

    const sourceProject = mockProjectOpportunities.find(
      (project) => project.id === params.id,
    )

    if (!sourceProject) {
      return HttpResponse.json(
        { code: 404, message: '项目不存在', data: null },
        { status: 404 },
      )
    }

    const nextId = `p_${String(mockProjects.length + 1).padStart(3, '0')}`
    const createdProject = {
      id: nextId,
      title: sourceProject.title,
      code: sourceProject.code.replace('OPEN', 'APPLY'),
      category: sourceProject.category,
      amount: sourceProject.amountLimit,
      status: PROJECT_STATUS.draft,
      applicantId: 'u_001',
      applicantName: '张老师',
      department: '',
      phone: '',
      email: '',
      researchBasis: '',
      researchContent: '',
      expectedOutcome: '',
      budgetDescription: '',
      startDate: '',
      endDate: '',
      sourceOpportunityId: sourceProject.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockProjects.unshift(createdProject)
    persistMockProjects()

    return HttpResponse.json({
      code: 0,
      message: '申报草稿已创建',
      data: createdProject,
    })
  }),

  http.get('/api/project-opportunities/:id/my-project', async ({ params, request }) => {
    await delay(200)

    const currentUserId = getCurrentUserId(request)
    const matchedProject =
      mockProjects.find(
        (project) =>
          project.sourceOpportunityId === params.id &&
          project.applicantId === currentUserId,
      ) ?? null

    return HttpResponse.json({
      code: 0,
      message: '获取成功',
      data: matchedProject,
    })
  }),

  http.get('/api/projects', async ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')?.trim() ?? ''
    const status = url.searchParams.get('status')?.trim() ?? ''
    const currentUserId = getCurrentUserId(request)

    await delay(500)

    const data = mockProjects
      .filter((project) => project.applicantId === currentUserId)
      .filter((project) => {
        const matchKeyword =
          !keyword ||
          project.title.includes(keyword) ||
          project.code.toLowerCase().includes(keyword.toLowerCase())

        const matchStatus = !status || project.status === status

        return matchKeyword && matchStatus
      })
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))

    return HttpResponse.json({
      code: 0,
      message: '获取成功',
      data,
    })
  }),

  http.get('/api/approvals', async ({ request }) => {
    const url = new URL(request.url)
    const keyword = url.searchParams.get('keyword')?.trim() ?? ''
    const status = url.searchParams.get('status')?.trim() ?? ''

    await delay(400)

    const data = mockProjects
      .filter((project) => project.status !== PROJECT_STATUS.draft)
      .filter((project) => {
        const matchKeyword =
          !keyword ||
          project.title.includes(keyword) ||
          project.code.toLowerCase().includes(keyword.toLowerCase()) ||
          project.applicantName.includes(keyword)

        const matchStatus = !status || project.status === status

        return matchKeyword && matchStatus
      })
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))

    return HttpResponse.json({
      code: 0,
      message: '获取成功',
      data,
    })
  }),

  http.get('/api/approvals/:id', async ({ params }) => {
    await delay(300)

    const matchedProject = mockProjects.find(
      (project) => project.id === params.id && project.status !== PROJECT_STATUS.draft,
    )

    if (!matchedProject) {
      return HttpResponse.json(
        { code: 404, message: '审批记录不存在', data: null },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      code: 0,
      message: '获取成功',
      data: matchedProject,
    })
  }),

  http.post('/api/approvals/:id/approve', async ({ params, request }) => {
    await delay(400)

    const body = (await request.json()) as { comment?: string }
    const matchedProject = mockProjects.find((project) => project.id === params.id)

    if (!matchedProject) {
      return HttpResponse.json(
        { code: 404, message: '审批记录不存在', data: null },
        { status: 404 },
      )
    }

    if (
      matchedProject.status !== PROJECT_STATUS.submitted &&
      matchedProject.status !== PROJECT_STATUS.approving
    ) {
      return HttpResponse.json(
        { code: 400, message: '当前状态不可审批通过', data: null },
        { status: 400 },
      )
    }

    matchedProject.status = PROJECT_STATUS.approved
    matchedProject.approvalComment = body.comment?.trim() ?? '审批通过'
    matchedProject.reviewedBy = '系统管理员'
    matchedProject.reviewedAt = new Date().toISOString()
    matchedProject.updatedAt = new Date().toISOString()
    persistMockProjects()
    createApprovalNotification({
      userId: matchedProject.applicantId,
      projectId: matchedProject.id,
      title: '项目已通过审批',
      content: `你提交的“${matchedProject.title}”已审批通过，请关注后续安排。`,
    })

    return HttpResponse.json({
      code: 0,
      message: '审批通过',
      data: matchedProject,
    })
  }),

  http.post('/api/approvals/:id/reject', async ({ params, request }) => {
    await delay(400)

    const body = (await request.json()) as { comment?: string }
    const matchedProject = mockProjects.find((project) => project.id === params.id)

    if (!matchedProject) {
      return HttpResponse.json(
        { code: 404, message: '审批记录不存在', data: null },
        { status: 404 },
      )
    }

    if (
      matchedProject.status !== PROJECT_STATUS.submitted &&
      matchedProject.status !== PROJECT_STATUS.approving
    ) {
      return HttpResponse.json(
        { code: 400, message: '当前状态不可退回', data: null },
        { status: 400 },
      )
    }

    if (!body.comment?.trim()) {
      return HttpResponse.json(
        { code: 400, message: '退回时请填写审批意见', data: null },
        { status: 400 },
      )
    }

    matchedProject.status = PROJECT_STATUS.rejected
    matchedProject.approvalComment = body.comment.trim()
    matchedProject.reviewedBy = '系统管理员'
    matchedProject.reviewedAt = new Date().toISOString()
    matchedProject.updatedAt = new Date().toISOString()
    persistMockProjects()
    createApprovalNotification({
      userId: matchedProject.applicantId,
      projectId: matchedProject.id,
      title: '项目已被退回修改',
      content: `“${matchedProject.title}”已退回，请根据审批意见补充后重新提交。`,
    })

    return HttpResponse.json({
      code: 0,
      message: '已退回申请人',
      data: matchedProject,
    })
  }),

  http.get('/api/projects/:id', async ({ params, request }) => {
    await delay(300)

    const currentUserId = getCurrentUserId(request)
    const matchedProject = mockProjects.find(
      (project) => project.id === params.id && project.applicantId === currentUserId,
    )

    if (!matchedProject) {
      return HttpResponse.json(
        { code: 404, message: '申报记录不存在', data: null },
        { status: 404 },
      )
    }

    return HttpResponse.json({
      code: 0,
      message: '获取成功',
      data: matchedProject,
    })
  }),

  http.put('/api/projects/:id', async ({ params, request }) => {
    await delay(400)

    const body = (await request.json()) as SaveProjectPayload
    const matchedProject = mockProjects.find((project) => project.id === params.id)

    if (!matchedProject) {
      return HttpResponse.json(
        { code: 404, message: '申报记录不存在', data: null },
        { status: 404 },
      )
    }

    matchedProject.title = body.title
    matchedProject.code = body.code
    matchedProject.category = body.category
    matchedProject.amount = body.amount
    matchedProject.applicantName = body.applicantName
    matchedProject.department = body.department
    matchedProject.phone = body.phone
    matchedProject.email = body.email
    matchedProject.researchBasis = body.researchBasis
    matchedProject.researchContent = body.researchContent
    matchedProject.expectedOutcome = body.expectedOutcome
    matchedProject.budgetDescription = body.budgetDescription
    matchedProject.startDate = body.startDate
    matchedProject.endDate = body.endDate
    matchedProject.updatedAt = new Date().toISOString()
    persistMockProjects()

    return HttpResponse.json({
      code: 0,
      message: '草稿已保存',
      data: matchedProject,
    })
  }),

  http.post('/api/projects/:id/submit', async ({ params }) => {
    await delay(400)

    const matchedProject = mockProjects.find((project) => project.id === params.id)

    if (!matchedProject) {
      return HttpResponse.json(
        { code: 404, message: '项目不存在', data: null },
        { status: 404 },
      )
    }

    if (
      matchedProject.status !== PROJECT_STATUS.draft &&
      matchedProject.status !== PROJECT_STATUS.rejected
    ) {
      return HttpResponse.json(
        { code: 400, message: '当前状态不允许提交', data: null },
        { status: 400 },
      )
    }

    const requiredFields = [
      matchedProject.department,
      matchedProject.phone,
      matchedProject.email,
      matchedProject.researchBasis,
      matchedProject.researchContent,
      matchedProject.expectedOutcome,
      matchedProject.budgetDescription,
      matchedProject.startDate,
      matchedProject.endDate,
    ]

    if (requiredFields.some((field) => !field)) {
      return HttpResponse.json(
        { code: 400, message: '请先完善表单后再提交', data: null },
        { status: 400 },
      )
    }

    matchedProject.status = PROJECT_STATUS.submitted
    matchedProject.updatedAt = new Date().toISOString()
    persistMockProjects()

    return HttpResponse.json({
      code: 0,
      message: '提交成功',
      data: matchedProject,
    })
  }),

  http.delete('/api/projects/:id', async ({ params }) => {
    await delay(400)

    const projectIndex = mockProjects.findIndex((project) => project.id === params.id)

    if (projectIndex === -1) {
      return HttpResponse.json(
        { code: 404, message: '项目不存在', data: null },
        { status: 404 },
      )
    }

    if (mockProjects[projectIndex].status !== PROJECT_STATUS.draft) {
      return HttpResponse.json(
        { code: 400, message: '只有草稿项目可以删除', data: null },
        { status: 400 },
      )
    }

    const deletedId = mockProjects[projectIndex].id
    mockProjects.splice(projectIndex, 1)
    persistMockProjects()

    return HttpResponse.json({
      code: 0,
      message: '删除成功',
      data: { id: deletedId },
    })
  }),
]
