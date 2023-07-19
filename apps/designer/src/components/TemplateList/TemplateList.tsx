import { useDndContext } from '@dnd-kit/core'
import cn from 'classnames'
import SimpleBar from 'simplebar-react'

import { useTemplateKeyStore, useTemplateListStore } from '~/store'

import { DraggableOverlay } from '../DraggableOverlay'
import TemplateItem, { TemplateDraggable } from './TemplateItem'
import styles from './TemplateList.module.css'

import 'simplebar-react/dist/simplebar.min.css'

export function TemplateList() {
  const { templateList, activeType } = useTemplateListStore()
  const wrapperKey = useTemplateKeyStore((state) => state.wrapperKey)
  const { active, over } = useDndContext()

  return (
    <SimpleBar
      className={cn(styles.container, { [styles.active]: active && !over })}
      key={wrapperKey}
    >
      <p className={styles.alert}>拖拽添加模板</p>

      {templateList.map((item) => {
        return (
          <TemplateItem
            type={item.type}
            key={item.type}
            title={item.title}
            isActive={activeType === item.type}
          />
        )
      })}

      <DraggableOverlay>
        {active ? (
          <TemplateDraggable
            dragging
            isOverlay
            type={active.data.current?.type}
            title={active.data.current?.title}
          />
        ) : null}
      </DraggableOverlay>
    </SimpleBar>
  )
}
