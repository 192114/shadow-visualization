interface Layout {
  x: number
  y: number
  width: number
  height: number
  id: string
}

interface YLineType {
  lineTop: number
  triggerTop: number
}

interface XLineType {
  lineLeft: number
  triggerLeft: number
}

interface MapYItemType {
  name: string
  calc: (compare: Layout, target: Layout) => YLineType
}

interface MapXItemType {
  name: string
  calc: (compare: Layout, target: Layout) => XLineType
}

interface DirectionsMapType {
  x: MapXItemType[]
  y: MapYItemType[]
}

// 计算目标坐标
const directionsMapForDrag: DirectionsMapType = {
  y: [
    {
      name: '顶对顶',
      calc: (compare) => ({
        lineTop: compare.y,
        triggerTop: compare.y,
      }),
    },
    {
      name: '底对顶',
      calc: (compare, target) => ({
        lineTop: compare.y,
        triggerTop: compare.y - target.height,
      }),
    },
    {
      name: '中对中',
      calc: (compare, target) => ({
        lineTop: compare.y + compare.height / 2,
        triggerTop: compare.y + compare.height / 2 - target.height / 2,
      }),
    },
    {
      name: '顶对底',
      calc: (compare) => ({
        lineTop: compare.y + compare.height,
        triggerTop: compare.y + compare.height,
      }),
    },
    {
      name: '底对底',
      calc: (compare, target) => ({
        lineTop: compare.y + compare.height,
        triggerTop: compare.y + compare.height - target.height,
      }),
    },
  ],
  x: [
    {
      name: '左对左',
      calc: (compare) => ({
        lineLeft: compare.x,
        triggerLeft: compare.x,
      }),
    },
    {
      name: '左对右',
      calc: (compare) => ({
        lineLeft: compare.x + compare.width,
        triggerLeft: compare.x + compare.width,
      }),
    },
    {
      name: '中对中',
      calc: (compare, target) => ({
        lineLeft: compare.x + compare.width / 2,
        triggerLeft: compare.x + compare.width / 2 - target.width / 2,
      }),
    },
    {
      name: '右对右',
      calc: (compare, target) => ({
        lineLeft: compare.x + compare.width,
        triggerLeft: compare.x + compare.width - target.width,
      }),
    },
    {
      name: '右对左',
      calc: (compare, target) => ({
        lineLeft: compare.x,
        triggerLeft: compare.x - target.width,
      }),
    },
  ],
}

// 计算目标的宽高
const directionsMapForResize: DirectionsMapType = {
  y: [
    {
      name: '底对底',
      calc: (compare, target) => ({
        lineTop: compare.y + compare.height,
        triggerTop: compare.y + compare.height - target.y,
      }),
    },
    {
      name: '底对顶',
      calc: (compare, target) => ({
        lineTop: compare.y,
        triggerTop: compare.y - target.y,
      }),
    },
  ],
  x: [
    {
      name: '右对右',
      calc: (compare, target) => ({
        lineLeft: compare.x + compare.width,
        triggerLeft: compare.x + compare.width - target.x,
      }),
    },
    {
      name: '右对左',
      calc: (compare, target) => ({
        lineLeft: compare.x,
        triggerLeft: compare.x - target.x,
      }),
    },
  ],
}

// threshold为临界阀值 默认5
const threshold = 5

const linePos: { x?: number | null; y?: number | null } = {}

let timer: number | null = null

const removeAll = () => {
  // 删除所有辅助线
  const allLinesDom = document.querySelectorAll('.auxiliary-line')
  const domList = Array.from(allLinesDom)
  for (let i = 0; i < domList.length; i++) {
    const element = domList[i]
    element.remove()
  }
}

// 创建辅助线 并添加到目标内
const createLine = (
  direction: 'vertical' | 'horizontal',
  pos: number,
  dom: HTMLDivElement | null
) => {
  const div = document.createElement('div')

  const baseStyleStr =
    'background-color: rgba(255, 255, 255, 0.5); position: absolute; z-index: 99999'

  let styleStr = ''

  if (direction === 'vertical') {
    styleStr = `${baseStyleStr};width: 1px; height: 100%;left: ${pos}px; top: 0px;`
  } else {
    styleStr = `${baseStyleStr};height: 1px; width: 100%;top: ${pos}px; left: 0px;`
  }

  div.setAttribute('style', styleStr)
  div.setAttribute('class', 'auxiliary-line')
  dom?.appendChild(div)
}

