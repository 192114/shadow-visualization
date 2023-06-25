import Decimal from 'decimal.js-light'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface ThemeState {
  isDark: boolean
  toggleDark: () => void
}
// 暗夜切换
export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleDark: () => set((state) => ({ isDark: !state.isDark })),
}))

interface ConfigPanelState {
  open: boolean
  toggleOpen: () => void
}
// 右侧配置栏
export const useConfigPanelStore = create<ConfigPanelState>((set) => ({
  open: false,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}))

// 配置列表
interface CardListItem {
  id: string
  x: number
  y: number
  width: number
  height: number
}

interface CardListState {
  cardList: CardListItem[]
}

interface CardListActions {
  add: () => void
  resize: (id: string, width: number, height: number) => void
  changeCoordinates: (id: string, x: number, y: number) => void
}

const defaultCardItem = {
  x: 0,
  y: 0,
  width: 200,
  height: 200,
}

export const useCardListStore = create(
  immer<CardListState & CardListActions>((set) => ({
    cardList: [
      {
        ...defaultCardItem,
        id: nanoid(),
      },
      {
        ...defaultCardItem,
        id: nanoid(),
      },
    ],
    add: () =>
      set((state) => {
        const id = nanoid()
        state.cardList.push({
          ...defaultCardItem,
          id,
        })
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
  }))
)

// 可拖拽底板
interface DragPanelState {
  width: number
  ratio: number
  height: number
}

export const useDragPanelStore = create(
  immer<DragPanelState>((set) => ({
    width: 1280,
    ratio: 9 / 16,
    height: new Decimal(1280).times(9 / 16).toNumber(),
  }))
)

// 工具栏
interface DragToolsState {
  x: number
  y: number
  isShow: boolean
}

interface DragToolsActions {
  changeCoordinates: (x: number, y: number) => void
  toggleShow: () => void
}

export const useDragToolsStore = create(
  immer<DragToolsState & DragToolsActions>((set) => ({
    x: 400,
    y: 700,
    isShow: true,
    changeCoordinates: (x, y) => {
      return set((state) => {
        state.x = new Decimal(state.x).add(x).toNumber()
        state.y = new Decimal(state.y).add(y).toNumber()
      })
    },
    toggleShow: () =>
      set((state) => {
        state.isShow = !state.isShow
      }),
  }))
)

// 网格配置信息
interface PanelGridState {
  isShow: boolean
  gap: number
}

interface PanelGridActions {
  toggleShow: () => void
  changeGap: (gap: number) => void
}

export const usePanelGridStore = create(
  immer<PanelGridState & PanelGridActions>((set) => ({
    isShow: false,
    gap: 50,
    toggleShow: () =>
      set((state) => {
        state.isShow = !state.isShow
      }),
    changeGap: (gap) =>
      set((state) => {
        state.gap = gap
      }),
  }))
)
