import { EyeOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusTag } from '../../components/common/StatusTag'
import { PROJECT_STATUS_OPTIONS, PROJECT_STATUS } from '../../constants/project'
import { ROUTE_PATHS } from '../../constants/route'
import { useApprovalList } from '../../hooks/useApprovals'
import type { ProjectListParams, ProjectRecord } from '../../types/project'
import { formatDateTime } from '../../utils/date'

const approvalStatusOptions = PROJECT_STATUS_OPTIONS.filter(
  (item) => item.value !== PROJECT_STATUS.draft,
)

export default function ApprovalListPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm<ProjectListParams>()
  const [filters, setFilters] = useState<ProjectListParams>({
    keyword: '',
    status: '',
  })
  const approvalListQuery = useApprovalList(filters)

  const tableData = approvalListQuery.data ?? []

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
        title: '申请人',
        dataIndex: 'applicantName',
        key: 'applicantName',
        width: 100,
      },
      {
        title: '所属院系',
        dataIndex: 'department',
        key: 'department',
        width: 120,
      },
      {
        title: '项目类别',
        dataIndex: 'category',
        key: 'category',
        width: 120,
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
        width: 120,
        render: (_, record) => (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(ROUTE_PATHS.approvalDetail.replace(':id', record.id))
            }
          >
            查看审批
          </Button>
        ),
      },
    ],
    [navigate],
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

  return (
    <div className="page-stack">
      <Card className="page-card">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Space direction="vertical" size={4}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                项目审批列表
              </Typography.Title>
              <Typography.Text type="secondary">
                这里集中展示已经进入审批体系的申报记录，管理员可以通过筛选快速定位待处理项目。
              </Typography.Text>
            </Space>
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
              placeholder="支持项目名称 / 编号 / 申请人搜索"
              style={{ width: 280 }}
            />
          </Form.Item>
          <Form.Item name="status" label="审批状态">
            <Select
              options={approvalStatusOptions.map((option) => ({
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
          loading={approvalListQuery.isLoading || approvalListQuery.isFetching}
          columns={columns}
          dataSource={tableData}
          locale={{
            emptyText: (
              <Empty
                description={
                  approvalListQuery.isError
                    ? '审批列表加载失败，请稍后重试'
                    : '当前没有符合条件的审批记录'
                }
              />
            ),
          }}
          pagination={{
            pageSize: 6,
            showSizeChanger: false,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1180 }}
        />
      </Card>
    </div>
  )
}
