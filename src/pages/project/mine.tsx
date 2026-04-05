import { DeleteOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PermissionButton } from '../../components/business/PermissionButton'
import { StatusTag } from '../../components/common/StatusTag'
import { PROJECT_STATUS_OPTIONS } from '../../constants/project'
import { ROUTE_PATHS } from '../../constants/route'
import { useDeleteProject, useMyProjectList, useSubmitProject } from '../../hooks/useProjects'
import type { ProjectListParams, ProjectRecord } from '../../types/project'
import { formatDateTime } from '../../utils/date'
import {
  PROJECT_ACTION_PERMISSION_MAP,
  canDeleteProject,
  canSubmitProject,
  getActionDisabledReason,
} from '../../utils/project'

export default function MyProjectsPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm<ProjectListParams>()
  const [filters, setFilters] = useState<ProjectListParams>({
    keyword: '',
    status: '',
  })
  const projectListQuery = useMyProjectList(filters)
  const submitProjectMutation = useSubmitProject()
  const deleteProjectMutation = useDeleteProject()

  const tableData = projectListQuery.data ?? []

  const columns = useMemo<ColumnsType<ProjectRecord>>(
    () => [
      {
        title: '项目名称',
        dataIndex: 'title',
        key: 'title',
        width: 280,
        render: (_, record) => (
          <Space direction="vertical" size={2}>
            <Typography.Text strong>{record.title}</Typography.Text>
            <Typography.Text type="secondary">{record.code}</Typography.Text>
          </Space>
        ),
      },
      {
        title: '项目类别',
        dataIndex: 'category',
        key: 'category',
        width: 120,
      },
      {
        title: '申请人',
        dataIndex: 'applicantName',
        key: 'applicantName',
        width: 100,
      },
      {
        title: '申报经费',
        dataIndex: 'amount',
        key: 'amount',
        width: 120,
        render: (value: number) => `¥ ${value.toLocaleString()}`,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        render: (status) => <StatusTag status={status} />,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 170,
        render: (value: string) => formatDateTime(value),
      },
      {
        title: '操作',
        key: 'actions',
        width: 320,
        render: (_, record) => (
          <Space size={4} wrap>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(ROUTE_PATHS.projectEdit.replace(':id', record.id))
              }
            >
              查看
            </Button>
            {canSubmitProject(record) ? (
              <Popconfirm
                title="确认提交项目？"
                description={`提交后，${record.title} 将进入审批流程，无法继续编辑。`}
                okText="确认提交"
                cancelText="取消"
                onConfirm={() => void handleSubmit(record)}
              >
                <PermissionButton
                  permission={PROJECT_ACTION_PERMISSION_MAP.submit}
                  type="link"
                  icon={<SendOutlined />}
                  loading={submitProjectMutation.isPending}
                >
                  提交
                </PermissionButton>
              </Popconfirm>
            ) : (
              <PermissionButton
                permission={PROJECT_ACTION_PERMISSION_MAP.submit}
                type="link"
                icon={<SendOutlined />}
                disabled
                tooltip={getActionDisabledReason(record, 'submit')}
              >
                提交
              </PermissionButton>
            )}
            {canDeleteProject(record) ? (
              <Popconfirm
                title="确认删除草稿？"
                description={`删除后无法恢复，是否删除 ${record.title}？`}
                okText="确认删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
                onConfirm={() => void handleDelete(record)}
              >
                <PermissionButton
                  permission={PROJECT_ACTION_PERMISSION_MAP.delete}
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  loading={deleteProjectMutation.isPending}
                >
                  删除
                </PermissionButton>
              </Popconfirm>
            ) : (
              <PermissionButton
                permission={PROJECT_ACTION_PERMISSION_MAP.delete}
                type="link"
                danger
                icon={<DeleteOutlined />}
                disabled
                tooltip={getActionDisabledReason(record, 'delete')}
              >
                删除
              </PermissionButton>
            )}
          </Space>
        ),
      },
    ],
    [deleteProjectMutation.isPending, navigate, submitProjectMutation.isPending],
  )

  const handleSearch = (values: ProjectListParams) => {
    setFilters({
      keyword: values.keyword?.trim() ?? '',
      status: values.status ?? '',
    })
  }

  const handleReset = () => {
    form.resetFields()
    setFilters({
      keyword: '',
      status: '',
    })
  }

  const handleSubmit = async (project: ProjectRecord) => {
    await submitProjectMutation.mutateAsync(project.id)
  }

  const handleDelete = async (project: ProjectRecord) => {
    await deleteProjectMutation.mutateAsync(project.id)
  }

  return (
    <div className="page-stack">
      <Card className="page-card">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Space direction="vertical" size={4}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                我的申报
              </Typography.Title>
              <Typography.Text type="secondary">
                这里展示当前用户已经发起的申报记录，包括草稿、已提交、审批中和审批结果。
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Button onClick={() => navigate(ROUTE_PATHS.projectList)}>
              返回可申报项目
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="page-card">
        <Form
          form={form}
          layout="inline"
          initialValues={filters}
          onFinish={handleSearch}
        >
          <Form.Item name="keyword" label="关键词">
            <Input
              allowClear
              placeholder="支持项目名称 / 编号搜索"
              style={{ width: 260 }}
            />
          </Form.Item>
          <Form.Item name="status" label="项目状态">
            <Select
              options={PROJECT_STATUS_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              style={{ width: 180 }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card className="page-card">
        <Table<ProjectRecord>
          rowKey="id"
          loading={projectListQuery.isLoading || projectListQuery.isFetching}
          columns={columns}
          dataSource={tableData}
          locale={{
            emptyText: (
              <Empty
                description={
                  projectListQuery.isError
                    ? '列表加载失败，请稍后重试'
                    : '当前还没有申报记录'
                }
              />
            ),
          }}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1180 }}
        />
      </Card>
    </div>
  )
}
