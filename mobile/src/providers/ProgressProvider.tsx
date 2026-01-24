import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useUser } from "./UserProvider";
import { LessonProgress, ActivityProgress } from "../types/lesson.types";
import {
  saveLessonProgress,
  getAllLessonProgress,
  saveActivityProgress,
  getLessonActivitiesProgress,
  getUserStats,
  calculateUserStats,
  updateUserStats,
  UserStats,
} from "../services/progress.service";
import { apiService } from "../services/api.service";

interface ProgressContextType {
  // Lesson Progress
  lessonProgressMap: Map<string, LessonProgress>;
  getLessonProgressById: (lessonId: string) => LessonProgress | undefined;
  updateLessonProgress: (
    lessonId: string,
    progress: number,
    completed: number,
    lastActivityId?: string,
  ) => Promise<void>;

  // Activity Progress
  activityProgressMap: Map<string, ActivityProgress>;
  getActivityProgressById: (
    lessonId: string,
    activityId: string,
  ) => ActivityProgress | undefined;
  updateActivityProgress: (
    lessonId: string,
    activityId: string,
    status: ActivityProgress["status"],
    score?: number,
    accuracy?: number,
  ) => Promise<void>;

  // User Stats
  userStats: UserStats | null;
  refreshStats: () => Promise<void>;

  // Loading
  loading: boolean;

