import { createPortal } from 'react-dom'
import { defaultDropAnimationSideEffects, DragOverlay } from '@dnd-kit/core'
import type { DropAnimation } from '@dnd-kit/core'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
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
