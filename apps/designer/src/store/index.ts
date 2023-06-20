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
          current.x = current.x + x
          current.y = current.y + y
        }
      }),
  }))
)
