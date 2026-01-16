import { Request, Response, NextFunction } from "express";
import * as lessonService from "../services/lesson.service";

export const getLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lessons = await lessonService.getAllLessons();
    res.json(lessons);
  } catch (error) {
    next(error);
  }
};

export const getLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (error) {
    next(error);
  }
};