  // Utilities
  getTotalLessonsCompleted: () => number;
  getTotalActivitiesCompleted: () => number;
  getAverageScore: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined,
);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [lessonProgressMap, setLessonProgressMap] = useState<
    Map<string, LessonProgress>
  >(new Map());
  const [activityProgressMap, setActivityProgressMap] = useState<
    Map<string, ActivityProgress>
  >(new Map());
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all progress when component mounts or user changes
  useEffect(() => {
    loadAllProgress();
  }, [user]);

  const loadAllProgress = async () => {
    try {
      setLoading(true);

      // Load all lesson progress
      const allLessonProgress = await getAllLessonProgress();
      setLessonProgressMap(new Map(Object.entries(allLessonProgress)));

      // Load user stats
      const stats = await getUserStats();
      if (stats) {
        setUserStats(stats);
      } else {
        // Calculate initial stats
        const calculatedStats = await calculateUserStats();
        setUserStats(calculatedStats);
        await updateUserStats(calculatedStats);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== Lesson Progress ====================

  const getLessonProgressById = useCallback(
    (lessonId: string): LessonProgress | undefined => {
      return lessonProgressMap.get(lessonId);
    },
    [lessonProgressMap],
  );

  const updateLessonProgress = async (
    lessonId: string,
    progress: number,
    completed: number,
    lastActivityId?: string,
  ) => {
    try {
      const newProgress: LessonProgress = {
        lessonId,
        progress,
        completed,
        lastActivityId,
        updatedAt: new Date().toISOString(),
      };

      // Save to storage
      await saveLessonProgress(lessonId, newProgress);

      // Update local state
      const newMap = new Map(lessonProgressMap);
      newMap.set(lessonId, newProgress);
      setLessonProgressMap(newMap);

      // Refresh stats
      await refreshStats();

      // Sync to backend if logged in
      if (user) {
        try {
          await apiService.updateProgress({
            lessonId,
            status: progress === 100 ? "completed" : "available",
          });
        } catch (error) {
          console.error("Failed to sync lesson progress to backend:", error);
        }
      }
    } catch (error) {
      console.error("Failed to update lesson progress:", error);
    }
  };

  // ==================== Activity Progress ====================

  const getActivityProgressById = useCallback(
    (lessonId: string, activityId: string): ActivityProgress | undefined => {
      const key = `${lessonId}_${activityId}`;
      return activityProgressMap.get(key);
    },
    [activityProgressMap],
  );

  const updateActivityProgress = async (
    lessonId: string,
    activityId: string,
    status: ActivityProgress["status"],
    score?: number,
    accuracy?: number,
  ) => {
    try {
      const existing = getActivityProgressById(lessonId, activityId);

      // Calculate stars based on score
      const earnedStars =
        score !== undefined
          ? score >= 90
            ? 3
            : score >= 70
              ? 2
              : score >= 50
                ? 1
                : 0
          : 0;
      const existingStars = existing?.stars || 0;
      const finalStars = Math.max(existingStars, earnedStars);
      const starDiff = finalStars - existingStars;

      const newProgress: ActivityProgress = {
        activityId,
        lessonId,
        status,
        score,
        accuracy,
        stars: finalStars,
        completedAt:
          status === "completed"
            ? new Date().toISOString()
            : existing?.completedAt,
        attempts: (existing?.attempts || 0) + 1,
      };

      // Save to storage
      await saveActivityProgress(lessonId, activityId, newProgress);

      // Update local state
      const key = `${lessonId}_${activityId}`;
      const newMap = new Map(activityProgressMap);
      newMap.set(key, newProgress);
      setActivityProgressMap(newMap);

      // Update user stats with new stars if any
      if (starDiff > 0 && userStats) {
        const updatedStats = {
          ...userStats,
          totalStarsEarned: (userStats.totalStarsEarned || 0) + starDiff,
        };
        setUserStats(updatedStats);
        await updateUserStats(updatedStats);
      }

      // Update lesson progress based on activities
      await updateLessonProgressFromActivities(lessonId);

      // Refresh stats
      await refreshStats();

      // Sync to backend if logged in
      if (user) {
        try {
          await apiService.updateProgress({
            lessonId,
            activityId,
            status,
            score,
            accuracy,
            stars: finalStars,
          });
        } catch (error) {
          console.error("Failed to sync activity progress to backend:", error);
        }
      }
    } catch (error) {
      console.error("Failed to update activity progress:", error);
    }
  };

  const updateLessonProgressFromActivities = async (lessonId: string) => {
    try {
      // Get all activities for this lesson
      const activities = await getLessonActivitiesProgress(lessonId);
      const activityList = Object.values(activities);

      if (activityList.length === 0) return;

      // Calculate completed count
      const completedCount = activityList.filter(
        (a) => a.status === "completed",
      ).length;

      // Calculate progress percentage
      const totalActivities = activityList.length;
      const progress = Math.round((completedCount / totalActivities) * 100);

      // Find last activity
      const lastActivity = activityList.reduce((latest, current) => {
        if (!latest) return current;
        const latestDate = latest.completedAt || "";
        const currentDate = current.completedAt || "";
        return currentDate > latestDate ? current : latest;
      }, activityList[0]);

      // Update lesson progress
      await updateLessonProgress(
        lessonId,
        progress,
        completedCount,
        lastActivity.activityId,
      );
    } catch (error) {
      console.error("Failed to update lesson progress from activities:", error);
    }
  };

  // ==================== User Stats ====================

  const refreshStats = async () => {
    try {
      const calculatedStats = await calculateUserStats();
      setUserStats(calculatedStats);
      await updateUserStats(calculatedStats);
    } catch (error) {
      console.error("Failed to refresh stats:", error);
    }
  };

  // ==================== Utilities ====================

  const getTotalLessonsCompleted = useCallback((): number => {
    let count = 0;
    lessonProgressMap.forEach((progress) => {
      if (progress.progress === 100) {
        count++;
      }
    });
    return count;
  }, [lessonProgressMap]);

  const getTotalActivitiesCompleted = useCallback((): number => {
    let count = 0;
    activityProgressMap.forEach((progress) => {
      if (progress.status === "completed") {
        count++;
      }
    });
    return count;
  }, [activityProgressMap]);

  const getAverageScore = useCallback((): number => {
    let totalScore = 0;
    let count = 0;

    activityProgressMap.forEach((progress) => {
      if (progress.score !== undefined) {
        totalScore += progress.score;
        count++;
      }
    });

    return count > 0 ? Math.round(totalScore / count) : 0;
  }, [activityProgressMap]);

  return (
    <ProgressContext.Provider
      value={{
        lessonProgressMap,
        getLessonProgressById,
        updateLessonProgress,
        activityProgressMap,
        getActivityProgressById,
        updateActivityProgress,
        userStats,
        refreshStats,
        loading,
        getTotalLessonsCompleted,
        getTotalActivitiesCompleted,
        getAverageScore,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
