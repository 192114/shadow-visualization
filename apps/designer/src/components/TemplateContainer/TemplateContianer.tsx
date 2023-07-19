import { DndContext, MeasuringStrategy } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'

import RightConfig from '~/components/RightConfig'
import TemplateList from '~/components/TemplateList'
import {
  useCardListStore,
  useTemplateKeyStore,
  useTemplateListStore,
} from '~/store'
import { collisionDetectionStrategy } from '~/utils'

import styles from './TemplateContainer.module.css'

export interface Props {
  children: React.ReactNode
}

export function TemplateContainer({ children }: Props) {
  const {
    setCoordinates,
    add: addCard,
    remove: removeCard,
    updateKey: updateCardKey,
  } = useCardListStore()

  const { setCurrentTemplateAndType, resetCurrentTemplateAndType } =
    useTemplateListStore()
  const updateWrapperKey = useTemplateKeyStore(
    (state) => state.updateWrapperKey
  )

  function handleDragCancel() {
    resetCurrentTemplateAndType()
  }
  return (
    <>
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
        {/* 模板列表 */}
        <div className={styles.left}>
          <TemplateList />
        </div>

        <div className={styles.editor}>{children}</div>
      </DndContext>

      <RightConfig />
    </>
  )
}
