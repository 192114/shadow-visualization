import { BasicSchema } from './common'

export interface IBackdropConfig {
  width: number
  ratio: string
  backgroundColor: string
  pageName: string
}

export interface IBackdrop {
  type: 'backdrop'
  config: IBackdropConfig
  schema: BasicSchema<IBackdropConfig>
}
