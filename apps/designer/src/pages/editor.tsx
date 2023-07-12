import { useEffect } from 'react'
import { DndContext, useDroppable } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import { lineSchema } from '@shared/ui'
import { useDeepCompareEffect } from 'ahooks'
import { Button, Popover, Space, Switch } from 'antd'

import DragItem from '~/components/DragItem'
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
} from '~/store'
import { restrictToContainerRect } from '~/utils'

export default function Editor() {
  const { cardList, changeCoordinates } = useCardListStore()
  const { width, height, backgroundColor, setPanelState } = useDragPanelStore()
  const { toggleShow, isShow } = useDragToolsStore()
  const { setAll, schemaConfig } = useCurrentSchema()
  const { setNodeRef, node } = useDroppable({
    id: 'editor-drop',
    data: {
      accepts: ['template1'],
    },
  })
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
          onDragEnd={(e) => {
            const { active, over } = e
            console.log(e)
            if (
              over &&
              over.data.current?.accepts.includes(active.data.current?.type)
            ) {
              // do stuff
              console.log(e)
            }
          }}
        >
          {/* left tools */}
          <div className="template-list">
            {/* <Button
            type="primary"
            onClick={() => {
              setAll(lineSchema)
            }}
          >
            change right config
          </Button> */}
            <TemplateList />
          </div>
          {/* middle view */}
          <div className="drag-view">
            <EditorContainer wrapper={{ width, height }}>
              <div ref={setNodeRef} style={{ width: '100%', height: '100%' }}>
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
                        node.current?.getBoundingClientRect() ?? null,
                        containerNodeRect,
                        transform
                      ),
                    restrictToFirstScrollableAncestor,
                  ]}
                >
                  <div
                    style={{ width: '100%', height: '100%', backgroundColor }}
                  >
                    {cardList.map((cardItem) => {
                      return (
                        <DragItem
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
                  </div>
                </DndContext>
              </div>
            </EditorContainer>
          </div>
        </DndContext>
        {/* right config */}
        <RightConfig />
      </div>
    </div>
  )
}
