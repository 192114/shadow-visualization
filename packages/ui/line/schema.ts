import type { BasicSchema } from '@schema/types'

export interface LineSchema {
  type: 'line'
  config: {
    width: number
    height: number
    top: number
    left: number
  }
  schema: BasicSchema<LineSchema['config']>
}

export const lineSchema: LineSchema = {
  type: 'line',
  config: {
    width: 200,
    height: 200,
    top: 0,
    left: 0,
  },
  schema: {
    basic: [
      {
        type: 'inputNumber',
        name: 'width',
        label: '宽度',
        min: 200,
      },
      {
        type: 'inputNumber',
        name: 'height',
        label: '高度',
        min: 200,
      },
      {
        type: 'inputNumber',
        name: 'top',
        label: '上边距',
        min: 0,
      },
      {
        type: 'inputNumber',
        name: 'left',
        label: '左边距',
        min: 0,
      },
    ],
  },
}
