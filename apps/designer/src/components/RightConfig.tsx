import { useState } from 'react'
import { Form } from 'antd'
import cn from 'classnames'

import { useConfigPanelStore } from '~/store'

import Icons from './Icons'
import styles from './RightConfig.module.css'

export default function RightConfig() {
  const { open, toggleOpen } = useConfigPanelStore()

  const [outerOpen, setOuterOpen] = useState(open)

  return (
    <div className={styles.outer} style={{ width: outerOpen ? undefined : 0 }}>
      <div className={cn(styles.wrapper, { [styles.hide]: !open })}>
        <div className={styles.former}>
          <div className={styles.tabs}>
            <label className={styles.tabItem}>分类1</label>
            <label className={styles.tabItem}>分类2</label>
          </div>

          <div className={styles.tabPanel}>
            <Form></Form>
          </div>
        </div>

        {/* 开关 */}
        <div
          className={styles.switch}
          onClick={() => {
            if (open) {
              setTimeout(() => {
                setOuterOpen(false)
              }, 300)
            } else {
              setOuterOpen(true)
            }

            toggleOpen()
          }}
        >
          {open ? <Icons.rightArrow /> : <Icons.leftArrow />}
        </div>
      </div>
    </div>
  )
}
