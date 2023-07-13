import { useDroppable } from '@dnd-kit/core'

import styles from './DropArea.module.css'

interface Props {
  children: React.ReactNode
}

export function DropArea({ children }: Props) {
  const { setNodeRef } = useDroppable({
    id: 'accept-drop',
  })
  return (
    <div ref={setNodeRef} className={styles.container}>
      {children}
    </div>
  )
}
