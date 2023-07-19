import { useDraggable } from '@dnd-kit/core'
import cn from 'classnames'

import Icons from '../Icons'
import styles from './TemplateList.module.css'

const typeIconMap = {
  line: Icons.lineChart,
  bar: Icons.barChart,
  pie: Icons.pieChart,
  gantt: Icons.ganttChart,
}

interface Props {
  type: keyof typeof typeIconMap
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

  const Component = typeIconMap[type]

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
    >
      <Component className={styles.icon} size={48} strokeWidth={1} />
    </div>
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
