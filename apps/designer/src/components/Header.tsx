import type { ReactNode } from 'react'
import { Switch } from 'antd'

import Icons from '~/components/Icons'
import { useThemeStore } from '~/store'

import styles from './Header.module.css'

export interface HeaderProps {
  children?: ReactNode
}

export default function Header({ children }: HeaderProps) {
  const { isDark, toggleDark } = useThemeStore()
  return (
    <header className={styles.header}>
      <div className={styles.content}>{children}</div>

      <Switch
        checkedChildren={
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              lineHeight: 0,
            }}
          >
            <Icons.sun size={14} color="#FAFA33" />
          </span>
        }
        unCheckedChildren={<Icons.moon size={14} />}
        // checked={!isDark}
        // onChange={() => toggleDark()}
      />
    </header>
  )
}
