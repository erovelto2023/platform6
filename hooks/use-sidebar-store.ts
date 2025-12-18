import { create } from 'zustand';

interface SidebarStore {
    isCollapsed: boolean;
    toggle: () => void;
    expand: () => void;
    collapse: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
    isCollapsed: false,
    toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    expand: () => set({ isCollapsed: false }),
    collapse: () => set({ isCollapsed: true }),
}));