// 获取配置的需要的线
const getAllLine = (
  directionsMap: DirectionsMapType,
  compares: Layout[],
  target: Layout
) => {
  const lines: { y: YLineType[]; x: XLineType[] } = {
    y: [],
    x: [],
  }

  for (let i = 0; i < compares.length; i++) {
    // 和其他所有参考物遍历
    const compare = compares[i]
    directionsMap.y.forEach((item) => {
      // 构造横辅助线数据
      lines.y.push(item.calc(compare, target))
    })
    directionsMap.x.forEach((item) => {
      // 构造竖辅助线数据
      lines.x.push(item.calc(compare, target))
    })
  }

  return lines
}

// 拖拽时获取辅助线信息
const getLineForDrag = (
  lines: { y: YLineType[]; x: XLineType[] },
  target: Layout
) => {
  let { x, y } = target
  let yLine = null
  let xLine = null

  for (let i = 0; i < lines.y.length; i++) {
    const { triggerTop, lineTop } = lines.y[i]
    if (Math.abs(y - triggerTop) < threshold) {
      // 满足竖辅助线出现条件 为xLine赋值
      yLine = lineTop
      // 实现吸附效果
      y = triggerTop
      break
    }
  }
  for (let j = 0; j < lines.x.length; j++) {
    const { triggerLeft, lineLeft } = lines.x[j]
    if (Math.abs(x - triggerLeft) < threshold) {
      // 满足竖辅助线出现条件 为xLine赋值
      xLine = lineLeft
      // 实现吸附效果
      x = triggerLeft
      break
    }
  }

  if (yLine !== linePos.y || xLine !== linePos.x) {
    // 需要展示的横、竖辅助线
    linePos.y = yLine
    linePos.x = xLine
  }

  return { xLine, yLine, x, y }
}

const getLineForResize = (
  lines: { y: YLineType[]; x: XLineType[] },
  target: Layout
) => {
  let { width, height } = target
  let yLine = null
  let xLine = null

  for (let i = 0; i < lines.y.length; i++) {
    const { triggerTop, lineTop } = lines.y[i]
    if (Math.abs(height - triggerTop) < threshold) {
      // 满足竖辅助线出现条件 为xLine赋值
      yLine = lineTop
      // 实现吸附效果
      height = triggerTop
      break
    }
  }
  for (let j = 0; j < lines.x.length; j++) {
    const { triggerLeft, lineLeft } = lines.x[j]
    if (Math.abs(width - triggerLeft) < threshold) {
      // 满足竖辅助线出现条件 为xLine赋值
      xLine = lineLeft
      // 实现吸附效果
      width = triggerLeft
      break
    }
  }

  if (yLine !== linePos.y || xLine !== linePos.x) {
    // 需要展示的横、竖辅助线
    linePos.y = yLine
    linePos.x = xLine
  }

  return { xLine, yLine, width, height }
}

interface OptionsType {
  baseX: number
  baseY: number
  actionType: 'resize' | 'drag'
}

export function calcLines(
  target: Layout,
  all: Layout[],
  containerDom: HTMLDivElement | null,
  options: OptionsType
) {
  const { baseX = 0, baseY = 0, actionType = 'drag' } = options

  // 排除自己
  const compares = all.filter((allItem) => allItem.id !== target.id)

  if (compares.length === 0) {
    return null
  }

  let directionsMap = directionsMapForDrag

  if (actionType === 'resize') {
    directionsMap = directionsMapForResize
  }

  const lines: { y: YLineType[]; x: XLineType[] } = getAllLine(
    directionsMap,
    compares,
    target
  )

  removeAll()

  if (actionType === 'drag') {
    const { x, y, xLine, yLine } = getLineForDrag(lines, target)
    if (xLine !== null) {
      createLine('vertical', xLine + baseX, containerDom)
    }

    if (yLine !== null) {
      createLine('horizontal', yLine + baseY, containerDom)
    }

    // timer && clearTimeout(timer)
    // timer = window.setTimeout(removeAll, 500)

    return { x, y }
  } else if (actionType === 'resize') {
    const { width, height, xLine, yLine } = getLineForResize(lines, target)
    if (xLine !== null) {
      createLine('vertical', xLine + baseX, containerDom)
    }

    if (yLine !== null) {
      createLine('horizontal', yLine + baseY, containerDom)
    }

    timer && clearTimeout(timer)
    timer = window.setTimeout(removeAll, 500)

    return { width, height }
  }
}
