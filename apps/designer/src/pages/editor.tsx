import { Button } from 'antd'

import Header from '~/components/Header'
import { useThemeStore } from '~/store'

export default function Editor() {
  const toggleDark = useThemeStore((state) => state.toggleDark)
  return (
    <div>
      <Header></Header>
    </div>
  )
}
