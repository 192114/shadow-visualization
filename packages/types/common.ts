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

interface ISelectSchema<T> extends IBaseSchema<T> {
  type: 'select'
  options: IOptionsItem[]
}

interface IRadioSchema<T> extends IBaseSchema<T> {
  type: 'radio'
  options: IOptionsItem[]
  direction: 'horizontal' | 'vertical'
}

interface ICommonSchema<T> extends IBaseSchema<T> {
  type: FormItemType
}

export type SchemaListItem<T> = IInputNumberSchema<T>
| ISelectSchema<T>
| IRadioSchema<T>
| ICommonSchema<T>

// 属性分组
type WithCollapseSchema<T> = {
  isCollapse: true
  children: {
    groupName: string
    schemaList: SchemaListItem<T>[]
  }[]
}[]

export type BasicSchema<T> = {
  [key in GroupType]?:
    | SchemaListItem<T>[]
    | WithCollapseSchema<T>
}
