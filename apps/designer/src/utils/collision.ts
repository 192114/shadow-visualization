import type {
  ClientRect,
  CollisionDescriptor,
  CollisionDetection,
} from '@dnd-kit/core'

/**
 * Returns the intersecting rectangle area between two rectangles
 */
export function getIntersectionRatio(
  entry: ClientRect,
  target: ClientRect
): number {
  const top = Math.max(target.top, entry.top)
  const left = Math.max(target.left, entry.left)
  const right = Math.min(target.left + target.width, entry.left + entry.width)
  const bottom = Math.min(target.top + target.height, entry.top + entry.height)
  const width = right - left
  const height = bottom - top

  if (left < right && top < bottom) {
    const targetArea = target.width * target.height
    const entryArea = entry.width * entry.height
    const intersectionArea = width * height
    const intersectionRatio =
      intersectionArea / (targetArea + entryArea - intersectionArea)

    return Number(intersectionRatio.toFixed(4))
  }

  // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)
  return 0
}

export function sortCollisionsDesc(
  { data: { value: a } }: CollisionDescriptor,
  { data: { value: b } }: CollisionDescriptor
) {
  return b - a
}

export const collisionDetectionStrategy: CollisionDetection = function (args) {
  const { droppableContainers, droppableRects, collisionRect } = args

  if (!collisionRect) {
    return []
  }

  const collisions: CollisionDescriptor[] = []

  for (const droppableContainer of droppableContainers) {
    const { id } = droppableContainer
    const rect = droppableRects.get(id)

    if (rect) {
      const {
        top: dropTop,
        left: dropLeft,
        bottom: dropBottom,
        right: dropRight,
      } = rect
      const {
        top: dragTop,
        left: dragLeft,
        bottom: dragBottom,
        right: dragRight,
      } = collisionRect

      const isInDropAreaX = dragLeft >= dropLeft && dragRight <= dropRight
      const isInDropAreaY = dragTop >= dropTop && dragBottom <= dropBottom

      if (isInDropAreaX && isInDropAreaY) {
        const intersectionRatio = getIntersectionRatio(rect, collisionRect)

        if (intersectionRatio > 0) {
          collisions.push({
            id,
            data: { droppableContainer, value: intersectionRatio },
          })
        }
      }
    }
  }

  return collisions.sort(sortCollisionsDesc)
}
