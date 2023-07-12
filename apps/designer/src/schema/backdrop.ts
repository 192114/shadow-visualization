import type { IBackdrop } from '@schema/types'

export const backdropSchema: IBackdrop = {
  type: 'backdrop',
  schema: {
    container: [
      {
        type: 'input',
        name: 'pageName',
        label: '名称',
      },
      {
        type: 'inputNumber',
        name: 'width',
        label: '宽度',
      },
      {
        type: 'radio',
        name: 'ratio',
        label: '比例',
        help: '宽高比',
        direction: 'horizontal',
        options: [
          {
            label: '16:9',
            value: '16/9',
          },
          {
            label: '4:3',
            value: '4/3',
          },
        ],
      },
      {
        type: 'color',
        name: 'backgroundColor',
        label: '背景色',
      },
    ],
  },
  config: {
    width: 1280,
    pageName: '页面名称',
    ratio: '16/9',
    backgroundColor: '#151b36',
  },
}
