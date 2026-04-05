import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { AppProviders } from './providers'
import { AppRouter } from './router'

const theme = {
  token: {
    colorPrimary: '#0f766e',
    colorInfo: '#0f766e',
    borderRadius: 10,
    fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
  },
}

function App() {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntdApp>
        <AppProviders>
          <AppRouter />
        </AppProviders>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
