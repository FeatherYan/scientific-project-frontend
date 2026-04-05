import { EyeOutlined, FormOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Space,
  Table,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PermissionButton } from '../../components/business/PermissionButton'
import { PERMISSIONS } from '../../constants/permission'
import { ROUTE_PATHS } from '../../constants/route'
import { useProjectOpportunityList } from '../../hooks/useProjects'
import type { ProjectListParams } from '../../types/project'
import type { ProjectOpportunity } from '../../types/projectOpportunity'
import { formatDateTime } from '../../utils/date'

export default function ProjectListPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm<ProjectListParams>()
  const [filters, setFilters] = useState<ProjectListParams>({
    keyword: '',
  })
  const projectListQuery = useProjectOpportunityList(filters)

  const tableData = projectListQuery.data ?? []

  const columns = useMemo<ColumnsType<ProjectOpportunity>>(
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
        title: '发布部门',
        dataIndex: 'department',
        key: 'department',
        width: 120,
      },
      {
        title: '经费上限',
        dataIndex: 'amountLimit',
        key: 'amountLimit',
        width: 120,
        render: (value: number) => `¥ ${value.toLocaleString()}`,
      },
      {
        title: '申报截止时间',
        dataIndex: 'deadline',
        key: 'deadline',
        width: 170,
        render: (value: string) => formatDateTime(value),
      },
      {
        title: '操作',
        key: 'actions',
        width: 180,
        render: (_, record) => (
          <Space size={4} wrap>
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(ROUTE_PATHS.projectDetail.replace(':id', record.id))
              }
            >
              查看详情
            </Button>
            <PermissionButton
              permission={PERMISSIONS.projectCreate}
              type="link"
              icon={<FormOutlined />}
              onClick={() =>
                navigate(ROUTE_PATHS.projectDetail.replace(':id', record.id))
              }
            >
              去申报
            </PermissionButton>
          </Space>
        ),
      },
    ],
    [navigate],
  )

  const handleSearch = (values: ProjectListParams) => {
    setFilters({
      keyword: values.keyword?.trim() ?? '',
    })
  }

  const handleReset = () => {
    form.resetFields()
    setFilters({
      keyword: '',
    })
  }

  return (
    <div className="page-stack">
      <Card className="page-card">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Space direction="vertical" size={4}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                可申报项目
              </Typography.Title>
              <Typography.Text type="secondary">
                这里展示系统当前开放申报的项目。用户可以先查看项目详情、申报要求和截止时间，再决定是否发起申报。
              </Typography.Text>
            </Space>
          </Col>
          <Col>
            <Button onClick={() => navigate(ROUTE_PATHS.projectMine)}>
              查看我的申报
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
        <Table<ProjectOpportunity>
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
                    : '暂无符合条件的可申报项目'
                }
              />
            ),
          }}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1080 }}
        />
      </Card>
    </div>
  )
}
