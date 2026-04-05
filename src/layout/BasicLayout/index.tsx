import type { ReactNode } from 'react'
import {
  BellOutlined,
  ContainerOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ProjectOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, Menu, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/route'
import { useAuth } from '../../hooks/useAuth'
import { getMenuItems, type AppMenuItem } from '../../permission/menu'

const { Header, Content, Sider } = Layout

const iconMap: Record<string, ReactNode> = {
  dashboard: <DashboardOutlined />,
  project: <ProjectOutlined />,
  form: <ContainerOutlined />,
  mine: <UserOutlined />,
  approval: <SafetyCertificateOutlined />,
  notification: <BellOutlined />,
}

function decorateMenuItems(items: AppMenuItem[]): AppMenuItem[] {
  return items.map((item) => {
    return {
      ...item,
      icon: item.iconName ? iconMap[item.iconName] : undefined,
      children: item.children
        ? decorateMenuItems(item.children)
        : undefined,
    }
  })
}

export function BasicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userInfo, role, roleLabel, permissions, logout } = useAuth()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    if (location.pathname.startsWith('/projects/')) {
      setSelectedKeys([location.pathname === '/projects/mine' ? '/projects/mine' : '/projects/list'])
      return
    }

    if (location.pathname.startsWith('/approvals/')) {
      setSelectedKeys(['/approvals/list'])
      return
    }

    setSelectedKeys([location.pathname])
  }, [location.pathname])

  const menuItems = decorateMenuItems(getMenuItems(role, permissions))

  return (
    <Layout className="app-shell">
      <Sider width={232} className="app-sider">
        <div className="brand-block">
          <Typography.Title level={4} style={{ color: '#ecfeff', margin: 0 }}>
            科研项目管理平台
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(236, 254, 255, 0.72)' }}>
            MVP 面试项目骨架
          </Typography.Text>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={({ key }) => navigate(String(key))}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Space size={12}>
            <Typography.Text type="secondary">
              当前角色：{roleLabel || '-'}
            </Typography.Text>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'notification',
                    icon: <BellOutlined />,
                    label: '通知中心',
                    onClick: () => navigate(ROUTE_PATHS.notificationList),
                  },
                  {
                    key: 'logout',
                    danger: true,
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    onClick: () => {
                      logout()
                      navigate(ROUTE_PATHS.login, { replace: true })
                    },
                  },
                ],
              }}
            >
              <Button type="text" className="user-trigger">
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span>{userInfo?.name ?? '未登录'}</span>
                  <span className="user-role-badge">{role}</span>
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
