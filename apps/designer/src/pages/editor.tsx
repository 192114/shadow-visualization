import { useEffect, useRef } from 'react'
import { DndContext } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
// import { lineSchema } from '@shared/ui'
import { useDeepCompareEffect } from 'ahooks'
import { Button, Popover, Space, Switch } from 'antd'

import Card from '~/components/Card'
import DropArea from '~/components/DropArea'
import EditorContainer from '~/components/EditorContainer'
import Header from '~/components/Header'
import Icons from '~/components/Icons'
import TemplateContainer from '~/components/TemplateContainer'
import { backdropSchema } from '~/schema'
import {
  useCardListStore,
  useCurrentSchema,
  useDragPanelStore,
  useDragToolsStore,
} from '~/store'
import { calcLines, restrictToContainerRect } from '~/utils'

export default function Editor() {
  const { cardList, changeCoordinates } = useCardListStore()
  const { width, height, backgroundColor, setPanelState } = useDragPanelStore()
  const { toggleShow, isShow } = useDragToolsStore()
  const { setAll, schemaConfig } = useCurrentSchema()

  const dropAreaRef = useRef<HTMLElement | null>(null)

  // 默认选中背景
  useEffect(() => {
    setAll(backdropSchema)
  }, [setAll])

  useDeepCompareEffect(() => {
    if (schemaConfig?.type === 'backdrop') {
      setPanelState(schemaConfig.config)
    }
  }, [schemaConfig])

  const settingsPopoverContent = (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div className="flex item-center justify-between">
        <span>工具栏</span>
        <Switch size="small" checked={isShow} onChange={() => toggleShow()} />
      </div>
    </Space>
  )

  return (
    <div className="full-screen">
      <Header>
        <div className="flex align-items justify-end">
          <Popover content={settingsPopoverContent} title="设置">
            <Button
              type="dashed"
              size="small"
              icon={<Icons.settings size={14} />}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </Popover>
        </div>
      </Header>
      <div className="main-content">
        <TemplateContainer>
          <EditorContainer wrapper={{ width, height }}>
            {/* 主屏幕拖拽层 */}
            <DndContext
              autoScroll={false}
              onDragMove={(e) => {
                const { delta, active } = e
                const activeRect = cardList.find(
                  (item) => item.id === active.id
                )

                // console.log(delta)

                if (delta && activeRect) {
                  const targetRect = {
                    width: activeRect.width,
                    height: activeRect.height,
                    x: activeRect.x + Math.round(delta.x),
                    y: activeRect.y + Math.round(delta.y),
                    id: active.id as string,
                  }

                  // calcLines(
                  //   targetRect,
                  //   cardList,
                  //   document.querySelector('#editor-drop'),
                  //   {
                  //     baseX: 0,
                  //     baseY: 0,
                  //     actionType: 'drag',
                  //   }
                  // )
                  const div = document.createElement('div')
                  div.setAttribute(
                    'style',
                    'position: absolute;width:1px;left:30px;top:0;background-color:#000'
                  )
                  document.body.appendChild(div)
                }
              }}
              onDragEnd={({ delta, active }) => {
                changeCoordinates(
                  `${active.id}`,
                  Math.round(delta.x),
                  Math.round(delta.y)
                )
              }}
              modifiers={[
                ({ transform, containerNodeRect }) =>
                  restrictToContainerRect(
                    dropAreaRef.current?.getBoundingClientRect() ?? null,
                    containerNodeRect,
                    transform
                  ),
                restrictToFirstScrollableAncestor,
              ]}
            >
              {/* 用于限制在drop区域拖拽 */}
              <DropArea
                style={{ width: '100%', height: '100%', backgroundColor }}
                id="editor-drop"
                setRef={(nodeRef) => (dropAreaRef.current = nodeRef)}
              >
                {cardList.map((cardItem) => {
                  return (
                    <Card
                      key={cardItem.id}
                      id={cardItem.id}
                      top={cardItem.y}
                      left={cardItem.x}
                      height={cardItem.height}
                      width={cardItem.width}
                      selected={false}
                    />
                  )
                })}
              </DropArea>
            </DndContext>
          </EditorContainer>
        </TemplateContainer>
      </div>
    </div>
  )
}
