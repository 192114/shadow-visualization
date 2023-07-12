import { useState } from 'react'
import { GroupEnum } from '@schema/types'
import type { SchemaListItem } from '@schema/types'
import { useDeepCompareEffect } from 'ahooks'
import {
  Collapse,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
} from 'antd'
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

  const [tabList, setTabList] = useState<ConfigGroup[]>([])
  const [activeTab, setActiveTab] = useState<ConfigGroup | null>(null)

  useDeepCompareEffect(() => {
    const tabs = Object.keys(schema) as ConfigGroup[]
    setActiveTab(tabList[0] ?? null)
    setTabList(tabs)
  }, [schema])

  if (schemaConfig === null) {
    return null
  }

  function renderFormItem(
    currentSchema: SchemaListItem<Record<string, unknown>>
  ) {
    const { type, name, label, help } = currentSchema

    const commonFormItemProps = { label, help, name, key: name }

    switch (type) {
      case 'input': {
        return (
          <Form.Item {...commonFormItemProps}>
            <Input />
          </Form.Item>
        )
      }

      case 'inputNumber': {
        const { min, max, step } = currentSchema
        return (
          <Form.Item {...commonFormItemProps}>
            <InputNumber
              min={min}
              max={max}
              step={step}
              style={{ width: '100%' }}
            />
          </Form.Item>
        )
      }

      case 'select': {
        const { options } = currentSchema
        return (
          <Form.Item {...commonFormItemProps}>
            <Select options={options} />
          </Form.Item>
        )
      }
      case 'radio': {
        const { options, direction } = currentSchema
        return (
          <Form.Item {...commonFormItemProps}>
            <Radio.Group>
              <Space direction={direction}>
                {options.map((option) => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        )
      }
      case 'switch': {
        return (
          <Form.Item {...commonFormItemProps}>
            <Switch />
          </Form.Item>
        )
      }
      case 'color': {
        return (
          <Form.Item {...commonFormItemProps}>
            <ColorPicker />
          </Form.Item>
        )
      }
      // case 'json':
      case 'textarea': {
        return (
          <Form.Item {...commonFormItemProps}>
            <Input.TextArea />
          </Form.Item>
        )
      }
    }

    return null
  }

  return (
    <div
      className={cn(styles.outer, { [styles.outerTransition]: outerOpen })}
      style={{ width: outerOpen ? undefined : 0 }}
    >
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
            {activeTab && (
              <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {schema[activeTab]?.map((item, idx) => {
                  if ('isCollapse' in item) {
                    const collapseItems = item.children.map((child) => {
                      return {
                        key: child.groupName,
                        label: child.groupName,
                        children: child.schemaList.map((schemaItem) => {
                          return renderFormItem(schemaItem)
                        }),
                        style: {
                          marginBottom: 12,
                        },
                      }
                    })
                    return (
                      <Collapse
                        items={collapseItems}
                        key={idx}
                        bordered={false}
                      />
                    )
                  } else {
                    return renderFormItem(item)
                  }
                })}
              </Form>
            )}
          </div>
        </div>

        {/* 开关 */}
        <div
          className={styles.switch}
          onClick={() => {
            if (open) {
              setOuterOpen(false)
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
