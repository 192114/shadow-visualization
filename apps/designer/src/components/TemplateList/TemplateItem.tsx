import { DragOverlay, useDndContext, useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import styles from './TemplateList.module.css'

interface Props {
  type: string
  dragging?: boolean
  dragOverlay?: boolean
}

export default function TemplateItem({ type, dragging }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: type,
    data: {
      type,
    },
  })

  return (
    <div
      className={styles.item}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      <p>template 1</p>
    </div>
  )
}
