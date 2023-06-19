import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export interface DragItemProps {
  id: string
  top: number
  left: number
}

export default function DragItem(props: DragItemProps) {
  const { id, top, left } = props
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        width: 200,
        height: 200,
        background: 'yellow',
        transform: CSS.Translate.toString(transform),
        top,
        left,
        position: 'relative',
        cursor: 'grab',
      }}
    >
      {id}
    </div>
  )
}
