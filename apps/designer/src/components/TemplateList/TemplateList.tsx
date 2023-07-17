import { useDndContext } from '@dnd-kit/core'
import cn from 'classnames'

import { useTemplateKeyStore, useTemplateListStore } from '~/store'

import { DraggableOverlay } from '../DraggableOverlay'
import TemplateItem, { TemplateDraggable } from './TemplateItem'
import styles from './TemplateList.module.css'

export function TemplateList() {
  const { templateList, activeType } = useTemplateListStore()
  const wrapperKey = useTemplateKeyStore((state) => state.wrapperKey)
  const { active } = useDndContext()

  return (
    <div
      className={cn(styles.container, { [styles.active]: active })}
      key={wrapperKey}
    >
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
    </div>
  )
}
