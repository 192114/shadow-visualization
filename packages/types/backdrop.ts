import { BasicSchema } from './common'

export interface IBackdropConfig {
  width: number
  ratio: number
  backgroundColor: string
  pageName: string
}

export interface IBackdrop {
  config: IBackdropConfig
  schema: BasicSchema<IBackdropConfig>
}

// const a: IBackdrop = {
//   schema: {
//     'action': [
//       {
//         type: 'inputNumber',
//         name: 'pageName',
//         label: 'mm'
//       }
//     ],
//   }
// }