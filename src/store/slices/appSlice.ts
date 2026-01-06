import { create } from 'zustand'

interface AppState {
  collapsed: boolean
  theme: 'light' | 'dark'
  setCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useAppStore = create<AppState>((set) => ({
  collapsed: false,
  theme: 'light',
  setCollapsed: (collapsed) => set({ collapsed }),
  setTheme: (theme) => set({ theme })
}))
