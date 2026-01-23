import { Request, Response, NextFunction } from "express";
import * as lessonService from "../services/lesson.service";

export const getLessons = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const grade = req.query.grade ? Number(req.query.grade) : undefined;
    const lessons = await lessonService.getAllLessons(grade);
    res.json(lessons);
  } catch (error) {
    next(error);
  }
};

export const getLesson = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lesson = await lessonService.getLessonById(String(req.params.id));
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (error) {
    next(error);
  }
};

export const getLessonQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const questions = await lessonService.getQuestionsByLessonId(
      String(req.params.id),
    );
    res.json(questions);
  } catch (error) {
    next(error);
  }
};
