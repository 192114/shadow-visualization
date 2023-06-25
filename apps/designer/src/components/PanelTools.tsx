import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { InputNumber } from 'antd'

import {
  useDragPanelStore,
  useDragToolsStore,
  usePanelGridStore,
} from '~/store'

import Icons from './Icons'
import styles from './PanelTools.module.css'

interface PanelToolsProps {
  scrollParent: HTMLDivElement | null
}

export default function PanelTools({ scrollParent }: PanelToolsProps) {
  const { x, y } = useDragToolsStore()
  const { width } = useDragPanelStore()
  const { toggleShow, gap, changeGap } = usePanelGridStore()
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'panel-tools',
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    top: y,
    left: x,
  }

  function scrollHorizontal(targetX = 0, targetY = 0) {
    if (scrollParent) {
      scrollParent.scroll({
        top: targetY,
        left: targetX,
        behavior: 'smooth',
      })
    }
  }

  function scrollHorizontalStep(deltaX = 0, deltaY = 0) {
    if (scrollParent) {
      scrollParent.scrollBy({
        top: deltaY,
        left: deltaX,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div style={style} className={styles.container}>
      <div
        className={styles.item}
        title="左边界"
        onClick={() => {
          scrollHorizontal(0)
        }}
      >
        <Icons.arrowLeftToLine size={18} />
      </div>
      <div
        className={styles.item}
        title="向左滚动"
        onClick={() => {
          scrollHorizontalStep(-gap)
        }}
      >
        <Icons.leftArrow size={18} />
      </div>
      <div
        className={styles.item}
        title="显示网格"
        onClick={() => {
          toggleShow()
        }}
      >
        <Icons.grid size={18} />
      </div>
      <div title="网格间距">
        <InputNumber
          value={gap}
          onChange={(val) => changeGap(val ?? 50)}
          min={10}
          step={10}
          style={{ width: 60 }}
        />
      </div>
      <div
        className={styles.item}
        title="向右滚动"
        onClick={() => {
          scrollHorizontalStep(gap)
        }}
      >
        <Icons.rightArrow size={18} />
      </div>
      <div
        className={styles.item}
        title="右边界"
        onClick={() => {
          const maxX = width - (scrollParent?.offsetWidth ?? 0)
          scrollHorizontal(maxX)
        }}
      >
        <Icons.arrowRightToLine size={18} />
      </div>

      <div
        className={styles.item}
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={{ cursor: 'grab' }}
      >
        <Icons.handle size={18} />
      </div>
    </div>
  )
}
