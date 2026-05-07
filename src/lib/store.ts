import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GenerationProgress, Portfolio } from "@/types";

interface AppState {
  // User state
  user: {
    id?: string;
    email?: string;
    name?: string;
    image?: string;
  } | null;
  setUser: (user: AppState["user"]) => void;

  // Generation state
  currentJobPost: string;
  setCurrentJobPost: (jobPost: string) => void;

  generationProgress: GenerationProgress | null;
  setGenerationProgress: (progress: GenerationProgress | null) => void;

  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;

  // Portfolio state
  currentPortfolio: Portfolio | null;
  setCurrentPortfolio: (portfolio: Portfolio | null) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),

      // Generation state
      currentJobPost: "",
      setCurrentJobPost: (jobPost) => set({ currentJobPost: jobPost }),

      generationProgress: null,
      setGenerationProgress: (progress) => set({ generationProgress: progress }),

      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),

      // Portfolio state
      currentPortfolio: null,
      setCurrentPortfolio: (portfolio) => set({ currentPortfolio: portfolio }),

      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "upfolio-storage",
      partialize: (state) => ({
        currentJobPost: state.currentJobPost,
      }),
    }
  )
);