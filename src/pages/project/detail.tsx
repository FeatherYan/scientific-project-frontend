import { ArrowLeftOutlined, FormOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Descriptions,
  List,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { PROJECT_STATUS_META } from '../../constants/project'
import { ROUTE_PATHS } from '../../constants/route'
import { PERMISSIONS } from '../../constants/permission'
import {
  useApplyProjectOpportunity,
  useMyProjectByOpportunity,
  useProjectOpportunityDetail,
} from '../../hooks/useProjects'
import { PermissionButton } from '../../components/business/PermissionButton'
import { formatDateTime } from '../../utils/date'

export default function ProjectDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const projectDetailQuery = useProjectOpportunityDetail(id)
  const myProjectQuery = useMyProjectByOpportunity(id)
  const applyMutation = useApplyProjectOpportunity()

  const project = projectDetailQuery.data
  const myProject = myProjectQuery.data

  const handleApply = async () => {
    if (!project) {
      return
    }

    const draft = await applyMutation.mutateAsync(project.id)
    navigate(ROUTE_PATHS.projectEdit.replace(':id', draft.id))
  }

  const handleViewMyProject = () => {
    if (!myProject) {
      return
    }

    navigate(ROUTE_PATHS.projectEdit.replace(':id', myProject.id))
  }

  return (
    <div className="page-stack">
      <Card className="page-card">
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(ROUTE_PATHS.projectList)}
            style={{ paddingInline: 0 }}
          >
            返回可申报项目列表
          </Button>
          <Typography.Title level={3} style={{ margin: 0 }}>
            可申报项目详情
          </Typography.Title>
          <Typography.Text type="secondary">
            这里展示项目的申报说明、截止时间和申报要求，用户确认符合条件后再发起申报。
          </Typography.Text>
        </Space>
      </Card>

      <Skeleton loading={projectDetailQuery.isLoading} active paragraph={{ rows: 8 }}>
        {project ? (
          <>
            <Card className="page-card">
              <Descriptions column={2} title={project.title}>
                <Descriptions.Item label="项目编号">
                  {project.code}
                </Descriptions.Item>
                <Descriptions.Item label="项目类别">
                  {project.category}
                </Descriptions.Item>
                <Descriptions.Item label="发布部门">
                  {project.department}
                </Descriptions.Item>
                <Descriptions.Item label="经费上限">
                  ¥ {project.amountLimit.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="申报截止时间">
                  {formatDateTime(project.deadline)}
                </Descriptions.Item>
                <Descriptions.Item label="简介">
                  {project.summary}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card className="page-card" title="申报要求">
              <List
                dataSource={project.requirements}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              {myProject ? (
                <Alert
                  type="success"
                  showIcon
                  style={{ marginTop: 16 }}
                  message="你已申报过该项目"
                  description={`当前已有一条申报记录，状态为“${PROJECT_STATUS_META[myProject.status].label}”。可直接进入该记录继续查看或编辑。`}
                />
              ) : (
                <Alert
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                  message="你还没有申报该项目"
                  description="如果确认符合申报要求，可以点击“发起申报”创建一条草稿记录。"
                />
              )}
              <Space style={{ marginTop: 16 }}>
                <PermissionButton
                  permission={PERMISSIONS.projectCreate}
                  type="primary"
                  icon={<FormOutlined />}
                  disabled={Boolean(myProject)}
                  tooltip={myProject ? '你已经申报过该项目，可直接查看对应记录' : undefined}
                  loading={applyMutation.isPending}
                  onClick={() => void handleApply()}
                >
                  发起申报
                </PermissionButton>
                <Button
                  loading={myProjectQuery.isLoading || myProjectQuery.isFetching}
                  disabled={!myProject}
                  onClick={handleViewMyProject}
                >
                  {myProject ? '查看该项目的我的申报' : '尚未申报该项目'}
                </Button>
              </Space>
            </Card>
          </>
        ) : (
          <Card className="page-card">
            <Typography.Text type="secondary">未找到该项目。</Typography.Text>
          </Card>
        )}
      </Skeleton>
    </div>
  )
}
