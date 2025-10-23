import { create } from 'zustand';

interface Video {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
}
interface Ad {
  id: string;
  title: string;
  type: string;
  vastUrl: string;
  active: boolean;
  createdAt: string;
}

interface UIState {
  previewVideo: Video | null;
  setPreviewVideo: (video: Video | null) => void;
    previewAd: Ad | null;
  setPreviewAd: (ad: Ad | null) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  previewVideo: null,
  setPreviewVideo: (video) => set({ previewVideo: video }),
   previewAd: null,
  setPreviewAd: (ad) => set({ previewAd: ad }),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
