import { Lesson } from "../models/lesson.model";

export const getAllLessons = async () => {
  return await Lesson.find({});
};

export const getLessonById = async (id: string) => {
  return await Lesson.findById(id);
};
