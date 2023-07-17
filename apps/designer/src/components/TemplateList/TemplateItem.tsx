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

export function TemplateDraggable({
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
      className={cn(styles.dragger, {
        [styles.dragging]: dragging,
        [styles.overlay]: isOverlay,
        [styles.active]: isActive,
      })}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    ></div>
  )
}

export default function TemplateItem({ title, ...restProps }: Props) {
  return (
    <div className={styles.item}>
      <p className={styles.title}>{title}</p>
      <TemplateDraggable {...restProps} title={title} />
    </div>
  )
}
