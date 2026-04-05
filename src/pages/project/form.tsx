import { ArrowLeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { StatusTag } from '../../components/common/StatusTag'
import { ROUTE_PATHS } from '../../constants/route'
import {
  useProjectDetail,
  useSaveProjectDraft,
  useSubmitProject,
} from '../../hooks/useProjects'
import type { ProjectFormValues, ProjectRecord, SaveProjectPayload } from '../../types/project'
import { canEditProject, canSubmitProject } from '../../utils/project'

function toFormValues(project: ProjectRecord): ProjectFormValues {
  return {
    title: project.title,
    code: project.code,
    category: project.category,
    amount: project.amount,
    applicantName: project.applicantName,
    department: project.department ?? '',
    phone: project.phone ?? '',
    email: project.email ?? '',
    researchBasis: project.researchBasis ?? '',
    researchContent: project.researchContent ?? '',
    expectedOutcome: project.expectedOutcome ?? '',
    budgetDescription: project.budgetDescription ?? '',
    period: [
      project.startDate ?? dayjs().format('YYYY-MM-DD'),
      project.endDate ?? dayjs().add(6, 'month').format('YYYY-MM-DD'),
    ],
  }
}

function toSavePayload(values: ProjectFormValues): SaveProjectPayload {
  const [startDate, endDate] = values.period

  return {
    title: values.title,
    code: values.code,
    category: values.category,
    amount: values.amount,
    applicantName: values.applicantName,
    department: values.department,
    phone: values.phone,
    email: values.email,
    researchBasis: values.researchBasis,
    researchContent: values.researchContent,
    expectedOutcome: values.expectedOutcome,
    budgetDescription: values.budgetDescription,
    startDate,
    endDate,
  }
}

export default function ProjectFormPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm<ProjectFormValues>()
  const projectDetailQuery = useProjectDetail(id)
  const saveDraftMutation = useSaveProjectDraft()
  const submitProjectMutation = useSubmitProject()

  const project = projectDetailQuery.data
  const editable = project ? canEditProject(project) : false
  const submittable = project ? canSubmitProject(project) : false
  const pageTitle = editable ? '编辑申报' : '申报详情'
  const pageDescription = editable
    ? '这一页用于补充和完善申报草稿。保存草稿允许阶段性填写，提交申报时会进行完整校验。'
    : '这一页用于查看申报记录详情。当前记录已进入后续流程，因此表单内容只读展示。'

  useEffect(() => {
    if (project) {
      form.setFieldsValue(toFormValues(project))
    }
  }, [form, project])

  const handleSaveDraft = async () => {
    if (!project) {
      return
    }

    const values = form.getFieldsValue()
    await saveDraftMutation.mutateAsync({
      id: project.id,
      payload: toSavePayload(values as ProjectFormValues),
    })
  }

  const handleSubmit = async () => {
    if (!project) {
      return
    }

    const values = await form.validateFields()

    await saveDraftMutation.mutateAsync({
      id: project.id,
      payload: toSavePayload(values),
    })

    await submitProjectMutation.mutateAsync(project.id)
    navigate(ROUTE_PATHS.projectMine)
  }

  if (!id) {
    return (
      <Card className="page-card">
        <Typography.Text type="secondary">
          请先从“可申报项目”中发起申报，再进入草稿编辑页面。
        </Typography.Text>
      </Card>
    )
  }

  return (
    <div className="page-stack">
      <Card className="page-card">
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(ROUTE_PATHS.projectMine)}
            style={{ paddingInline: 0 }}
          >
            返回我的申报
          </Button>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {pageTitle}
          </Typography.Title>
          <Typography.Text type="secondary">
            {pageDescription}
          </Typography.Text>
        </Space>
      </Card>

      <Skeleton loading={projectDetailQuery.isLoading} active paragraph={{ rows: 10 }}>
        {project ? (
          <>
            <Card className="page-card">
              <Descriptions column={3}>
                <Descriptions.Item label="申报记录编号">
                  {project.id}
                </Descriptions.Item>
                <Descriptions.Item label="当前状态">
                  <StatusTag status={project.status} />
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                  {project.updatedAt.replace('T', ' ').slice(0, 16)}
                </Descriptions.Item>
              </Descriptions>
              <Alert
                showIcon
                type={editable ? 'info' : 'warning'}
                style={{ marginTop: 16 }}
                message={editable ? '表单说明' : '当前记录不可编辑'}
                description={
                  editable
                    ? '保存草稿不会校验所有字段，提交申报会要求负责人信息、研究内容、预算说明和起止时间全部填写完整。'
                    : '当前记录已进入后续流程，因此当前页面只提供查看能力。如需修改，请等待退回后再处理。'
                }
              />
            </Card>

            <Form
              form={form}
              layout="vertical"
              initialValues={project ? toFormValues(project) : undefined}
              disabled={!editable}
            >
              <Card className="page-card" title="项目基本信息">
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="项目名称"
                      name="title"
                      rules={[{ required: true, message: '请输入项目名称' }]}
                    >
                      <Input placeholder="请输入项目名称" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="项目编号"
                      name="code"
                      rules={[{ required: true, message: '请输入项目编号' }]}
                    >
                      <Input placeholder="请输入项目编号" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="项目类别"
                      name="category"
                      rules={[{ required: true, message: '请输入项目类别' }]}
                    >
                      <Input placeholder="如：重点项目 / 青年项目" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="申报经费"
                      name="amount"
                      rules={[{ required: true, message: '请输入申报经费' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={1000}
                        precision={0}
                        addonBefore="¥"
                        placeholder="请输入经费"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="项目周期"
                      name="period"
                      rules={[{ required: true, message: '请选择项目周期' }]}
                      getValueProps={(value) => ({
                        value: value
                          ? [dayjs(value[0]), dayjs(value[1])]
                          : undefined,
                      })}
                      normalize={(value) =>
                        value
                          ? [
                              value[0].format('YYYY-MM-DD'),
                              value[1].format('YYYY-MM-DD'),
                            ]
                          : value
                      }
                    >
                      <DatePicker.RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card className="page-card" title="负责人信息">
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="申请人"
                      name="applicantName"
                      rules={[{ required: true, message: '请输入申请人姓名' }]}
                    >
                      <Input placeholder="请输入申请人姓名" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="所属院系"
                      name="department"
                      rules={[{ required: true, message: '请输入所属院系' }]}
                    >
                      <Input placeholder="请输入所属院系" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="联系电话"
                      name="phone"
                      rules={[{ required: true, message: '请输入联系电话' }]}
                    >
                      <Input placeholder="请输入联系电话" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="电子邮箱"
                      name="email"
                      rules={[
                        { required: true, message: '请输入电子邮箱' },
                        { type: 'email', message: '邮箱格式不正确' },
                      ]}
                    >
                      <Input placeholder="请输入电子邮箱" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card className="page-card" title="研究内容与产出">
                <Form.Item
                  label="研究基础"
                  name="researchBasis"
                  rules={[{ required: true, message: '请输入研究基础' }]}
                >
                  <Input.TextArea rows={4} placeholder="说明已有研究基础、数据来源或前期准备情况" />
                </Form.Item>
                <Form.Item
                  label="研究内容"
                  name="researchContent"
                  rules={[{ required: true, message: '请输入研究内容' }]}
                >
                  <Input.TextArea rows={5} placeholder="说明研究目标、研究路径和核心工作内容" />
                </Form.Item>
                <Form.Item
                  label="预期成果"
                  name="expectedOutcome"
                  rules={[{ required: true, message: '请输入预期成果' }]}
                >
                  <Input.TextArea rows={4} placeholder="说明论文、系统原型、制度建议等预期成果" />
                </Form.Item>
                <Form.Item
                  label="经费预算说明"
                  name="budgetDescription"
                  rules={[{ required: true, message: '请输入经费预算说明' }]}
                >
                  <Input.TextArea rows={4} placeholder="说明调研、开发、测试、成果整理等经费使用方向" />
                </Form.Item>
              </Card>

              <Card className="page-card">
                <Space>
                  <Button
                    icon={<SaveOutlined />}
                    onClick={() => void handleSaveDraft()}
                    disabled={!editable}
                    loading={saveDraftMutation.isPending}
                  >
                    保存草稿
                  </Button>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => void handleSubmit()}
                    disabled={!submittable}
                    loading={submitProjectMutation.isPending}
                  >
                    提交申报
                  </Button>
                </Space>
              </Card>
            </Form>
          </>
        ) : (
          <Card className="page-card">
            <Typography.Text type="secondary">未找到对应草稿。</Typography.Text>
          </Card>
        )}
      </Skeleton>
    </div>
  )
}
