import { BasicSchema } from './common'

export interface IBackdropConfig {
  width: number
  ratio: number
  backgroundColor: string
  pageName: string
}

export interface IBackdrop {
  config: IBackdropConfig
  schema: BasicSchema<IBackdropConfig>[]
}

/**
 * demo 
 */
const a: IBackdrop = {
  config: {
    width: 1280,
    ratio: 9 / 16,
    backgroundColor: '#fff',
    pageName: '',
  },
  schema: [
    {
      name: 'pageName',
      type: 'input',
      label: '页面名称',
      belong: 'basic',
    },
    {
      type: 'select',
      label: '页面名称',
      belong: 'basic',
      name: 'ratio',
      options: [
        {
          label: '16 / 9',
          value: '9 / 16',
        },
      ],
    },

    // {
    //   name: 'width',
    //   type: 'inputNumber',
    //   label: '页面名称',
    //   belong: 'basic',
    // },
  ],
}

