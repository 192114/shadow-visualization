type FormItemType = 'input' | 'switch' | 'color' | 'json' | 'textarea'

export interface IOptionsItem {
  label: string
  value: string
}

export type GroupType = 'basic' | 'style' | 'action'

export enum GroupEnum {
  basic = '基本',
  style = '内容',
  action = '行为',
}

interface IBaseSchema<T> {
  belong: GroupType
  name: keyof T
  label: string
  help?: string
  controlBy?: {
    effectName: string | number
    hiddenValue: (string | number | boolean)[]
  }
}

interface IInputNumberSchema<T> extends IBaseSchema<T> {
  // type: T[keyof T] extends number ? 'inputNumber' : never // 联合类型 永远是 never
  type: 'inputNumber'
  min?: number
  max?: number
  step?: number
}

interface ISelectRadioSchema<T> extends IBaseSchema<T>  {
  type: 'select' | 'radio'
  options: IOptionsItem[]
}

interface ICommonSchema<T> extends IBaseSchema<T> {
  type: FormItemType
}

export type BasicSchema<T> = IInputNumberSchema<T> | ISelectRadioSchema<T> | ICommonSchema<T>
