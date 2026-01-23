import { Lesson } from "../models/lesson.model";
import { Question } from "../models/question.model";

export const getAllLessons = async (grade?: number) => {
  const query = grade ? { grade } : {};
  return await Lesson.find(query);
};

export const getLessonById = async (id: string) => {
  return await Lesson.findById(id);
};

export const getQuestionsByLessonId = async (lessonId: string) => {
  return await Question.find({ lessonId });
};
