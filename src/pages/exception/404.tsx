import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/route'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="页面不存在，可能是路由地址有误。"
      extra={
        <Button type="primary" onClick={() => navigate(ROUTE_PATHS.root)}>
          回到首页
        </Button>
      }
    />
  )
}
