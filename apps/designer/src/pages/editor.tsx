import { useEffect, useRef } from 'react'
import {
  DndContext,
  MeasuringStrategy,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
} from '@dnd-kit/core'
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
import { restrictToContainerRect } from '~/utils'

export default function Editor() {
  const { cardList, changeCoordinates, add: addCard } = useCardListStore()
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

  const collisionDetectionStrategy: CollisionDetection = function (args) {
    // console.log(args)
    // const pointerIntersections = pointerWithin(args)
    // console.log(pointerIntersections)

    // return rectIntersection(args)
    // const a=  pointerWithin(args)
    // console.log(a)

    const { droppableContainers, droppableRects, pointerCoordinates, active } =
      args

    if (!pointerCoordinates) {
      return []
    }

    const collisions: CollisionDescriptor[] = []

    for (const droppableContainer of droppableContainers) {
      const { id } = droppableContainer
      const rect = droppableRects.get(id)
      const targetActiveTranslated = active.rect.current.translated

      if (rect && targetActiveTranslated) {
        const { x: pointerX, y: pointerY } = pointerCoordinates
        const { top, left, bottom, right } = rect
        const { width, height } = targetActiveTranslated

        console.log(pointerCoordinates, rect, active.rect.current)

        const isInDropAreaX = pointerX >= left && pointerX <= right - width
        const isInDropAreaY = pointerY >= top && pointerY <= bottom - height

        if (isInDropAreaX && isInDropAreaY) {
          return []
        }
      }
    }

    return []
  }

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
              console.log(active.rect.current, over.rect)
              const { left: wrapperLeft, top: wrapperTop } = over.rect
              const { left: targetLeft = 0, top: targetTop = 0 } =
                active.rect.current.translated ?? {}

              const tempLeft = targetLeft - wrapperLeft
              const tempTop = targetTop - wrapperTop

              const initialLeft = tempLeft > 0 ? tempLeft : 0
              const initialTop = tempTop > 0 ? tempTop : 0

              addCard('temporary-card', {
                x: initialLeft,
                y: initialTop,
                width: 200,
                height: 200,
              })
            } else {
              // 移除临时的元素
            }
          }}
          onDragEnd={(e) => {
            const { active, over } = e
            // console.log(over)
            if (over) {
              // do stuff
              // console.log(e)

              updateWrapperKey()
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
