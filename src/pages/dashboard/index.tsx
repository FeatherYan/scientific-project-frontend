import { Card, Col, Row, Statistic, Typography } from 'antd'

const cards = [
  { title: '待处理任务', value: 8, suffix: '项' },
  { title: '本月申报数', value: 24, suffix: '项' },
  { title: '审批通过率', value: 76, suffix: '%' },
]

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <Card className="page-card">
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          工作台
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          第一版骨架先提供统一首页，用来承接后续的统计卡片、快捷入口和待办提醒。
        </Typography.Paragraph>
      </Card>
      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col xs={24} md={8} key={card.title}>
            <Card className="page-card">
              <Statistic {...card} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
