import type { IBackdrop } from '@schema/types'

export const backdropSchema: IBackdrop = {
  type: 'backdrop',
  schema: {
    action: [
      {
        isCollapse: true,
        name: '类别1',
        schemaList: [
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
        ],
      },
      {
        isCollapse: true,
        name: '类别2',
        schemaList: [
          {
            type: 'select',
            name: 'ratio',
            label: '名称',
            options: [
              {
                label: '16 / 9',
                value: '16 / 9',
              },
            ],
          },
          {
            type: 'color',
            name: 'backgroundColor',
            label: '宽度',
          },
        ],
      },
    ],
    basic: [
      {
        type: 'inputNumber',
        name: 'width',
        label: '宽度',
      },
    ],
  },
  config: {
    width: 1000,
    pageName: 'ddd',
    ratio: 1,
    backgroundColor: '#fff',
  },
}
