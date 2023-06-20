import { DndContext } from '@dnd-kit/core'

import DragItem from '~/components/DragItem'
import Header from '~/components/Header'
import RightConfig from '~/components/RightConfig'
import { useCardListStore } from '~/store'

export default function Editor() {
  const { cardList, changeCoordinates } = useCardListStore()

  return (
    <div className="full-screen">
      <Header></Header>

      <div className="main-content">
        {/* left tools */}
        <div className="template-list">1</div>
        {/* middle view */}
        <div className="drag-view" style={{ position: 'relative' }}>
          <DndContext
            onDragEnd={({ delta, active }) => {
              changeCoordinates(`${active.id}`, delta.x, delta.y)
            }}
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
                />
              )
            })}
          </DndContext>
        </div>
        {/* right config */}
        <RightConfig />
      </div>
    </div>
  )
}
