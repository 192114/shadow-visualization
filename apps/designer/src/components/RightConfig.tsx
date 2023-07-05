import { useState } from 'react'
import { GroupEnum } from '@schema/types'
import { Form } from 'antd'
import cn from 'classnames'

import { useConfigPanelStore, useCurrentSchema } from '~/store'

import Icons from './Icons'
import styles from './RightConfig.module.css'

type ConfigGroup = keyof typeof GroupEnum

export default function RightConfig() {
  const { open, toggleOpen } = useConfigPanelStore()

  const [outerOpen, setOuterOpen] = useState(open)

  const { schemaConfig } = useCurrentSchema()

  const { schema = {} } = schemaConfig ?? {}

  const tabList = Object.keys(schema) as ConfigGroup[]

  const [activeTab, setActiveTab] = useState<ConfigGroup | null>(
    tabList[0] ?? null
  )

  if (schemaConfig === null) {
    return null
  }

  return (
    <div className={styles.outer} style={{ width: outerOpen ? undefined : 0 }}>
      <div className={cn(styles.wrapper, { [styles.hide]: !open })}>
        <div className={styles.former}>
          <div className={styles.tabs}>
            {tabList.map((item) => (
              <label
                className={cn(styles.tabItem, {
                  [styles.active]: activeTab === item,
                })}
                key={item}
                onClick={() => setActiveTab(item)}
              >
                {GroupEnum[item]}
              </label>
            ))}
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
              }, 50)
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
