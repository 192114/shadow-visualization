import { lazy, Suspense, useEffect } from 'react'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppLoading } from '~/components/AppLoading'
import { useThemeStore } from '~/store'

import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const presetToken = {
  colorPrimary: '#722ED1',
  colorInfo: '#722ed1',
}

const EditorPage = lazy(() => import('~/pages/editor'))

function App() {
  const isDark = useThemeStore((state) => state.isDark)

  useEffect(() => {
    if (typeof isDark !== 'undefined') {
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }
  }, [isDark])

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: presetToken,
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <Suspense fallback={<AppLoading />}>
          <Routes>
            <Route path="editor/:id" element={<EditorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
