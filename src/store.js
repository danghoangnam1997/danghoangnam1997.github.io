// src/store.js (Updated)
import { create } from 'zustand';

export const useStore = create((set) => ({
  // For the 3D thread animation
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  // NEW: For managing the project detail view
  selectedProjectId: null, // null means no project is selected
  selectProject: (projectId) => set({ selectedProjectId: projectId }),
  clearProject: () => set({ selectedProjectId: null }),
}));
