import type { ReactNode } from 'react'
import { Switch } from 'antd'

import Icons from '~/components/Icons'
import { useThemeStore } from '~/store'

import styles from './Header.module.css'

export interface HeaderProps {
  children?: ReactNode
}

export function Header({ children }: HeaderProps) {
  const { isDark, toggleDark } = useThemeStore()
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/favicon-32x32.png" alt="" />
      </div>

      <div className={styles.content}>{children}</div>

      <Switch
        checkedChildren={
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 22,
            }}
          >
            <Icons.sun size={14} color="#FAFA33" />
          </span>
        }
        unCheckedChildren={
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 22,
            }}
          >
            <Icons.moon size={14} />
          </span>
        }
        checked={!isDark}
        onChange={() => toggleDark()}
      />
    </header>
  )
}
