import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { InputNumber, Popover, Space, Tag } from 'antd'
import { useHotkeys } from 'react-hotkeys-hook'

import Icons from '~/components/Icons'
import {
  useDragPanelStore,
  useDragToolsStore,
  usePanelGridStore,
} from '~/store'

import styles from './PanelTools.module.css'

interface PanelToolsProps {
  scrollParent: HTMLDivElement | null
}

export function PanelTools({ scrollParent }: PanelToolsProps) {
  const { x, y, isShow } = useDragToolsStore()
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

  // 绑定快捷键
  // 向右gap
  useHotkeys(
    'ctrl+R',
    () => {
      scrollHorizontalStep(gap)
    },
    [scrollParent]
  )
  // 向左gap
  useHotkeys(
    'ctrl+L',
    () => {
      scrollHorizontalStep(-gap)
    },
    [scrollParent]
  )
  // 右边界
  useHotkeys(
    'ctrl+shift+R',
    () => {
      const maxX = width - (scrollParent?.clientWidth ?? 0) + 30
      scrollHorizontal(maxX)
    },
    [scrollParent]
  )
  // 向左gap
  useHotkeys(
    'ctrl+shift+L',
    () => {
      scrollHorizontal(0)
    },
    [scrollParent]
  )
  // 显示隐藏网格
  useHotkeys(
    'ctrl+G',
    () => {
      toggleShow()
    },
    [scrollParent]
  )

  const content = (
    <Space direction="vertical" style={{ width: 200 }}>
      <div className="flex items-center justify-between">
        <span>移动到左边界</span>
        <Tag>Ctrl Shift L</Tag>
      </div>
      <div className="flex items-center justify-between">
        <span>向左移动</span>
        <Tag>Ctrl L</Tag>
      </div>
      <div className="flex items-center justify-between">
        <span>显示/隐藏网格</span>
        <Tag>Ctrl G</Tag>
      </div>
      <div className="flex items-center justify-between">
        <span>向右移动</span>
        <Tag>Ctrl R</Tag>
      </div>
      <div className="flex items-center justify-between">
        <span>移动右边界</span>
        <Tag>Ctrl Shift R</Tag>
      </div>
    </Space>
  )

  if (!isShow) {
    return null
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
          const maxX = width - (scrollParent?.clientWidth ?? 0) + 30
          scrollHorizontal(maxX)
        }}
      >
        <Icons.arrowRightToLine size={18} />
      </div>

      <Popover content={content} title="快捷键">
        <div className={styles.item} title="快捷键">
          <Icons.keyboard size={18} />
        </div>
      </Popover>

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
