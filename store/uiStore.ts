import { create } from 'zustand';

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
}

interface UIState {
  previewVideo: Video | null;
  setPreviewVideo: (video: Video | null) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  previewVideo: null,
  setPreviewVideo: (video) => set({ previewVideo: video }),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
