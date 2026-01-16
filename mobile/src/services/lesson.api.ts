import api from "./api";
import { Lesson } from "../types/lesson.type";

export const lessonApi = {
  getLessons: async (): Promise<Lesson[]> => {
    const response = await api.get("/lessons");
    return response.data;
  },

  getLesson: async (id: string): Promise<Lesson> => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },
};
