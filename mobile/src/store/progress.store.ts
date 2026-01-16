import { create } from "zustand";
import { Progress } from "../types/lesson.type";

interface ProgressState {
  progress: Progress[];
  setProgress: (progress: Progress[]) => void;
  updateProgress: (lessonId: string, data: Partial<Progress>) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: [],
  setProgress: (progress) => set({ progress }),
  updateProgress: (lessonId, data) =>
    set((state) => ({
      progress: state.progress.map((p) =>
        p.lesson === lessonId ? { ...p, ...data } : p
      ),
    })),
}));
