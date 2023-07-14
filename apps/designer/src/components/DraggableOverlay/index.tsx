import { createPortal } from 'react-dom'
import { DragOverlay } from '@dnd-kit/core'
import type { DropAnimation } from '@dnd-kit/core'

const dropAnimationConfig: DropAnimation = {
  sideEffects({ active }) {
    active.node.style.opacity = '0'

    return () => {
      active.node.style.opacity = ''
    }
  },
}

interface Props {
  dropAnimation?: DropAnimation | null
  children: React.ReactNode
}

export function DraggableOverlay({
  dropAnimation = dropAnimationConfig,
  children,
}: Props) {
  return createPortal(
    <DragOverlay dropAnimation={dropAnimation}>{children}</DragOverlay>,
    document.body
  )
}
