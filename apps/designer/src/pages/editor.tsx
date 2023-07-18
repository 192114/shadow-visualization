import { useEffect, useRef } from 'react'
import { DndContext, MeasuringStrategy } from '@dnd-kit/core'
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers'
// import { lineSchema } from '@shared/ui'
import { useDeepCompareEffect } from 'ahooks'
import { Button, Popover, Space, Switch } from 'antd'

import Card from '~/components/Card'
import DropArea from '~/components/DropArea'
import EditorContainer from '~/components/EditorContainer'
import Header from '~/components/Header'
import Icons from '~/components/Icons'
import RightConfig from '~/components/RightConfig'
import TemplateList from '~/components/TemplateList'
import { backdropSchema } from '~/schema'
import {
  useCardListStore,
  useCurrentSchema,
  useDragPanelStore,
  useDragToolsStore,
  useTemplateKeyStore,
  useTemplateListStore,
} from '~/store'
import { collisionDetectionStrategy, restrictToContainerRect } from '~/utils'

export default function Editor() {
  const {
    cardList,
    changeCoordinates,
    setCoordinates,
    add: addCard,
    remove: removeCard,
    updateKey: updateCardKey,
  } = useCardListStore()
  const { width, height, backgroundColor, setPanelState } = useDragPanelStore()
  const { toggleShow, isShow } = useDragToolsStore()
  const { setAll, schemaConfig } = useCurrentSchema()
  const { setCurrentTemplateAndType, resetCurrentTemplateAndType } =
    useTemplateListStore()
  const updateWrapperKey = useTemplateKeyStore(
    (state) => state.updateWrapperKey
  )

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

  function handleDragCancel() {
    resetCurrentTemplateAndType()
  }

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
        <DndContext
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
          collisionDetection={collisionDetectionStrategy}
          modifiers={[restrictToWindowEdges]}
          onDragStart={(e) => {
            const { active } = e
            setCurrentTemplateAndType(active.data.current?.type)
          }}
          onDragOver={(e) => {
            const { active, over } = e

            // 如果拖拽到drop区域，cardlist 中添加一个新的card
            if (over) {
              // 添加临时块显示位置
              // console.log(active.rect.current, over.rect)
              const { left: wrapperLeft, top: wrapperTop } = over.rect
              const {
                left: targetLeft = 0,
                top: targetTop = 0,
                width: targetWidth = 100,
                height: targetHeight = 100,
              } = active.rect.current.translated ?? {}

              const tempLeft = targetLeft - wrapperLeft
              const tempTop = targetTop - wrapperTop

              const initialLeft = tempLeft > 0 ? tempLeft : 0
              const initialTop = tempTop > 0 ? tempTop : 0

              addCard('temporary-card', {
                x: initialLeft,
                y: initialTop,
                width: targetWidth,
                height: targetHeight,
              })
            } else {
              // 移除临时的元素
              removeCard('temporary-card')
            }
          }}
          onDragMove={(e) => {
            // console.log(e)
            const { over, active } = e
            if (over) {
              const { left: targetLeft = 0, top: targetTop = 0 } =
                active.rect.current.translated ?? {}
              const { left: wrapperLeft, top: wrapperTop } = over.rect
              const tempLeft = targetLeft - wrapperLeft
              const tempTop = targetTop - wrapperTop

              const initialLeft = tempLeft > 0 ? tempLeft : 0
              const initialTop = tempTop > 0 ? tempTop : 0
              setCoordinates('temporary-card', initialLeft, initialTop)
            }
          }}
          onDragEnd={(e) => {
            const { over } = e
            // console.log(active)
            if (over) {
              updateWrapperKey()
              updateCardKey('temporary-card')
              handleDragCancel()
            } else {
              handleDragCancel()
            }
          }}
          onDragCancel={handleDragCancel}
        >
          {/* left template */}
          <div className="template-list">
            <TemplateList />
          </div>
          {/* middle view */}
          <div className="drag-view">
            <EditorContainer wrapper={{ width, height }}>
              {/* 主屏幕拖拽层 */}
              <DndContext
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
          </div>
        </DndContext>
        {/* right config */}
        <RightConfig />
      </div>
    </div>
  )
}
