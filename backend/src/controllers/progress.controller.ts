import { Request, Response, NextFunction } from "express";
import { Progress } from "../models/progress.model";

export const getProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const progress = await Progress.find({ user: req.user.id });
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lessonId, status, score } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id, lesson: lessonId },
      {
        status,
        score,
        completedAt: status === "completed" ? new Date() : undefined,
      },
      { upsert: true, new: true }
    );
    res.json(progress);
  } catch (error) {
    next(error);
  }
};
