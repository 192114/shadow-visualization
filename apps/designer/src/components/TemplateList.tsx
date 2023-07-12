import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import styles from './TemplateList.module.css'

export default function TemplateList() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'accept-drop',
    data: {
      type: 'template',
    },
  })
  return (
    <div className={styles.container}>
      <div
        className={styles.item}
        style={{ transform: CSS.Translate.toString(transform), zIndex: 999999, position:'relative' }}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
      >
        <p>template 1</p>
      </div>
    </div>
  )
}
