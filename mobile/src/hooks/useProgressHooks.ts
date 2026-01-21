import { useProgress } from "../providers/ProgressProvider";
import { useCallback } from "react";
import { ActivityStatus } from "../types/lesson.types";

/**
 * Custom hook for managing lesson progress
 */
export const useLessonProgress = (lessonId: string) => {
  const { getLessonProgressById, updateLessonProgress } = useProgress();

  const progress = getLessonProgressById(lessonId);

  const updateProgress = useCallback(
    async (
      progressPercent: number,
      completed: number,
      lastActivityId?: string,
    ) => {
      await updateLessonProgress(
        lessonId,
        progressPercent,
        completed,
        lastActivityId,
      );
    },
    [lessonId, updateLessonProgress],
  );

  return {
    progress,
    updateProgress,
    progressPercent: progress?.progress || 0,
    completedActivities: progress?.completed || 0,
    lastActivityId: progress?.lastActivityId,
  };
};

/**
 * Custom hook for managing activity progress
 */
export const useActivityProgress = (lessonId: string, activityId: string) => {
  const { getActivityProgressById, updateActivityProgress } = useProgress();

  const progress = getActivityProgressById(lessonId, activityId);

  const updateProgress = useCallback(
    async (status: ActivityStatus, score?: number, accuracy?: number) => {
      await updateActivityProgress(
        lessonId,
        activityId,
        status,
        score,
        accuracy,
      );
    },
    [lessonId, activityId, updateActivityProgress],
  );

  const markAsStarted = useCallback(async () => {
    await updateProgress("in-progress");
  }, [updateProgress]);

  const markAsCompleted = useCallback(
    async (score: number, accuracy?: number) => {
      await updateProgress("completed", score, accuracy);
    },
    [updateProgress],
  );

  return {
    progress,
    updateProgress,
    markAsStarted,
    markAsCompleted,
    status: progress?.status || "not-started",
    score: progress?.score,
    accuracy: progress?.accuracy,
    attempts: progress?.attempts || 0,
  };
};

/**
 * Custom hook for user stats
 */
export const useUserStats = () => {
  const {
    userStats,
    refreshStats,
    getTotalLessonsCompleted,
    getTotalActivitiesCompleted,
    getAverageScore,
  } = useProgress();

  return {
    stats: userStats,
    refreshStats,
    totalLessonsCompleted: getTotalLessonsCompleted(),
    totalActivitiesCompleted: getTotalActivitiesCompleted(),
    averageScore: getAverageScore(),
  };
};
