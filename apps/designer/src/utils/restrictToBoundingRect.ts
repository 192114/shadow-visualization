import type { ClientRect } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'

export function restrictToBoundingRect(
  transform: Transform,
  rect: ClientRect,
  boundingRect: ClientRect
): Transform {
  const value = {
    ...transform,
  }

  if (rect.top + transform.y <= boundingRect.top) {
    value.y = boundingRect.top - rect.top
  } else if (
    rect.bottom + transform.y >=
    boundingRect.top + boundingRect.height
  ) {
    value.y = boundingRect.top + boundingRect.height - rect.bottom
  }

  if (rect.left + transform.x <= boundingRect.left) {
    value.x = boundingRect.left - rect.left
  } else if (
    rect.right + transform.x >=
    boundingRect.left + boundingRect.width
  ) {
    value.x = boundingRect.left + boundingRect.width - rect.right
  }

  return value
}

// https://github.com/clauderic/dnd-kit/blob/master/packages/modifiers/src/restrictToParentElement.ts
// 自定义modifier
/**
 *
 * @param containerNodeRect 拖拽视口 rect -> 取的droppable
 * @param targetNodeRect 拖拽目标 rect -> 把手的父元素
 * @param transform modifier 返回的transform
 * @returns
 */
export function restrictToContainerRect(
  containerNodeRect: ClientRect | null,
  targetNodeRect: ClientRect | null,
  transform: Transform
): Transform {
  if (!containerNodeRect || !targetNodeRect) {
    return transform
  }
  return restrictToBoundingRect(transform, targetNodeRect, containerNodeRect)
}
