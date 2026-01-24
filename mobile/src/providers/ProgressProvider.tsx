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
  getAllActivityProgress,
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

  const syncFromBackend = useCallback(async () => {
    try {
      const backendProgress = await apiService.getAllProgress();
      if (!backendProgress || !Array.isArray(backendProgress)) return;

      const syncedLessonProgress: Record<string, LessonProgress> = {};
      const syncedActivityProgress: Record<string, ActivityProgress> = {};

      for (const item of backendProgress) {
        // 1. Sync Lesson Progress
        const lessonId = item.lesson;
        const lessonProg: LessonProgress = {
          lessonId,
          progress: item.status === "completed" ? 100 : item.score || 0,
          completed: item.activities.filter(
            (a: any) => a.status === "completed",
          ).length,
          updatedAt: item.updatedAt || new Date().toISOString(),
        };

        await saveLessonProgress(lessonId, lessonProg);
        syncedLessonProgress[lessonId] = lessonProg;

        // 2. Sync Activity Progress
        if (item.activities && Array.isArray(item.activities)) {
          for (const act of item.activities) {
            const actProg: ActivityProgress = {
              activityId: act.activityId,
              lessonId,
              status: act.status,
              score: act.score,
              accuracy: act.accuracy,
              stars: act.stars,
              completedAt: act.completedAt,
              attempts: 1,
            };

            await saveActivityProgress(lessonId, act.activityId, actProg);
            syncedActivityProgress[`${lessonId}_${act.activityId}`] = actProg;
          }
        }
      }

      // Merge with existing local state
      setLessonProgressMap(
        (prev) => new Map([...prev, ...Object.entries(syncedLessonProgress)]),
      );
      setActivityProgressMap(
        (prev) => new Map([...prev, ...Object.entries(syncedActivityProgress)]),
      );

      // Recalculate stats based on newly synced data
      const calculatedStats = await calculateUserStats();
      setUserStats(calculatedStats);
      await updateUserStats(calculatedStats);
    } catch (error) {
      console.error("Failed to sync from backend:", error);
    }
  }, []);

  const loadAllProgress = useCallback(async () => {
    try {
      setLoading(true);

      // Load all lesson progress from local storage
      const allLessonProgress = await getAllLessonProgress();
      setLessonProgressMap(new Map(Object.entries(allLessonProgress)));

      // Load all activity progress from local storage
      const allActivityProgress = await getAllActivityProgress();
      setActivityProgressMap(new Map(Object.entries(allActivityProgress)));

      // If user is logged in, sync from backend to get latest data
      if (user && user.type === "user") {
        await syncFromBackend();
      } else {
        // For guest/offline, just load user stats from local storage
        const stats = await getUserStats();
        if (stats) {
          setUserStats(stats);
        } else {
          // Calculate initial stats from loaded local data
          const calculatedStats = await calculateUserStats();
          setUserStats(calculatedStats);
          await updateUserStats(calculatedStats);
        }
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setLoading(false);
    }
  }, [user, syncFromBackend]);

  // Load all progress when component mounts or user changes
  useEffect(() => {
    // Nếu user đăng xuất (null), xóa sạch state ngay lập tức
    if (!user) {
      setLessonProgressMap(new Map());
      setActivityProgressMap(new Map());
      setUserStats(null);
    }
    loadAllProgress();
  }, [user, loadAllProgress]);

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
    skipSync: boolean = false,
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

      // Refresh stats with current state
      await refreshStats(undefined, newMap);

      // Sync to backend if logged in (not guest)
      if (user && user.type === "user" && !skipSync) {
        try {
          await apiService.updateProgress({
            lessonId,
            lessonStatus: progress === 100 ? "completed" : "available",
            lessonScore: progress,
          } as any);
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

      // 1. Local update for activity
      const key = `${lessonId}_${activityId}`;
      const newMap = new Map(activityProgressMap);
      newMap.set(key, newProgress);
      setActivityProgressMap(newMap);

      // 2. Local update for lesson (passing true to skip immediate sync)
      const activityList = Array.from(newMap.values()).filter(
        (a) => a.lessonId === lessonId,
      );
      const completedCount = activityList.filter(
        (a) => a.status === "completed",
      ).length;
      const totalActivities = activityList.length;
      const progress = Math.round((completedCount / totalActivities) * 100);

      // Update local lesson state but skip sync (we'll do it combined below)
      await updateLessonProgress(
        lessonId,
        progress,
        completedCount,
        activityId,
        true,
      );

      // 3. Refresh stats with current state
      await refreshStats(newMap);

      // 4. COMBINED Sync to backend
      if (user && user.type === "user") {
        try {
          await apiService.updateProgress({
            lessonId,
            activityId,
            status,
            score,
            accuracy,
            stars: finalStars,
            lessonStatus: progress === 100 ? "completed" : "available",
            lessonScore: progress,
          } as any);
        } catch (error) {
          console.error("Failed to sync combined progress to backend:", error);
        }
      }
    } catch (error) {
      console.error("Failed to update activity progress:", error);
    }
  };

  // ==================== User Stats ====================

  const refreshStats = async (
    customActivityMap?: Map<string, ActivityProgress>,
    customLessonMap?: Map<string, LessonProgress>,
  ) => {
    try {
      const calculatedStats = await calculateUserStats(
        customLessonMap || lessonProgressMap,
        customActivityMap || activityProgressMap,
      );
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
