// 背景及拖拽项目store
import type { IBackdrop } from '@schema/types'
import type { LineSchema } from '@shared/ui'
import Decimal from 'decimal.js-light'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { backdropSchema } from '~/schema/index'

// 配置列表
interface CardListItem {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'line' | 'bar' | 'pie'
}

interface CardListState {
  cardList: CardListItem[]
}

interface CardListActions {
  add: (initialState: Omit<CardListItem, 'id'>, id?: string) => void
  remove: (id: string) => void
  resize: (id: string, width: number, height: number) => void
  changeCoordinates: (id: string, x: number, y: number) => void
  setCoordinates: (id: string, x: number, y: number) => void
  updateKey: (preId: string) => void
}

export const useCardListStore = create(
  immer<CardListState & CardListActions>((set) => ({
    cardList: [],
    add: (initialState, id) =>
      set((state) => {
        const cardId = id ?? nanoid()
        state.cardList.push({
          ...initialState,
          id: cardId,
        })
      }),

    remove: (id: string) =>
      set((state) => {
        state.cardList = state.cardList.filter((item) => item.id !== id)
      }),
    resize: (id: string, width: number, height: number) =>
      set((state) => {
        const current = state.cardList.find((item) => item.id === id)
        if (current) {
          current.width = width
          current.height = height
        }
      }),

    changeCoordinates: (id: string, x: number, y: number) =>
      set((state) => {
        const current = state.cardList.find((item) => item.id === id)
        if (current) {
          current.x = new Decimal(current.x).add(x).toNumber()
          current.y = new Decimal(current.y).add(y).toNumber()
        }
      }),

    setCoordinates: (id: string, x: number, y: number) =>
      set((state) => {
        const current = state.cardList.find((item) => item.id === id)
        if (current) {
          current.x = new Decimal(x).toNumber()
          current.y = new Decimal(y).toNumber()
        }
      }),

    updateKey: (preId) =>
      set((state) => {
        const current = state.cardList.find((item) => item.id === preId)
        if (current) {
          current.id = nanoid()
        }
      }),
  }))
)

// 可拖拽底板
type Base = IBackdrop['config']
interface DragPanelState extends Base {
  height: number
}

interface DragPanelAction {
  setPanelState: (payload: Omit<DragPanelState, 'height'>) => void
}

export const useDragPanelStore = create(
  persist(
    immer<DragPanelState & DragPanelAction>((set) => {
      const { width, ratio, backgroundColor, pageName } = backdropSchema.config
      const [ratioWidth, ratioHeight] = ratio.split('/')
      const height = new Decimal(width)
        .dividedBy(ratioWidth)
        .times(ratioHeight)
        .toNumber()
      return {
        width,
        ratio,
        height,
        backgroundColor,
        pageName,
        setPanelState: (payload) =>
          set((state) => {
            const { width, ratio, pageName, backgroundColor } = payload
            const [ratioWidth, ratioHeight] = ratio.split('/') // [width, height]
            state.width = width
            state.ratio = ratio
            state.pageName = pageName
            state.backgroundColor = backgroundColor
            state.height = new Decimal(width)
              .dividedBy(ratioWidth)
              .times(ratioHeight)
              .toNumber()
          }),
      }
    }),
    { name: 'dragPanel', storage: createJSONStorage(() => sessionStorage) }
  )
)

// 当前配置信息
type SchemaConfig = IBackdrop | LineSchema

interface CurrentSchemaState {
  schemaConfig: SchemaConfig | null
}

type Config = SchemaConfig['config']

interface CurrentSchemaActions {
  setAll: (schemaConfig: SchemaConfig) => void
  setConfig: (config: Config) => void
}

export const useCurrentSchema = create(
  immer<CurrentSchemaState & CurrentSchemaActions>((set) => ({
    schemaConfig: null,
    setConfig: (config) =>
      set((state) => {
        if (state.schemaConfig !== null) {
          state.schemaConfig.config = config
        }
      }),
    setAll: (schemaConfig) =>
      set((state) => {
        state.schemaConfig = schemaConfig
      }),
  }))
)
