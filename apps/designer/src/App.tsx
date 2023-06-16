import { lazy, Suspense, useEffect } from 'react'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import LoadingOrError from '~/components/LoadingOrError'
import { useThemeStore } from '~/store'

import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const presetToken = {
  colorPrimary: '#722ED1',
  colorInfo: '#722ed1',
  colorTextBase: '#000',
}

const EditorPage = lazy(() => import('~/pages/editor'))

function App() {
  const isDark = useThemeStore((state) => state.isDark)

  useEffect(() => {
    if (typeof isDark !== 'undefined') {
      document.body.setAttribute('data-dark', isDark ? '1' : '0')
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
        <Suspense fallback={<LoadingOrError />}>
          <Routes>
            <Route path="editor/:id" element={<EditorPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
