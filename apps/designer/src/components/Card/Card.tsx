import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import cn from 'classnames'
import { ResizableBox } from 'react-resizable'

import 'react-resizable/css/styles.css'

import { useEffect, useState } from 'react'
import Decimal from 'decimal.js-light'

import Icons from '~/components/Icons'
import { useCardListStore, useDragPanelStore } from '~/store'

import styles from './Card.module.css'

export interface CardProps {
  id: string
  top: number
  left: number
  width: number
  height: number
  selected: boolean
}

export function Card(props: CardProps) {
  const { id, top, left, width, height, selected } = props
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      from: 'card',
    },
  })
  const resize = useCardListStore((state) => state.resize)
  const { width: panelWidth, height: panelHeight } = useDragPanelStore()

  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [maxConstraintsState, setMaxConstraintsState] = useState<
    [number, number] | undefined
  >()

  useEffect(() => {
    setIsSelected(selected)
  }, [selected])

  useEffect(() => {
    if (
      panelWidth !== undefined &&
      panelHeight !== undefined &&
      top !== undefined &&
      left !== undefined
    ) {
      const maxW = new Decimal(panelWidth).minus(left).toNumber()
      const maxH = new Decimal(panelHeight).minus(top).toNumber()
      setMaxConstraintsState([maxW, maxH])
    } else {
      setMaxConstraintsState(undefined)
    }
  }, [panelWidth, panelHeight, top, left])

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
      data-target="card-item"
      id={`card-item-${id}`}
    >
      <ResizableBox
        width={width}
        height={height}
        minConstraints={[100, 100]}
        maxConstraints={maxConstraintsState}
        onResize={(e, { size }) => {
          e.stopPropagation()
          resize(id, size.width, size.height)
          // resize 时候 显示尺寸标记
          setIsSelected(true)
        }}
        onResizeStop={(e, { size }) => {
          e.stopPropagation()
          const width = Math.round(size.width)
          const height = Math.round(size.height)
          resize(id, width, height)
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
