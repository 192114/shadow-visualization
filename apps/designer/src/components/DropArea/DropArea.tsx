import type { CSSProperties } from 'react'
import { useEffect } from 'react'
import { useDroppable, type UniqueIdentifier } from '@dnd-kit/core'
import cn from 'classnames'

import styles from './DropArea.module.css'

interface Props {
  children: React.ReactNode
  id: UniqueIdentifier
  style?: CSSProperties
  setRef?: (node: HTMLElement | null) => void
}

export function DropArea({ children, id, style, setRef }: Props) {
  const { setNodeRef, node, isOver, active } = useDroppable({
    id,
  })

  useEffect(() => {
    if (setRef) {
      setRef(node.current)
    }
  }, [node, setRef])

  const showFocus = active?.data.current?.from === 'template' && isOver

  return (
    <div
      ref={setNodeRef}
      className={cn(styles.container, { [styles.focus]: showFocus })}
      style={style}
    >
      {children}
    </div>
  )
}
