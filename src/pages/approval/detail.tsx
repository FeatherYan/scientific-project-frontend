import { ArrowLeftOutlined, CheckCircleOutlined, RollbackOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { StatusTag } from '../../components/common/StatusTag'
import { PROJECT_STATUS } from '../../constants/project'
import { ROUTE_PATHS } from '../../constants/route'
import {
  useApprovalDetail,
  useApproveProject,
  useRejectProject,
} from '../../hooks/useApprovalDetail'
import { formatDateTime } from '../../utils/date'

function canReview(status: string) {
  return status === PROJECT_STATUS.submitted || status === PROJECT_STATUS.approving
}

export default function ApprovalDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm<{ comment: string }>()
  const approvalDetailQuery = useApprovalDetail(id)
  const approveMutation = useApproveProject()
  const rejectMutation = useRejectProject()

  const project = approvalDetailQuery.data
  const reviewable = project ? canReview(project.status) : false

  const handleApprove = async () => {
    if (!project) {
      return
    }

    const comment = form.getFieldValue('comment') || '审批通过'
    await approveMutation.mutateAsync({
      id: project.id,
      comment,
    })
    navigate(ROUTE_PATHS.approvalList)
  }

  const handleReject = async () => {
    if (!project) {
      return
    }

    const values = await form.validateFields()
    await rejectMutation.mutateAsync({
      id: project.id,
      comment: values.comment,
    })
    navigate(ROUTE_PATHS.approvalList)
  }

  return (
    <div className="page-stack">
      <Card className="page-card">
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(ROUTE_PATHS.approvalList)}
            style={{ paddingInline: 0 }}
          >
            返回审批列表
          </Button>
          <Typography.Title level={3} style={{ margin: 0 }}>
            项目审批详情
          </Typography.Title>
          <Typography.Text type="secondary">
            这一页集中展示项目申报内容、申请人信息和审批操作，管理员可在这里完成通过或退回。
          </Typography.Text>
        </Space>
      </Card>

      <Skeleton loading={approvalDetailQuery.isLoading} active paragraph={{ rows: 10 }}>
        {project ? (
          <>
            <Card className="page-card">
              <Descriptions column={3}>
                <Descriptions.Item label="审批记录编号">
                  {project.id}
                </Descriptions.Item>
                <Descriptions.Item label="当前状态">
                  <StatusTag status={project.status} />
                </Descriptions.Item>
                <Descriptions.Item label="最后更新时间">
                  {formatDateTime(project.updatedAt)}
                </Descriptions.Item>
              </Descriptions>
              <Alert
                showIcon
                style={{ marginTop: 16 }}
                type={reviewable ? 'info' : 'success'}
                message={reviewable ? '待审批提醒' : '审批已完成'}
                description={
                  reviewable
                    ? '请结合项目内容和申报要求填写审批意见，再执行通过或退回操作。'
                    : '当前项目已经完成本轮审批，以下内容仅供查看。'
                }
              />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} xl={14}>
                <Card className="page-card" title="项目基本信息">
                  <Descriptions column={2}>
                    <Descriptions.Item label="项目名称">
                      {project.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="项目编号">
                      {project.code}
                    </Descriptions.Item>
                    <Descriptions.Item label="项目类别">
                      {project.category}
                    </Descriptions.Item>
                    <Descriptions.Item label="申报经费">
                      ¥ {project.amount.toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="项目周期">
                      {project.startDate} 至 {project.endDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="申请人">
                      {project.applicantName}
                    </Descriptions.Item>
                    <Descriptions.Item label="所属院系">
                      {project.department}
                    </Descriptions.Item>
                    <Descriptions.Item label="联系电话">
                      {project.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="电子邮箱">
                      {project.email}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24} xl={10}>
                <Card className="page-card" title="审批信息">
                  <Descriptions column={1}>
                    <Descriptions.Item label="审批人">
                      {project.reviewedBy || '待分配'}
                    </Descriptions.Item>
                    <Descriptions.Item label="审批时间">
                      {project.reviewedAt
                        ? formatDateTime(project.reviewedAt)
                        : '暂无'}
                    </Descriptions.Item>
                    <Descriptions.Item label="历史审批意见">
                      {project.approvalComment || '暂无审批意见'}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Card className="page-card" title="申报内容">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <div>
                  <Typography.Title level={5}>研究基础</Typography.Title>
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    {project.researchBasis}
                  </Typography.Paragraph>
                </div>
                <div>
                  <Typography.Title level={5}>研究内容</Typography.Title>
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    {project.researchContent}
                  </Typography.Paragraph>
                </div>
                <div>
                  <Typography.Title level={5}>预期成果</Typography.Title>
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    {project.expectedOutcome}
                  </Typography.Paragraph>
                </div>
                <div>
                  <Typography.Title level={5}>经费预算说明</Typography.Title>
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    {project.budgetDescription}
                  </Typography.Paragraph>
                </div>
              </Space>
            </Card>

            <Card className="page-card" title="审批操作">
              <Form form={form} layout="vertical" initialValues={{ comment: project.approvalComment || '' }}>
                <Form.Item
                  label="审批意见"
                  name="comment"
                  rules={
                    reviewable
                      ? [{ required: true, message: '请填写审批意见' }]
                      : []
                  }
                >
                  <Input.TextArea
                    rows={4}
                    disabled={!reviewable}
                    placeholder="通过时可填写补充意见，退回时建议说明修改原因。"
                  />
                </Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => void handleApprove()}
                    disabled={!reviewable}
                    loading={approveMutation.isPending}
                  >
                    审批通过
                  </Button>
                  <Button
                    danger
                    icon={<RollbackOutlined />}
                    onClick={() => void handleReject()}
                    disabled={!reviewable}
                    loading={rejectMutation.isPending}
                  >
                    退回申请人
                  </Button>
                </Space>
              </Form>
            </Card>
          </>
        ) : (
          <Card className="page-card">
            <Typography.Text type="secondary">未找到对应审批记录。</Typography.Text>
          </Card>
        )}
      </Skeleton>
    </div>
  )
}
