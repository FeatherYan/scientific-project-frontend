import {
  LockOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROLE_LABEL_MAP, ROLES, type Role } from '../../constants/role'
import { getDefaultHomePathByRole } from '../../permission/access'
import { useAuth } from '../../hooks/useAuth'
import { useLogin } from '../../hooks/useLogin'
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
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, role } = useAuth()
  const loginMutation = useLogin()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getDefaultHomePathByRole(role), { replace: true })
    }
  }, [isAuthenticated, navigate, role])

  const handleLogin = async (values: {
    username: string
    password: string
    role: Role
  }) => {
    const authInfo = await loginMutation.mutateAsync(values)

    dispatch(
      loginSuccess({
        token: authInfo.token,
        role: authInfo.role as Role,
        userInfo: authInfo.userInfo!,
      }),
    )

    const redirectPath = location.state?.redirect as string | undefined

    navigate(redirectPath || getDefaultHomePathByRole(authInfo.role), {
      replace: true,
    })
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
              当前阶段使用 MSW 模拟登录接口，帮助我们先打通登录鉴权闭环。
            </Typography.Text>
          </div>

          <Alert
            type="info"
            showIcon
            message="Mock 账号"
            description="普通用户：teacher / 123456；管理员：admin / 123456"
          />

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              username: 'teacher',
              password: '123456',
              role: ROLES.user,
            }}
            onFinish={(values) => void handleLogin(values)}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item
              label="登录角色"
              name="role"
              rules={[{ required: true, message: '请选择登录角色' }]}
            >
              <Radio.Group optionType="button" buttonStyle="solid">
                {roleOptions.map((option) => (
                  <Radio.Button value={option.role} key={option.role}>
                    {ROLE_LABEL_MAP[option.role]}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>

            <Row gutter={[12, 12]}>
              {roleOptions.map((option) => (
                <Col xs={24} md={12} key={option.role}>
                  <Card
                    size="small"
                    className="role-card"
                    hoverable
                    onClick={() =>
                      form.setFieldsValue({
                        username: option.role === ROLES.user ? 'teacher' : 'admin',
                        password: '123456',
                        role: option.role,
                      })
                    }
                  >
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
                      <Typography.Text type="secondary">
                        点击卡片可自动填充该角色示例账号。
                      </Typography.Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loginMutation.isPending}
            >
              登录进入系统
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  )
}
