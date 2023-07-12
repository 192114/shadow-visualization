import Decimal from 'decimal.js-light'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface ThemeState {
  isDark: boolean
  toggleDark: () => void
  setIsDark: (isDark: boolean) => void
}
// 暗夜切换
export const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      isDark: false,
      toggleDark: () => set((state) => ({ isDark: !state.isDark })),
      setIsDark: (isDark) => set(() => ({ isDark })),
    }),
    { name: 'theme' }
  )
)

interface ConfigPanelState {
  open: boolean
  toggleOpen: () => void
}
// 右侧配置栏
export const useConfigPanelStore = create<ConfigPanelState>((set) => ({
  open: true,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}))

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
  persist(
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
    })),
    { name: 'dragTools' }
  )
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
