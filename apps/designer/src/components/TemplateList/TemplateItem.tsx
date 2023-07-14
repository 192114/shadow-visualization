import { useDraggable } from '@dnd-kit/core'
import cn from 'classnames'

import styles from './TemplateList.module.css'

interface Props {
  type: string
  title: string
  dragging?: boolean
  isOverlay?: boolean
  isActive?: boolean
}

export default function TemplateItem({
  type,
  title,
  dragging,
  isOverlay,
  isActive,
}: Props) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: type,
    data: {
      type,
      title,
      from: 'template',
    },
  })

  return (
    <div
      className={cn(styles.item, {
        [styles.dragging]: dragging,
        [styles.overlay]: isOverlay,
        [styles.active]: isActive,
      })}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      <p>{title}</p>
    </div>
  )
}
