import { create } from "zustand";

export type MenuScreen = "main" | "levels" | "settings" | "auth" | "multiplayer" | "game";

interface MenuState {
  currentScreen: MenuScreen;
  selectedMenuItem: number;
  
  // Actions
  setCurrentScreen: (screen: MenuScreen) => void;
  setSelectedMenuItem: (index: number) => void;
  navigateUp: () => void;
  navigateDown: () => void;
}

export const useMenu = create<MenuState>((set, get) => ({
  currentScreen: "main",
  selectedMenuItem: 0,
  
  setCurrentScreen: (screen) => {
    set({ currentScreen: screen, selectedMenuItem: 0 });
  },
  
  setSelectedMenuItem: (index) => {
    set({ selectedMenuItem: index });
  },
  
  navigateUp: () => {
    const { selectedMenuItem } = get();
    set({ selectedMenuItem: Math.max(0, selectedMenuItem - 1) });
  },
  
  navigateDown: () => {
    const { selectedMenuItem } = get();
    // Max items depend on current screen - could be made dynamic
    const maxItems = 3; // For main menu
    set({ selectedMenuItem: Math.min(maxItems - 1, selectedMenuItem + 1) });
  }
}));
