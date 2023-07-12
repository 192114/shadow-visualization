import { useDraggable } from '@dnd-kit/core'

import styles from './TemplateList.module.css'

export default function TemplateList() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'aaaaaaaa',
    data: {
      tyep: 'template',
    },
  })
  return (
    <div className={styles.container}>
      <div
        className={styles.item}
        style={
          {
            '--translate-x': `${transform?.x ?? 0}px`,
            '--translate-y': `${transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
        {...attributes}
        {...listeners}
        ref={setNodeRef}
      >
        <p>template 1</p>
      </div>
    </div>
  )
}
