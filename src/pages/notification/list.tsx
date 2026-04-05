import {
  BellOutlined,
  CheckCircleOutlined,
  MailOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  List,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  NOTIFICATION_READ_OPTIONS,
  NOTIFICATION_TYPE_LABEL_MAP,
  NOTIFICATION_TYPE_OPTIONS,
} from '../../constants/notification'
import { ROUTE_PATHS } from '../../constants/route'
import {
  useMarkNotificationRead,
  useNotificationList,
} from '../../hooks/useNotifications'
import type { NotificationListParams, NotificationRecord } from '../../types/notification'
import { formatDateTime } from '../../utils/date'

function getTypeTag(type: NotificationRecord['type']) {
  if (type === 'approval') {
    return <Tag color="blue">{NOTIFICATION_TYPE_LABEL_MAP[type]}</Tag>
  }

  return <Tag>{NOTIFICATION_TYPE_LABEL_MAP[type]}</Tag>
}

export default function NotificationListPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm<NotificationListParams>()
  const [filters, setFilters] = useState<NotificationListParams>({
    keyword: '',
    read: '',
    type: '',
  })
  const notificationListQuery = useNotificationList(filters)
  const markReadMutation = useMarkNotificationRead()

  const notifications = notificationListQuery.data ?? []

  const handleSearch = (values: NotificationListParams) => {
    setFilters({
      keyword: values.keyword?.trim() ?? '',
      read: values.read ?? '',
      type: values.type ?? '',
    })
  }

  const handleReset = () => {
    form.resetFields()
    setFilters({
      keyword: '',
      read: '',
      type: '',
    })
  }

  const handleRead = async (item: NotificationRecord) => {
    if (item.read) {
      return
    }

    await markReadMutation.mutateAsync(item.id)
  }

  const handleOpenRelatedProject = async (item: NotificationRecord) => {
    if (!item.read) {
      await markReadMutation.mutateAsync(item.id)
    }

    if (item.relatedProjectId) {
      navigate(ROUTE_PATHS.projectEdit.replace(':id', item.relatedProjectId))
    }
  }

  return (
    <div className="page-stack">
      <Card className="page-card">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Space direction="vertical" size={4}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                通知中心
              </Typography.Title>
              <Typography.Text type="secondary">
                这里聚合审批结果和系统提醒，帮助用户及时感知项目状态变化。
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
              placeholder="支持标题 / 内容搜索"
              style={{ width: 280 }}
            />
          </Form.Item>
          <Form.Item name="type" label="通知类型">
            <Select
              options={NOTIFICATION_TYPE_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item name="read" label="阅读状态">
            <Select
              options={NOTIFICATION_READ_OPTIONS.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              style={{ width: 160 }}
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
        <List<NotificationRecord>
          loading={notificationListQuery.isLoading || notificationListQuery.isFetching}
          dataSource={notifications}
          locale={{
            emptyText: (
              <Empty
                description={
                  notificationListQuery.isError
                    ? '通知加载失败，请稍后重试'
                    : '当前没有符合条件的通知'
                }
              />
            ),
          }}
          renderItem={(item) => (
            <List.Item
              actions={[
                item.relatedProjectId ? (
                  <Button
                    type="link"
                    key="view"
                    onClick={() => void handleOpenRelatedProject(item)}
                  >
                    查看关联项目
                  </Button>
                ) : null,
                !item.read ? (
                  <Button
                    type="link"
                    key="read"
                    icon={<CheckCircleOutlined />}
                    loading={markReadMutation.isPending}
                    onClick={() => void handleRead(item)}
                  >
                    标记已读
                  </Button>
                ) : null,
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  item.type === 'approval' ? <MailOutlined /> : <BellOutlined />
                }
                title={
                  <Space>
                    <Typography.Text strong={!item.read}>{item.title}</Typography.Text>
                    {getTypeTag(item.type)}
                    {!item.read ? <Tag color="red">未读</Tag> : <Tag>已读</Tag>}
                  </Space>
                }
                description={
                  <Space direction="vertical" size={8}>
                    <Typography.Text type="secondary">
                      {item.content}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {formatDateTime(item.createdAt)}
                    </Typography.Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}
