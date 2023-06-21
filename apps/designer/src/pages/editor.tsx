import { DndContext, useDroppable } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'

import DragItem from '~/components/DragItem'
import EditorContainer from '~/components/EditorContainer'
import Header from '~/components/Header'
import RightConfig from '~/components/RightConfig'
import { useCardListStore } from '~/store'
import { restrictToContainerRect } from '~/utils'

export default function Editor() {
  const { cardList, changeCoordinates } = useCardListStore()

  const { setNodeRef, node } = useDroppable({
    id: 'editor-drop',
  })

  return (
    <div className="full-screen">
      <Header></Header>

      <div className="main-content">
        {/* left tools */}
        <div className="template-list">1</div>
        {/* middle view */}
        <div className="drag-view">
          <EditorContainer wrapper={{ width: 1280, ratio: 9 / 16 }}>
            <DndContext
              onDragEnd={({ delta, active }) => {
                changeCoordinates(`${active.id}`, delta.x, delta.y)
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
              <div ref={setNodeRef} style={{ width: '100%', height: '100%' }}>
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
          </EditorContainer>
        </div>
        {/* right config */}
        <RightConfig />
      </div>
    </div>
  )
}
