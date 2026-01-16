import api from "./api";
import { Progress } from "../types/lesson.type";

export const progressApi = {
  getProgress: async (): Promise<Progress[]> => {
    const response = await api.get("/progress");
    return response.data;
  },

  updateProgress: async (
    lessonId: string,
    status: string,
    score: number
  ): Promise<Progress> => {
    const response = await api.post("/progress/update", {
      lessonId,
      status,
      score,
    });
    return response.data;
  },
};
