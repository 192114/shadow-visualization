import type { IBackdrop } from '@schema/types'

export const backdropSchema: IBackdrop = {
  type: 'backdrop',
  schema: {
    action: [
      {
        isCollapse: true,
        children: [
          {
            groupName: '类别1',
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
        ],
      },
      {
        isCollapse: true,
        children: [
          {
            groupName: '类别2',
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
        ],
      },
    ],
    basic: [
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
    ],
  },
  config: {
    width: 1000,
    pageName: 'ddd',
    ratio: '16/9',
    backgroundColor: '#fff',
  },
}
