import { Card, Space, Tag, Typography } from 'antd'

type PagePlaceholderProps = {
  title: string
  description: string
  tags?: string[]
}

export function PagePlaceholder({
  title,
  description,
  tags = [],
}: PagePlaceholderProps) {
  return (
    <Card className="page-card">
      <Space direction="vertical" size={16}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
          {description}
        </Typography.Paragraph>
        <Space size={[8, 8]} wrap>
          {tags.map((tag) => (
            <Tag color="cyan" key={tag}>
              {tag}
            </Tag>
          ))}
        </Space>
      </Space>
    </Card>
  )
}
