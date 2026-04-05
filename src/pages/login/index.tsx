import {
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Form, Input, Row, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ROLE_LABEL_MAP, ROLES, type Role } from '../../constants/role'
import { ROUTE_PATHS } from '../../constants/route'
import { getDefaultHomePathByRole } from '../../permission/access'
import { useAppDispatch } from '../../store/hooks'
import { loginSuccess } from '../../store/slices/authSlice'

const roleOptions: Array<{ role: Role; tip: string }> = [
  {
    role: ROLES.user,
    tip: '模拟教师/研究生入口，后续接项目申报相关页面。',
  },
  {
    role: ROLES.admin,
    tip: '模拟管理员入口，后续接审批管理相关页面。',
  },
]

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogin = (role: Role) => {
    dispatch(
      loginSuccess({
        token: `${role}-token`,
        role,
        userInfo: {
          id: role === ROLES.user ? 'u_001' : 'a_001',
          name: role === ROLES.user ? '张老师' : '系统管理员',
        },
      }),
    )

    navigate(getDefaultHomePathByRole(role), { replace: true })
  }

  return (
    <div className="login-page">
      <div className="login-hero">
        <Typography.Text className="login-eyebrow">
          React + TypeScript + Ant Design
        </Typography.Text>
        <Typography.Title className="login-title">
          科研项目管理平台
        </Typography.Title>
        <Typography.Paragraph className="login-desc">
          第一版先完成登录入口、权限骨架、动态菜单和主布局，后续业务页面会在这套结构上逐步补齐。
        </Typography.Paragraph>
      </div>

      <Card className="login-card" bordered={false}>
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={3} style={{ marginBottom: 8 }}>
              账号登录
            </Typography.Title>
            <Typography.Text type="secondary">
              当前阶段使用角色快捷登录，帮助我们先验证鉴权与路由骨架。
            </Typography.Text>
          </div>

          <Form layout="vertical">
            <Form.Item label="用户名">
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="密码">
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>
          </Form>

          <Row gutter={[12, 12]}>
            {roleOptions.map((option) => (
              <Col xs={24} md={12} key={option.role}>
                <Card size="small" className="role-card">
                  <Space direction="vertical" size={12}>
                    <Space>
                      <SafetyCertificateOutlined />
                      <Typography.Text strong>
                        {ROLE_LABEL_MAP[option.role]}
                      </Typography.Text>
                    </Space>
                    <Typography.Text type="secondary">
                      {option.tip}
                    </Typography.Text>
                    <Button
                      type="primary"
                      block
                      onClick={() => handleLogin(option.role)}
                    >
                      以{ROLE_LABEL_MAP[option.role]}身份进入
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Button type="link" onClick={() => navigate(ROUTE_PATHS.root)}>
            直接查看系统骨架
          </Button>
        </Space>
      </Card>
    </div>
  )
}
