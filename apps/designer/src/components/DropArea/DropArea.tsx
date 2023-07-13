import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useDroppable, type UniqueIdentifier } from '@dnd-kit/core'

import styles from './DropArea.module.css'

interface Props {
  children: React.ReactNode
  id: UniqueIdentifier
  style?: CSSProperties
  setRef?: (node: HTMLElement | null) => void
}

export function DropArea({ children, id, style, setRef }: Props) {
  const { setNodeRef, node } = useDroppable({
    id,
  })

  useEffect(() => {
    if (setRef) {
      setRef(node.current)
    }
  }, [node, setRef])

  return (
    <div ref={setNodeRef} className={styles.container} style={style}>
      {children}
    </div>
  )
}
