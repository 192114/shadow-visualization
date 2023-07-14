import { useEffect, useRef } from 'react'
import { DndContext } from '@dnd-kit/core'
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
  // useTemplateListStore,
} from '~/store'
import { restrictToContainerRect } from '~/utils'

export default function Editor() {
  const { cardList, changeCoordinates } = useCardListStore()
  const { width, height, backgroundColor, setPanelState } = useDragPanelStore()
  const { toggleShow, isShow } = useDragToolsStore()
  const { setAll, schemaConfig } = useCurrentSchema()
  // const { templateList} = useTemplateListStore()
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
          modifiers={[restrictToWindowEdges]}
          onDragStart={(e) => {
            // const {active} = e
          }}
          onDragEnd={(e) => {
            const { active, over } = e
            console.log(over)
            if (over) {
              // do stuff
              console.log(e)

              updateWrapperKey()
            }
          }}
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
