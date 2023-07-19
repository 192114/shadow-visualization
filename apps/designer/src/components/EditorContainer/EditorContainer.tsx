import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { DndContext } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import SimpleBar from 'simplebar-react'

import DropArea from '~/components/DropArea'
import PanelTools from '~/components/PanelTools'
import RulerComponent, { type RulerHandle } from '~/components/Ruler'
import {
  useConfigPanelStore,
  useDragToolsStore,
  usePanelGridStore,
} from '~/store'

import styles from './EditorContainer.module.css'

import 'simplebar-react/dist/simplebar.min.css'

interface EditorWrapperProps {
  width: number
  height: number
}

interface EditorProps {
  children: JSX.Element
  wrapper: EditorWrapperProps
}

export function EditorContainer(props: EditorProps) {
  const { wrapper, children } = props

  const { changeCoordinates } = useDragToolsStore()
  const { isShow, gap } = usePanelGridStore()

  const leftRuler = useRef<RulerHandle | null>(null)
  const topRuler = useRef<RulerHandle | null>(null)
  const panel = useRef<HTMLDivElement | null>(null)
  const [parentScrollDom, setParentScrollDom] = useState<HTMLDivElement | null>(
    null
  )

  const configPanelOpen = useConfigPanelStore((state) => state.open)

  useEffect(() => {
    const scrollHandle = (e: Event) => {
      const { scrollLeft, scrollTop } = e.currentTarget as HTMLDivElement
      leftRuler.current?.scroll(scrollTop)
      topRuler.current?.scroll(scrollLeft)
    }

    const scrollDom = panel.current

    scrollDom?.addEventListener('scroll', scrollHandle)

    return () => {
      scrollDom?.removeEventListener('scroll', scrollHandle)
    }
  }, [])

  useEffect(() => {
    leftRuler.current?.resize()
    topRuler.current?.resize()
  }, [configPanelOpen])

  useEffect(() => {
    setParentScrollDom(panel.current)
  }, [])

  return (
    <div className={styles.container}>
      <RulerComponent pos="top" ref={topRuler} />
      <RulerComponent pos="left" ref={leftRuler} />
      {/* 左侧模版栏 拖拽的drop区域 */}
      <SimpleBar
        scrollableNodeProps={{ ref: panel }}
        autoHide={false}
        className={styles.scroll}
      >
        <DropArea
          id="card-drop"
          style={{ width: wrapper.width, height: wrapper.height }}
        >
          <div className={styles.editor}>
            {children}

            {isShow && (
              <div
                className={styles.gridBox}
                style={{ '--grid-gap': `${gap}px` } as CSSProperties}
              />
            )}
          </div>
        </DropArea>
      </SimpleBar>

      {/* 拖拽工具栏 */}
      <DndContext
        modifiers={[restrictToWindowEdges]}
        onDragEnd={({ delta }) => {
          changeCoordinates(Math.round(delta.x), Math.round(delta.y))
        }}
      >
        <PanelTools scrollParent={parentScrollDom} />
      </DndContext>
    </div>
  )
}
