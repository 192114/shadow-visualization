import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleDark: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleDark: () => set((state) => ({ isDark: !state.isDark })),
}))

interface ConfigPanelState {
  open: boolean
  toggleOpen: () => void
}

export const useConfigPanelStore = create<ConfigPanelState>((set) => ({
  open: false,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}))
