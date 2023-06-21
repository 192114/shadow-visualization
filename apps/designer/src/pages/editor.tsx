import { DndContext, useDroppable, type Modifier } from '@dnd-kit/core'

// import { restrictToParentElement } from '@dnd-kit/modifiers'

import DragItem from '~/components/DragItem'
import EditorContianer from '~/components/EditorContianer'
import Header from '~/components/Header'
import RightConfig from '~/components/RightConfig'
import { useCardListStore } from '~/store'

// https://github.com/clauderic/dnd-kit/blob/master/packages/modifiers/src/restrictToParentElement.ts
// function restrictToContainerRect({ containerNodeRect, transform }): Modifier {
//   console.log(containerNodeRect)
//   if (!containerNodeRect) {
//     return transform
//   }
//   return
// }

export default function Editor() {
  const { cardList, changeCoordinates } = useCardListStore()

  const { setNodeRef } = useDroppable({
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
          <EditorContianer wrapper={{ width: 1280, ratio: 9 / 16 }}>
            <DndContext
              onDragEnd={({ delta, active }) => {
                changeCoordinates(`${active.id}`, delta.x, delta.y)
              }}
              // modifiers={[restrictToContainerRect]}
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
          </EditorContianer>
        </div>
        {/* right config */}
        <RightConfig />
      </div>
    </div>
  )
}
