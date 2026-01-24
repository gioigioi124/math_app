import { Request, Response, NextFunction } from "express";
import { Progress } from "../models/progress.model";
import { User } from "../models/user.model";

export const getProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("=== Get Progress Request ===");
    console.log("User ID:", (req as any).user.id);

    const progress = await Progress.find({ user: (req as any).user.id });
    console.log(`Found ${progress.length} progress records`);

    res.json(progress);
  } catch (error) {
    console.error("Get Progress Error:", error);
    next(error);
  }
};

export const updateProgress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("=== Progress Update Request ===");
    console.log("User ID:", (req as any).user.id);
    console.log("Body:", JSON.stringify(req.body, null, 2));

    const {
      lessonId,
      activityId,
      status,
      score,
      accuracy,
      stars,
      lessonStatus,
      lessonScore,
    } = req.body;
    const userId = (req as any).user.id;

    let progress = await Progress.findOne({ user: userId, lesson: lessonId });

    if (!progress) {
      progress = new Progress({
        user: userId,
        lesson: lessonId,
        activities: [],
      });
    }

    if (activityId) {
      let activity = progress.activities.find(
        (a) => a.activityId === activityId,
      );
      if (!activity) {
        progress.activities.push({
          activityId,
          status,
          score,
          accuracy,
          stars: stars || 0,
          completedAt: status === "completed" ? new Date() : undefined,
        });
      } else {
        activity.status = status;
        if (score !== undefined) activity.score = score;
        if (accuracy !== undefined) activity.accuracy = accuracy;
        if (stars !== undefined) {
          activity.stars = Math.max(activity.stars || 0, stars);
        }
        if (status === "completed") activity.completedAt = new Date();
      }
    }

    // Update lesson level status
    if (lessonStatus) {
      progress.status = lessonStatus;
      if (lessonStatus === "completed") progress.completedAt = new Date();
    } else if (status && !activityId) {
      // Compatibility with old API format
      progress.status = status;
      if (status === "completed") progress.completedAt = new Date();
    }

    if (lessonScore !== undefined) {
      progress.score = lessonScore;
    } else if (score !== undefined && !activityId) {
      // Compatibility with old API format
      progress.score = score;
    }

    // Calculate total stars for this lesson
    progress.stars = progress.activities.reduce(
      (sum, a) => sum + (a.stars || 0),
      0,
    );

    await progress.save();

    // Sync total stars to User model
    const allUserProgress = await Progress.find({ user: userId });
    const totalStars = allUserProgress.reduce((sum, p) => sum + p.stars, 0);
    await User.findByIdAndUpdate(userId, { totalStars });
    console.log(`Updated User ${userId} totalStars to ${totalStars}`);

    res.json(progress);
  } catch (error) {
    console.error("Update Progress Error:", error);
    next(error);
  }
};
