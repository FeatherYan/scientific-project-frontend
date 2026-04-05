import { ArrowLeftOutlined, FormOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Descriptions,
  List,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/route'
import { PERMISSIONS } from '../../constants/permission'
import {
  useApplyProjectOpportunity,
  useProjectOpportunityDetail,
} from '../../hooks/useProjects'
import { PermissionButton } from '../../components/business/PermissionButton'
import { formatDateTime } from '../../utils/date'

export default function ProjectDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const projectDetailQuery = useProjectOpportunityDetail(id)
  const applyMutation = useApplyProjectOpportunity()

  const project = projectDetailQuery.data

  const handleApply = async () => {
    if (!project) {
      return
    }

    const draft = await applyMutation.mutateAsync(project.id)
    navigate(ROUTE_PATHS.projectEdit.replace(':id', draft.id))
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
              <Space style={{ marginTop: 16 }}>
                <PermissionButton
                  permission={PERMISSIONS.projectCreate}
                  type="primary"
                  icon={<FormOutlined />}
                  loading={applyMutation.isPending}
                  onClick={() => void handleApply()}
                >
                  发起申报
                </PermissionButton>
                <Button onClick={() => navigate(ROUTE_PATHS.projectMine)}>
                  查看我的申报
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
