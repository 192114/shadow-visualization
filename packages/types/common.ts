// 配置分组
export type GroupType = 'basic' | 'style' | 'action'

export enum GroupEnum {
  'basic' = '基本',
  'style' = '内容',
  'action' = '行为',
}

// 配置子项
type FormItemType = 'input' | 'switch' | 'color' | 'json' | 'textarea'

export interface IOptionsItem {
  label: string
  value: string
}

interface IBaseSchema<T> {
  name: keyof T
  label: string
  help?: string
  controlBy?: {
    effectName: string | number
    hiddenValue: (string | number | boolean)[]
  }
}

interface IInputNumberSchema<T> extends IBaseSchema<T> {
  type: 'inputNumber'
  min?: number
  max?: number
  step?: number
}

interface ISelectRadioSchema<T> extends IBaseSchema<T> {
  type: 'select' | 'radio'
  options: IOptionsItem[]
}

interface ICommonSchema<T> extends IBaseSchema<T> {
  type: FormItemType
}

// 属性分组
type WithCollapseSchema<T> = {
  isCollapse: true
  name: string
  schemaList: (
    | IInputNumberSchema<T>
    | ISelectRadioSchema<T>
    | ICommonSchema<T>
  )[]
}[]

export type BasicSchema<T> = {
  [key in GroupType]?:
    | (IInputNumberSchema<T> | ISelectRadioSchema<T> | ICommonSchema<T>)[]
    | WithCollapseSchema<T>
}
