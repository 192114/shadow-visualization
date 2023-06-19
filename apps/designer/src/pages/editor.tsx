import { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import type { Coordinates } from '@dnd-kit/utilities'

import DragItem from '~/components/DragItem'
import Header from '~/components/Header'
import RightConfig from '~/components/RightConfig'

const defaultCoordinates = {
  x: 0,
  y: 0,
  deltaX: 0,
  deltaY: 0,
}

export default function Editor() {
  const [{ x, y }, setCoordinates] = useState<Coordinates>(defaultCoordinates)

  return (
    <div className="full-screen">
      <Header></Header>

      <div className="main-content">
        {/* left tools */}
        <div className="template-list">1</div>
        {/* middle view */}
        <div className="drag-view">
          <DndContext
            onDragEnd={({ delta }) => {
              setCoordinates(({ x, y }) => {
                return {
                  x: x + delta.x,
                  y: y + delta.y,
                }
              })
            }}
          >
            <DragItem id="kkk" top={y} left={x} />
          </DndContext>
        </div>
        {/* right config */}
        <RightConfig />
      </div>
    </div>
  )
}
