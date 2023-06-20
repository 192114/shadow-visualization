import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import cn from 'classnames'
import { ResizableBox } from 'react-resizable'

import 'react-resizable/css/styles.css'

import { useEffect, useState } from 'react'

import { useCardListStore } from '~/store'

import styles from './DragItem.module.css'
import Icons from './Icons'

export interface DragItemProps {
  id: string
  top: number
  left: number
  width: number
  height: number
  selected: boolean
}

export default function DragItem(props: DragItemProps) {
  const { id, top, left, width, height, selected } = props
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })
  const resize = useCardListStore((state) => state.resize)

  const [isSelected, setIsSelected] = useState<boolean>(false)

  useEffect(() => {
    setIsSelected(selected)
  }, [selected])

  return (
    <div
      className={cn(styles.container, { [styles.selected]: isSelected })}
      style={{
        width,
        height,
        transform: CSS.Translate.toString(transform),
        top,
        left,
      }}
      data-width={`${width}px`}
      data-height={`${height}px`}
    >
      <ResizableBox
        width={width}
        height={height}
        minConstraints={[100, 100]}
        onResize={(e, { size }) => {
          e.stopPropagation()
          resize(id, size.width, size.height)
          // resize 时候 显示尺寸标记
          setIsSelected(true)
        }}
        onResizeStop={(e, { size }) => {
          e.stopPropagation()
          resize(id, size.width, size.height)
          // 完成时 恢复初始值
          setIsSelected(selected)
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
