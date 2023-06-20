import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ResizableBox } from 'react-resizable'

import 'react-resizable/css/styles.css'

import { useCardListStore } from '~/store'

import styles from './DragItem.module.css'
import Icons from './Icons'

export interface DragItemProps {
  id: string
  top: number
  left: number
  width: number
  height: number
}

export default function DragItem(props: DragItemProps) {
  const { id, top, left, width, height } = props
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })
  const resize = useCardListStore((state) => state.resize)

  return (
    <div
      style={{
        width,
        height,
        background: 'yellow',
        transform: CSS.Translate.toString(transform),
        top,
        left,
        position: 'absolute',
      }}
    >
      <ResizableBox
        width={width}
        height={height}
        minConstraints={[100, 100]}
        onResize={(e, { size }) => {
          e.stopPropagation()
          resize(id, size.width, size.height)
        }}
        onResizeStop={(e, { size }) => {
          e.stopPropagation()
          resize(id, size.width, size.height)
        }}
        resizeHandles={['se']}
        handle={
          <div className={styles.resizeHandle}>
            <Icons.resize />
          </div>
        }
      >
        <div style={{ width, height }}>{id}</div>
      </ResizableBox>

      <div
        className={styles.dragHandle}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <Icons.handle />
      </div>
    </div>
  )
}
